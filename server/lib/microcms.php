<?php
// microCMS中継の共通ロジック（api/works.php から利用）
// mainブランチの src/lib/microcms.ts と同じレスポンス形式:
//   - 一覧: GET ?limit=12&offset=0 → {contents, totalCount, offset, limit}
//   - 詳細: GET ?id=xxx            → 記事オブジェクト（無ければ404）
//
// 施工実績一覧は「静的写真（土台）＋ microCMS記事（追記）」の2層構成:
//   - 静的写真 … works-manifest.json。実写真を選別・最適化したもの
//                （scripts/build-works-images.py が生成。main側の src/lib/staticWorks.ts と同じJSONを読む）
//   - microCMS … 契約後に登録した実績記事。新しい順で静的写真の"上"に積まれる
// MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY 未設定の間は静的写真だけを返す。

require_once __DIR__ . '/config.php';

function respondJson(int $status, mixed $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function fetchMicroCMS(string $path, array $params): array
{
    $url = 'https://' . MICROCMS_SERVICE_DOMAIN . '.microcms.io/api/v1/' . $path;
    if ($params !== []) {
        $url .= '?' . http_build_query($params);
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['X-MICROCMS-API-KEY: ' . MICROCMS_API_KEY],
        CURLOPT_TIMEOUT        => 10,
    ]);
    $body   = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($body === false) {
        throw new RuntimeException('microCMS request failed: curl error');
    }
    return ['status' => $status, 'json' => json_decode($body, true)];
}

// ── microCMS レスポンスの正規化 ────────────────────────────────────────────
// main側の src/lib/microcms.ts の normalizeCmsWork と同じ処理。
// 実際のworks APIは「カテゴリ（セレクト）＋画像」だけの構成で、一覧が期待する形と違う:
//   実際 : { id, category: ["interior"], image: {url,width,height}, publishedAt }
//   期待 : { id, title, category: {id,name}, eyecatch, thumb, photoOnly, ... }
// 記事側にタイトル・本文を足さなくても運用できるよう、ここで吸収する。
// title / eyecatch / tags を後から microCMS に足しても壊れないよう「あれば使う」形。

/**
 * カテゴリーの表示名。main側の src/lib/serviceCategories.ts と必ず揃えること
 * （microCMSはIDしか持たないため、日本語名はアプリ側が正）。
 */
const SERVICE_CATEGORY_NAMES = [
    'mortar'   => 'モルタル造形制作',
    'interior' => '内装・インテリア塗装',
    'aging'    => 'エイジング塗装',
    'special'  => '特殊塗装',
    'hyoheki'  => '氷壁',
];

/**
 * microCMSの画像API。幅を指定してWebPに変換させる。
 * 静的exportではnext/imageの最適化が効かないため、縮小はこのクエリが担う。
 */
function cmsImage(array $img, int $maxWidth): array
{
    $w = (int)($img['width'] ?? $maxWidth);
    $h = (int)($img['height'] ?? $maxWidth);
    $scale = $w > $maxWidth ? $maxWidth / $w : 1;
    $outW = (int)round($w * $scale);

    return [
        'url'    => $img['url'] . '?fm=webp&w=' . $outW . '&q=82',
        'width'  => $outW,
        'height' => (int)round($h * $scale),
    ];
}

/**
 * セレクト＝["interior"] / テキスト＝"interior" / コンテンツ参照＝{id,name} を許容する。
 */
function normalizeCategory(mixed $raw): ?array
{
    if (is_array($raw) && array_is_list($raw)) {
        $id = $raw[0] ?? null;
        $fallback = null;
    } elseif (is_array($raw)) {
        $id = $raw['id'] ?? null;
        $fallback = $raw['name'] ?? null;
    } elseif (is_string($raw)) {
        $id = $raw;
        $fallback = null;
    } else {
        return null;
    }
    if (!$id) {
        return null;
    }
    return ['id' => $id, 'name' => SERVICE_CATEGORY_NAMES[$id] ?? $fallback ?? $id];
}

function normalizeCmsWork(array $raw): array
{
    $category = normalizeCategory($raw['category'] ?? null);
    $img = $raw['eyecatch'] ?? $raw['image'] ?? null;
    $title = $raw['title'] ?? '';

    $post = [
        'id'          => $raw['id'],
        'title'       => $title !== '' ? $title : ($category['name'] ?? '施工実績'),
        'category'    => $category,
        'publishedAt' => $raw['publishedAt'] ?? null,
        // タイトルが無い記事＝写真のみ。静的写真と同じくライトボックスで拡大し、
        // 詳細ページへは飛ばさない（本文が無いので開いても白紙になる）
        'photoOnly'   => $title === '',
    ];
    if (is_array($img)) {
        $post['eyecatch'] = cmsImage($img, 1600);
        $post['thumb']    = cmsImage($img, 800);
    }
    if (!empty($raw['content'])) {
        $post['content'] = $raw['content'];
    }
    if (!empty($raw['tags'])) {
        $post['tags'] = $raw['tags'];
    }
    return $post;
}

/**
 * 静的写真の実績を読む。build-xserver.sh が out/ をそのまま公開ディレクトリに置くので、
 * マニフェストは lib/ の1つ上（＝サイトのルート）に来る。
 * retired が立っているものは microCMS へ記事として移行済みなので一覧から外す。
 */
function loadStaticWorks(string $category = ''): array
{
    $file = __DIR__ . '/../works-manifest.json';
    if (!is_file($file)) {
        return [];
    }
    $all = json_decode(file_get_contents($file), true) ?? [];
    return array_values(array_filter($all, function ($w) use ($category) {
        if (!empty($w['retired'])) {
            return false;
        }
        return $category === '' || ($w['category']['id'] ?? '') === $category;
    }));
}

/**
 * 中継APIのエントリポイント。$endpoint は 'works'。
 */
function handlePostsRequest(string $endpoint): never
{
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        respondJson(405, ['error' => 'Method Not Allowed']);
    }

    $configured = MICROCMS_SERVICE_DOMAIN !== '' && MICROCMS_API_KEY !== '';
    $id = isset($_GET['id']) ? (string)$_GET['id'] : '';

    try {
        // ── 詳細 ──
        if ($id !== '') {
            // 静的写真は写真のみで本文を持たないため詳細ページを作らない（一覧でライトボックス表示）
            if (str_starts_with($id, 'static-') || !$configured) {
                respondJson(404, ['error' => '記事が見つかりません']);
            }
            $res = fetchMicroCMS($endpoint . '/' . rawurlencode($id), []);
            if ($res['status'] === 404) {
                respondJson(404, ['error' => '記事が見つかりません']);
            }
            if ($res['status'] !== 200) {
                throw new RuntimeException('microCMS request failed: ' . $res['status']);
            }
            $post = normalizeCmsWork($res['json']);
            // タイトルも本文も無い＝写真のみの記事。一覧のライトボックスで見せるので
            // 詳細ページは持たせない（静的写真と同じ扱い）
            if ($post['photoOnly']) {
                respondJson(404, ['error' => '記事が見つかりません']);
            }
            respondJson(200, $post);
        }

        // ── 一覧 ──
        $limit    = min(max((int)($_GET['limit'] ?? 12), 1), 50);
        $offset   = max((int)($_GET['offset'] ?? 0), 0);
        // カテゴリー絞り込み（未指定=全件）。mainの getPostList({category}) と同じ挙動。
        $category = isset($_GET['category']) ? (string)$_GET['category'] : '';

        $statics = loadStaticWorks($category);

        if (!$configured) {
            respondJson(200, [
                'contents'   => array_slice($statics, $offset, $limit),
                'totalCount' => count($statics),
                'offset'     => $offset,
                'limit'      => $limit,
            ]);
        }

        $params = [
            'limit'  => $limit,
            'offset' => $offset,
            // 存在しないフィールド名を混ぜてもmicroCMSは無視するだけなので、
            // 現行スキーマ(image)と将来の拡張(title/eyecatch/tags)をまとめて要求している
            'fields' => 'id,title,image,eyecatch,category,tags,publishedAt',
            'orders' => '-publishedAt',
        ];
        // categoryは「セレクト」フィールド＝配列で保存されるため equals では一致しない。
        // 配列・文字列のどちらにも効く contains を使う。
        if ($category !== '') {
            $params['filters'] = 'category[contains]' . $category;
        }
        $res = fetchMicroCMS($endpoint, $params);
        if ($res['status'] !== 200) {
            throw new RuntimeException('microCMS request failed: ' . $res['status']);
        }

        // microCMS記事を先に並べ、要求件数に足りない分を静的写真で埋める。
        // offset が microCMS の総件数を超えていれば、その超過分が静的写真側の開始位置になる。
        $cmsContents = array_map('normalizeCmsWork', $res['json']['contents'] ?? []);
        $cmsTotal    = (int)($res['json']['totalCount'] ?? 0);
        $shortfall   = $limit - count($cmsContents);
        $filler      = $shortfall > 0
            ? array_slice($statics, max(0, $offset - $cmsTotal), $shortfall)
            : [];

        respondJson(200, [
            'contents'   => array_merge($cmsContents, $filler),
            'totalCount' => $cmsTotal + count($statics),
            'offset'     => $offset,
            'limit'      => $limit,
        ]);
    } catch (Throwable $e) {
        respondJson(502, ['error' => '記事の取得に失敗しました。しばらくしてから再度お試しください。']);
    }
}

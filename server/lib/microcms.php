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
            respondJson(200, $res['json']);
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
            'fields' => 'id,title,eyecatch,category,tags,publishedAt',
            'orders' => '-publishedAt',
        ];
        // microCMSのフィルタ構文で該当カテゴリーのみ取得
        if ($category !== '') {
            $params['filters'] = 'category[equals]' . $category;
        }
        $res = fetchMicroCMS($endpoint, $params);
        if ($res['status'] !== 200) {
            throw new RuntimeException('microCMS request failed: ' . $res['status']);
        }

        // microCMS記事を先に並べ、要求件数に足りない分を静的写真で埋める。
        // offset が microCMS の総件数を超えていれば、その超過分が静的写真側の開始位置になる。
        $cmsContents = $res['json']['contents'] ?? [];
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

<?php
// microCMS中継の共通ロジック（api/works.php から利用）
// mainブランチの src/app/api/_lib/postsHandler.ts と同じレスポンス形式:
//   - 一覧: GET ?limit=12&offset=0 → {contents, totalCount, offset, limit}
//   - 詳細: GET ?id=xxx            → 記事オブジェクト（無ければ404）
// MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY 未設定時は lib/ 内の
// サンプルJSONを返す（microCMS登録前でも画面確認できるように）。

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

function loadSamplePosts(string $endpoint): array
{
    $file = __DIR__ . '/sample-' . $endpoint . '.json';
    return json_decode(file_get_contents($file), true) ?? [];
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
            if (!$configured) {
                foreach (loadSamplePosts($endpoint) as $post) {
                    if ($post['id'] === $id) {
                        respondJson(200, $post);
                    }
                }
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

        if (!$configured) {
            $posts = loadSamplePosts($endpoint);
            if ($category !== '') {
                $posts = array_values(array_filter(
                    $posts,
                    fn($p) => ($p['category']['id'] ?? '') === $category
                ));
            }
            $page  = array_slice($posts, $offset, $limit);
            // 一覧では本文(content)を省略（mainのfields指定と同じ挙動）
            foreach ($page as &$post) {
                unset($post['content']);
            }
            unset($post);
            respondJson(200, [
                'contents'   => $page,
                'totalCount' => count($posts),
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
        respondJson(200, $res['json']);
    } catch (Throwable $e) {
        respondJson(502, ['error' => '記事の取得に失敗しました。しばらくしてから再度お試しください。']);
    }
}

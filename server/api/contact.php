<?php
// お問い合わせフォーム受信API
// JSON受信・検証・DB保存 → 担当者へ通知メール（lib/mail.php）
// メール送信は「おまけ」であり、失敗してもレスポンスは 201 のまま返す。
// 内容はDBに保存済みで /admin/ から確認できるため、通知が落ちても問い合わせは失われない。
//
// bot 対策（2026-09-21 追加）。フォーム（src/components/Contact.tsx）が一緒に送ってくる
// website（ハニーポット）と elapsed（入力にかけた時間）を見て、自動投稿を落とす。
// 直接この URL を叩いてくるボットもいるので、文字数上限・同一IPの連投制限も
// ここで持つ。判定ではじいたときは保存も通知もせず、画面上は成功と同じ応答を返す
// （エラーを返すと、ボット側に「何が引っかかったか」を教えることになるため）。

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/mail.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');

// フォームを開いてから送信するまで、人ならこれ以上はかかる（ミリ秒）
const MIN_ELAPSED_MS = 3000;
// 同一IPからの受付は RATE_WINDOW_SEC の間に RATE_MAX 件まで。
// 会社や現場から複数人が同じ回線で送る場合もあるので、余裕をみて5件にしている
const RATE_MAX        = 5;
const RATE_WINDOW_SEC = 600;
// 入力欄ごとの文字数上限（DBの桁に合わせる。message だけは TEXT なので運用上の上限）
const MAX_LEN = [
    'name'    => 100,
    'company' => 100,
    'email'   => 255,
    'phone'   => 50,
    'message' => 4000,
];

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/** 自動投稿とみなして捨てる。ボットには成功に見せる */
function dropAsBot(string $reason): never
{
    error_log("contact: bot とみなして破棄 ($reason)");
    respond(201, ['success' => true, 'id' => 0]);
}

/** 同一IPからの連投かどうか。記録できない環境では制限しない（正規の送信を落とさないため） */
function isRateLimited(string $ip): bool
{
    $dir = sys_get_temp_dir() . '/toc-contact';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return false;
    }
    // IPそのものは残さず、ハッシュをファイル名にして送信時刻だけを持つ
    $file = $dir . '/' . hash('sha256', $ip) . '.json';
    $fp   = @fopen($file, 'c+');
    if (!$fp) {
        return false;
    }
    flock($fp, LOCK_EX);
    $now   = time();
    $raw   = stream_get_contents($fp);
    $times = array_values(array_filter(
        json_decode($raw ?: '[]', true) ?: [],
        fn($t) => is_int($t) && $t > $now - RATE_WINDOW_SEC
    ));
    $over = count($times) >= RATE_MAX;
    if (!$over) {
        $times[] = $now;
    }
    rewind($fp);
    ftruncate($fp, 0);
    fwrite($fp, json_encode($times));
    flock($fp, LOCK_UN);
    fclose($fp);

    // たまに古い記録を掃除する（共有の一時ディレクトリにファイルを残さないため）
    if (random_int(1, 100) === 1) {
        foreach (glob($dir . '/*.json') ?: [] as $old) {
            if (filemtime($old) < $now - 86400) {
                @unlink($old);
            }
        }
    }
    return $over;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method Not Allowed']);
}

// 他サイトに置いたフォームからの送信は受けない。
// Origin が無い送信（ボットや curl）はここでは落とさず、後段の判定に任せる
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host   = preg_replace('/:\d+$/', '', (string)($_SERVER['HTTP_HOST'] ?? ''));  // ポート番号は外して比べる
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== $host) {
    respond(403, ['error' => 'Forbidden']);
}

$raw = file_get_contents('php://input');
if (strlen($raw) > 20000) {
    dropAsBot('本文が大きすぎる');
}
$body = json_decode($raw, true) ?? [];

// ハニーポット: 人には見えない欄なので、埋まっていれば自動投稿
if (trim((string)($body['website'] ?? '')) !== '') {
    dropAsBot('ハニーポットが埋まっている');
}
// 入力時間: 速すぎる送信、または elapsed が付いていない送信（=フォーム経由でない）
$elapsed = $body['elapsed'] ?? null;
if (!is_numeric($elapsed) || $elapsed < MIN_ELAPSED_MS) {
    dropAsBot('入力時間が短すぎる（elapsed=' . var_export($elapsed, true) . '）');
}

if (isRateLimited($_SERVER['REMOTE_ADDR'] ?? '')) {
    respond(429, ['error' => '送信が続けて行われています。しばらく時間をおいてからお試しください。']);
}

$name    = trim((string)($body['name'] ?? ''));
$company = trim((string)($body['company'] ?? ''));
$email   = trim((string)($body['email'] ?? ''));
$phone   = trim((string)($body['phone'] ?? ''));
$message = trim((string)($body['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    respond(400, ['error' => 'お名前・メール・お問い合わせ内容は必須です']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['error' => 'メールアドレスの形式が正しくありません']);
}

$values = compact('name', 'company', 'email', 'phone', 'message');
foreach (MAX_LEN as $field => $limit) {
    if (mb_strlen($values[$field]) > $limit) {
        respond(400, ['error' => "入力が長すぎます（{$limit}文字以内でご記入ください）"]);
    }
}

// 改行を混ぜてメールのヘッダーを偽装する手口を防ぐ（宛先・件名に使う値だけ）
if (preg_match('/[\r\n]/', $name . $email . $company . $phone)) {
    dropAsBot('入力に改行が混ざっている');
}
// 迷惑メールの定番。お名前・会社名にURLが入る問い合わせは実在しない
if (preg_match('#https?://#i', $name . $company)) {
    dropAsBot('お名前・会社名にURLが入っている');
}
// 本文がリンクだらけのもの（宣伝の貼り付け）
if (preg_match_all('#https?://#i', $message) >= 5) {
    dropAsBot('本文にリンクが多すぎる');
}

try {
    $pdo  = getPdo();
    $stmt = $pdo->prepare(
        'INSERT INTO Contact (name, company, email, phone, message) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $name,
        $company !== '' ? $company : null,
        $email,
        $phone !== '' ? $phone : null,
        $message,
    ]);
    $id = (int)$pdo->lastInsertId();
} catch (Throwable $e) {
    respond(500, ['error' => '送信に失敗しました。しばらくしてから再度お試しください。']);
}

// DB保存後に通知。ここで例外が出ても利用者には成功として返す。
try {
    $sent = sendContactNotification(
        compact('name', 'company', 'email', 'phone', 'message'),
        $id
    );
    if (!$sent) {
        error_log("contact: 通知メールの送信に失敗しました (id=$id)");
    }
} catch (Throwable $e) {
    error_log("contact: 通知メールで例外 (id=$id): " . $e->getMessage());
}

respond(201, ['success' => true, 'id' => $id]);

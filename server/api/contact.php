<?php
// お問い合わせフォーム受信API
// 旧 src/app/api/contact/route.ts と同じ仕様（JSON受信・検証・DB保存）

require_once __DIR__ . '/../lib/db.php';

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method Not Allowed']);
}

$body    = json_decode(file_get_contents('php://input'), true) ?? [];
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
    respond(201, ['success' => true, 'id' => (int)$pdo->lastInsertId()]);
} catch (Throwable $e) {
    respond(500, ['error' => '送信に失敗しました。しばらくしてから再度お試しください。']);
}

<?php
// お問い合わせ通知メールの送信（api/contact.php から利用）
//
// 差出人は必ず teamofcolors.jp のアドレス（CONTACT_MAIL_FROM）にする。
// このドメインは SPF にサーバー（sv17104.xserver.jp）が含まれ、DKIM も設定済みなので、
// その組み合わせで送れば Gmail に迷惑メール扱いされずに届く。
// 送信者本人のアドレスを差出人にすると検証に失敗するため、Reply-To に入れて
// 「返信」を押したときだけ本人宛になるようにしている。
//
// 送信の成否は呼び出し側のレスポンスに影響させない。問い合わせ内容は先に DB へ
// 保存済みなので、メールが落ちても内容は失われず /admin/ から確認できる。

require_once __DIR__ . '/config.php';

/**
 * メールヘッダに入れる値から改行を除去する（ヘッダインジェクション対策）。
 * 名前や会社名は利用者が自由に入力できるため、そのままヘッダに入れると
 * 改行を仕込まれて宛先を追加される恐れがある。
 */
function sanitizeHeaderValue(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0"], '', $value));
}

/**
 * お問い合わせの通知メールを送る。
 *
 * @param array $data name/company/email/phone/message
 * @param int   $id   DBの登録ID（/admin/ の一覧と突き合わせるため本文に載せる）
 * @return bool 送信できたか（呼び出し側はログ用途にのみ使う）
 */
function sendContactNotification(array $data, int $id): bool
{
    if (CONTACT_NOTIFY_TO === '') {
        return false; // 宛先未設定＝通知しない運用
    }

    $name    = sanitizeHeaderValue((string)($data['name'] ?? ''));
    $company = sanitizeHeaderValue((string)($data['company'] ?? ''));
    $email   = sanitizeHeaderValue((string)($data['email'] ?? ''));
    $phone   = (string)($data['phone'] ?? '');
    $message = (string)($data['message'] ?? '');

    // 日本語をUTF-8のまま送る（mb_language('uni') で件名のMIMEエンコードと
    // 本文のBase64化が自動で行われる）。Gmailはこの形式をそのまま解釈できる。
    mb_language('uni');
    mb_internal_encoding('UTF-8');

    $subject = $company !== ''
        ? "【お問い合わせ】{$name} 様（{$company}）"
        : "【お問い合わせ】{$name} 様";

    $body = "ホームページのお問い合わせフォームから送信がありました。\n\n"
        . "■ お名前       " . ($name !== '' ? $name : '(未記入)') . "\n"
        . "■ 会社名       " . ($company !== '' ? $company : '(未記入)') . "\n"
        . "■ メール       " . ($email !== '' ? $email : '(未記入)') . "\n"
        . "■ 電話番号     " . ($phone !== '' ? $phone : '(未記入)') . "\n\n"
        . "■ お問い合わせ内容\n"
        . $message . "\n\n"
        . "--------------------------------------\n"
        . "受信日時: " . date('Y-m-d H:i') . "\n"
        . "管理番号: #" . $id . "\n"
        . "管理画面: " . ADMIN_URL . "\n";

    $fromName = mb_encode_mimeheader(CONTACT_MAIL_FROM_NAME, 'UTF-8');
    $headers  = [
        'From: ' . $fromName . ' <' . CONTACT_MAIL_FROM . '>',
    ];
    // 送信者のアドレスが妥当なときだけ返信先に設定する
    if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $email;
    }

    // 第5引数の -f は封筒差出人（Return-Path）。ここもドメインを揃えないと
    // SPF の検証対象がサーバー既定のアドレスになってしまう。
    return mb_send_mail(
        CONTACT_NOTIFY_TO,
        $subject,
        $body,
        implode("\r\n", $headers),
        '-f' . CONTACT_MAIL_FROM
    );
}

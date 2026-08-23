<?php
// お問い合わせ記録簿
//
// 対応状況（未読/確認済/返信済）の管理はGmail側で行う方針にしたため、この画面は
// 「過去の問い合わせを振り返るための記録簿」に徹する。
// 受信時に担当者へ通知メールが飛ぶので（lib/mail.php）、既読・返信済かどうかは
// Gmailの未読状態・スレッドの返信履歴・ラベルのほうが正確に持っている。
//
// 機能: パスワードログイン / 年月ごとの一覧 / 削除（スパム掃除用）
// DBの status カラムは使わなくなったが、既存データを壊さないよう残してある。

require_once __DIR__ . '/../lib/db.php';

// ---- セッションCookieの保護 ----
// HTTPSでのみ送る／JavaScriptから読ませない／他サイトからの遷移で送らない。
// secure はローカル(http)だとセッションが成立しなくなるので実際の接続を見て決める。
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
session_set_cookie_params([
    'httponly' => true,
    'secure'   => $isHttps,
    'samesite' => 'Lax',
]);
session_start();

function h(?string $s): string
{
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

// ---- ログイン試行の回数制限 ----
// パスワードは20文字ランダムなので総当たりは現実的でないが、やり放題にはしない。
// 状態はIPごとに一時ディレクトリへ置く（Web公開領域の外。rsyncにも影響されない）。

const LOGIN_MAX_ATTEMPTS = 5;      // この回数失敗したらロック
const LOGIN_WINDOW       = 900;    // 失敗のカウント期間（秒）
const LOGIN_LOCK         = 900;    // ロックする時間（秒）

function loginStateFile(): string
{
    $ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    return sys_get_temp_dir() . '/toc-admin-login-' . sha1($ip) . '.json';
}

function loginState(): array
{
    $file = loginStateFile();
    if (!is_file($file)) {
        return ['count' => 0, 'first' => 0];
    }
    $s = json_decode((string)file_get_contents($file), true);
    return is_array($s) ? $s + ['count' => 0, 'first' => 0] : ['count' => 0, 'first' => 0];
}

/** ロック中なら解除までの残り秒数、そうでなければ 0 */
function loginLockedFor(): int
{
    $s = loginState();
    if ($s['count'] < LOGIN_MAX_ATTEMPTS) {
        return 0;
    }
    $remain = ($s['first'] + LOGIN_LOCK) - time();
    return $remain > 0 ? $remain : 0;
}

function recordLoginFailure(): void
{
    $s = loginState();
    // 前回の失敗から時間が経っていればカウントをリセットして数え直す
    if ($s['count'] === 0 || (time() - $s['first']) > LOGIN_WINDOW) {
        $s = ['count' => 0, 'first' => time()];
    }
    $s['count']++;
    file_put_contents(loginStateFile(), json_encode($s), LOCK_EX);
}

function clearLoginFailures(): void
{
    $file = loginStateFile();
    if (is_file($file)) {
        @unlink($file);
    }
}

// ---- ログイン / ログアウト ----

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ./');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pw'])) {
    $lockedFor = loginLockedFor();
    if ($lockedFor > 0) {
        // ロック中は照合そのものを行わない
        $loginError = 'ログイン試行が多すぎます。約' . ceil($lockedFor / 60) . '分後に再度お試しください';
    } elseif (hash_equals(ADMIN_PASSWORD, (string)$_POST['pw'])) {
        clearLoginFailures();
        session_regenerate_id(true);
        $_SESSION['authed'] = true;
    } else {
        recordLoginFailure();
        $remain = LOGIN_MAX_ATTEMPTS - loginState()['count'];
        $loginError = $remain > 0
            ? 'パスワードが違います（あと' . $remain . '回で一時ロック）'
            : 'ログイン試行が多すぎます。約' . ceil(LOGIN_LOCK / 60) . '分後に再度お試しください';
    }
}

$authed = !empty($_SESSION['authed']);

// 削除は取り消せない操作なので、他サイトからのPOSTで実行されないようトークンで守る
if ($authed && empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(16));
}

// ---- 削除 ----

if ($authed && $_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    $id = (int)($_POST['id'] ?? 0);
    if ($id > 0 && hash_equals($_SESSION['csrf'], (string)($_POST['csrf'] ?? ''))) {
        $stmt = getPdo()->prepare('DELETE FROM Contact WHERE id = ?');
        $stmt->execute([$id]);
    }
    // PRG: リロードでの二重送信を防ぐ
    header('Location: ./');
    exit;
}

// ---- 一覧データ取得（年月ごとにまとめる） ----

$groups = [];  // "2026-8" => ['label' => '2026年8月', 'items' => [...]]
$total  = 0;

if ($authed) {
    $all   = getPdo()->query('SELECT * FROM Contact ORDER BY createdAt DESC')->fetchAll();
    $total = count($all);
    foreach ($all as $c) {
        $ts  = strtotime($c['createdAt']);
        $key = date('Y-n', $ts);
        if (!isset($groups[$key])) {
            $groups[$key] = ['label' => date('Y年n月', $ts), 'items' => []];
        }
        $groups[$key]['items'][] = $c;
    }
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>お問い合わせ記録 | Team of Colors</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #111827; color: #fff; font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif; min-height: 100vh; }
  a { color: inherit; }

  /* ログイン */
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .login-form { display: flex; flex-direction: column; gap: 16px; width: 288px; }
  .login-brand { color: rgba(255,255,255,0.3); font-size: 10px; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }
  .login-title { font-size: 20px; letter-spacing: 0.3em; text-align: center; font-weight: 300; margin-bottom: 16px; }
  .login-form input { background: #1f2937; border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 12px 16px; font-size: 14px; }
  .login-form input:focus { outline: none; border-color: rgba(255,255,255,0.4); }
  .login-form button { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.7); font-size: 12px; padding: 12px; letter-spacing: 0.3em; cursor: pointer; }
  .login-form button:hover { background: rgba(255,255,255,0.15); color: #fff; }
  .login-error { color: #f87171; font-size: 12px; text-align: center; }

  /* ヘッダー */
  .header { border-bottom: 1px solid rgba(255,255,255,0.1); background: #1f2937; padding: 24px 32px; }
  .header-inner { max-width: 1024px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .brand { color: rgba(255,255,255,0.3); font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase; margin-bottom: 4px; }
  .title { font-size: 20px; letter-spacing: 0.2em; font-weight: 300; }
  .stats { display: flex; gap: 24px; align-items: center; }
  .stat { text-align: center; }
  .stat-num { font-size: 24px; font-weight: 300; line-height: 1; }
  .stat-label { color: rgba(255,255,255,0.3); font-size: 9px; letter-spacing: 0.2em; margin-top: 4px; }
  .logout { color: rgba(255,255,255,0.35); font-size: 11px; letter-spacing: 0.15em; text-decoration: none; border: 1px solid rgba(255,255,255,0.15); padding: 6px 12px; }
  .logout:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.4); }

  .container { max-width: 1024px; margin: 0 auto; padding: 32px; }
  .note { color: rgba(255,255,255,0.35); font-size: 12px; line-height: 1.8; border-left: 2px solid rgba(255,255,255,0.15); padding-left: 16px; margin-bottom: 32px; }

  /* 年月グループ */
  .month { margin-bottom: 20px; }
  .month > summary { cursor: pointer; list-style: none; display: flex; align-items: baseline; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .month > summary::-webkit-details-marker { display: none; }
  .month > summary::before { content: "▶"; font-size: 9px; color: rgba(255,255,255,0.3); transition: transform 0.15s; }
  .month[open] > summary::before { transform: rotate(90deg); }
  .month-label { font-size: 15px; letter-spacing: 0.1em; font-weight: 300; }
  .month-count { color: rgba(255,255,255,0.3); font-size: 11px; letter-spacing: 0.15em; }

  /* 一覧 */
  .empty { color: rgba(255,255,255,0.2); text-align: center; padding: 80px 0; letter-spacing: 0.1em; font-size: 14px; }
  .cards { display: flex; flex-direction: column; gap: 12px; padding-top: 16px; }
  .card { background: #1f2937; border: 1px solid rgba(255,255,255,0.1); padding: 20px 24px; }
  .card:hover { background: #263044; }
  .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 12px; flex-wrap: wrap; }
  .card-who { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
  .card-name { font-weight: 500; letter-spacing: 0.05em; }
  .card-company { color: rgba(255,255,255,0.35); font-size: 12px; }
  .card-no { color: rgba(255,255,255,0.2); font-size: 11px; font-variant-numeric: tabular-nums; }
  .card-meta { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
  .card-date { color: rgba(255,255,255,0.25); font-size: 11px; font-variant-numeric: tabular-nums; }
  /* 削除は誤操作されないよう、普段は目立たせず hover で浮かび上がらせる */
  .del-btn { font-size: 10px; letter-spacing: 0.15em; border: none; background: none; color: rgba(255,255,255,0.18); cursor: pointer; padding: 4px; }
  .del-btn:hover { color: #f87171; }
  .card-links { display: flex; gap: 16px; margin-bottom: 16px; font-size: 12px; }
  .card-links a { color: rgba(255,255,255,0.45); text-decoration: none; }
  .card-links a:hover { color: rgba(255,255,255,0.75); text-decoration: underline; text-underline-offset: 2px; }
  .card-message { color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.7; white-space: pre-wrap; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; word-break: break-word; }
</style>
</head>
<body>

<?php if (!$authed): ?>

<div class="login-wrap">
  <form method="post" class="login-form">
    <p class="login-brand">Team of Colors</p>
    <h1 class="login-title">ADMIN</h1>
    <?php if (!empty($loginError)): ?>
      <p class="login-error"><?= h($loginError) ?></p>
    <?php endif; ?>
    <input type="password" name="pw" placeholder="パスワード" autofocus>
    <button type="submit">LOGIN</button>
  </form>
</div>

<?php else: ?>

<div class="header">
  <div class="header-inner">
    <div>
      <p class="brand">Team of Colors</p>
      <h1 class="title">お問い合わせ記録</h1>
    </div>
    <div class="stats">
      <div class="stat">
        <p class="stat-num"><?= $total ?></p>
        <p class="stat-label">件</p>
      </div>
      <a class="logout" href="./?logout=1">LOGOUT</a>
    </div>
  </div>
</div>

<div class="container">

  <p class="note">
    お問い合わせは受信時に担当者のメールへ通知されます。<br>
    確認済み・返信済みの管理はメール側（未読／スター／ラベル）で行ってください。<br>
    この画面は過去の問い合わせを振り返るための記録です。
  </p>

  <?php if ($total === 0): ?>
    <p class="empty">まだ問い合わせはありません</p>
  <?php else: ?>
    <?php $first = true; foreach ($groups as $g): ?>
    <details class="month"<?= $first ? ' open' : '' ?>>
      <summary>
        <span class="month-label"><?= h($g['label']) ?></span>
        <span class="month-count"><?= count($g['items']) ?> 件</span>
      </summary>
      <div class="cards">
        <?php foreach ($g['items'] as $c): ?>
        <div class="card">
          <div class="card-top">
            <div class="card-who">
              <span class="card-name"><?= h($c['name']) ?></span>
              <?php if ($c['company']): ?>
                <span class="card-company"><?= h($c['company']) ?></span>
              <?php endif; ?>
              <span class="card-no">#<?= (int)$c['id'] ?></span>
            </div>
            <div class="card-meta">
              <span class="card-date"><?= h(date('Y/m/d H:i', strtotime($c['createdAt']))) ?></span>
              <form method="post" class="del-form" style="display:inline;"
                    data-id="<?= (int)$c['id'] ?>" data-name="<?= h($c['name']) ?>">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="id" value="<?= (int)$c['id'] ?>">
                <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
                <button type="submit" class="del-btn" title="削除">削除</button>
              </form>
            </div>
          </div>
          <div class="card-links">
            <a href="mailto:<?= h($c['email']) ?>"><?= h($c['email']) ?></a>
            <?php if ($c['phone']): ?>
              <a href="tel:<?= h($c['phone']) ?>"><?= h($c['phone']) ?></a>
            <?php endif; ?>
          </div>
          <p class="card-message"><?= h($c['message']) ?></p>
        </div>
        <?php endforeach; ?>
      </div>
    </details>
    <?php $first = false; endforeach; ?>
  <?php endif; ?>

</div>

<script>
  // 削除前の確認。名前は data 属性から取るので、氏名に引用符や改行が入っていても壊れない
  document.querySelectorAll('.del-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var msg = '#' + form.dataset.id + '「' + form.dataset.name + '」さんの問い合わせを削除します。\n'
              + '元に戻せません。よろしいですか？';
      if (!window.confirm(msg)) e.preventDefault();
    });
  });
</script>

<?php endif; ?>

</body>
</html>

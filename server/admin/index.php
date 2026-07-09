<?php
// お問い合わせ管理画面
// 旧 src/app/admin/contacts/page.tsx のPHP移植版
// 機能: パスワードログイン / ステータス別フィルター / ステータス更新

session_start();
require_once __DIR__ . '/../lib/db.php';

function h(?string $s): string
{
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

// ---- ログイン / ログアウト ----

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ./');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pw'])) {
    if (hash_equals(ADMIN_PASSWORD, (string)$_POST['pw'])) {
        session_regenerate_id(true);
        $_SESSION['authed'] = true;
    } else {
        $loginError = 'パスワードが違います';
    }
}

$authed = !empty($_SESSION['authed']);

// ---- ステータス更新（旧 StatusButton / actions.ts 相当） ----

$allowedStatus = ['new', 'read', 'replied'];

if ($authed && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'status') {
    $id     = (int)($_POST['id'] ?? 0);
    $status = (string)($_POST['status'] ?? '');
    if ($id > 0 && in_array($status, $allowedStatus, true)) {
        $stmt = getPdo()->prepare('UPDATE Contact SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
    }
    // PRG: リロードでの二重送信を防ぐ
    $filter = (string)($_POST['filter'] ?? 'all');
    header('Location: ./?filter=' . urlencode($filter));
    exit;
}

// ---- 一覧データ取得 ----

$STATUS_CONFIG = [
    'new'     => ['label' => '未読',   'color' => '#facc15'],
    'read'    => ['label' => '確認済', 'color' => 'rgba(255,255,255,0.4)'],
    'replied' => ['label' => '返信済', 'color' => '#4ade80'],
];

// 次のステータスへの遷移（new→read→replied→new）
$NEXT = [
    'new'     => ['status' => 'read',    'label' => '確認済にする'],
    'read'    => ['status' => 'replied', 'label' => '返信済にする'],
    'replied' => ['status' => 'new',     'label' => '未読に戻す'],
];

$contacts = [];
$counts   = ['all' => 0, 'new' => 0, 'read' => 0, 'replied' => 0];
$filter   = in_array($_GET['filter'] ?? 'all', ['all', 'new', 'read', 'replied'], true)
    ? ($_GET['filter'] ?? 'all') : 'all';

if ($authed) {
    $all = getPdo()->query('SELECT * FROM Contact ORDER BY createdAt DESC')->fetchAll();
    $counts['all'] = count($all);
    foreach ($all as $c) {
        if (isset($counts[$c['status']])) $counts[$c['status']]++;
    }
    $contacts = $filter === 'all'
        ? $all
        : array_values(array_filter($all, fn($c) => $c['status'] === $filter));
}

$tabs = [
    'all'     => 'すべて',
    'new'     => '未読',
    'read'    => '確認済',
    'replied' => '返信済',
];
?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>お問い合わせ管理 | Team of Colors</title>
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
  .stat-sep { width: 1px; align-self: stretch; background: rgba(255,255,255,0.08); }
  .logout { color: rgba(255,255,255,0.35); font-size: 11px; letter-spacing: 0.15em; text-decoration: none; border: 1px solid rgba(255,255,255,0.15); padding: 6px 12px; }
  .logout:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.4); }

  /* タブ */
  .container { max-width: 1024px; margin: 0 auto; padding: 32px; }
  .tabs { display: flex; gap: 4px; margin-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .tab { padding: 12px 20px; font-size: 12px; letter-spacing: 0.2em; text-decoration: none; color: rgba(255,255,255,0.35); border-bottom: 2px solid transparent; margin-bottom: -1px; }
  .tab:hover { color: rgba(255,255,255,0.6); }
  .tab.active { border-bottom-color: rgba(255,255,255,0.6); color: #fff; }
  .tab-count { margin-left: 8px; font-size: 10px; color: rgba(255,255,255,0.2); }
  .tab.active .tab-count { color: rgba(255,255,255,0.5); }

  /* 一覧 */
  .empty { color: rgba(255,255,255,0.2); text-align: center; padding: 80px 0; letter-spacing: 0.1em; font-size: 14px; }
  .cards { display: flex; flex-direction: column; gap: 12px; }
  .card { background: #1f2937; border: 1px solid rgba(255,255,255,0.1); border-left-width: 2px; padding: 20px 24px; }
  .card:hover { background: #263044; }
  .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 12px; flex-wrap: wrap; }
  .card-who { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
  .card-name { font-weight: 500; letter-spacing: 0.05em; }
  .card-company { color: rgba(255,255,255,0.35); font-size: 12px; }
  .badge { font-size: 9px; letter-spacing: 0.2em; border: 1px solid; padding: 2px 8px; }
  .card-meta { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .card-date { color: rgba(255,255,255,0.25); font-size: 11px; font-variant-numeric: tabular-nums; }
  .status-btn { font-size: 10px; letter-spacing: 0.2em; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.5); background: none; padding: 6px 12px; cursor: pointer; white-space: nowrap; }
  .status-btn:hover { border-color: rgba(255,255,255,0.5); color: rgba(255,255,255,0.8); }
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
      <h1 class="title">お問い合わせ管理</h1>
    </div>
    <div class="stats">
      <div class="stat">
        <p class="stat-num" style="color:#facc15;"><?= $counts['new'] ?></p>
        <p class="stat-label">未読</p>
      </div>
      <div class="stat-sep"></div>
      <div class="stat">
        <p class="stat-num" style="color:rgba(255,255,255,0.6);"><?= $counts['read'] ?></p>
        <p class="stat-label">確認済</p>
      </div>
      <div class="stat-sep"></div>
      <div class="stat">
        <p class="stat-num" style="color:#4ade80;"><?= $counts['replied'] ?></p>
        <p class="stat-label">返信済</p>
      </div>
      <a class="logout" href="./?logout=1">LOGOUT</a>
    </div>
  </div>
</div>

<div class="container">

  <div class="tabs">
    <?php foreach ($tabs as $key => $label): ?>
      <a class="tab<?= $filter === $key ? ' active' : '' ?>" href="./?filter=<?= h($key) ?>">
        <?= h($label) ?><span class="tab-count"><?= $counts[$key] ?></span>
      </a>
    <?php endforeach; ?>
  </div>

  <?php if (count($contacts) === 0): ?>
    <p class="empty">該当する問い合わせはありません</p>
  <?php else: ?>
    <div class="cards">
      <?php foreach ($contacts as $c):
        $cfg  = $STATUS_CONFIG[$c['status']] ?? $STATUS_CONFIG['new'];
        $next = $NEXT[$c['status']] ?? $NEXT['new'];
      ?>
      <div class="card" style="border-left-color: <?= $cfg['color'] ?>;">
        <div class="card-top">
          <div class="card-who">
            <span class="card-name"><?= h($c['name']) ?></span>
            <?php if ($c['company']): ?>
              <span class="card-company"><?= h($c['company']) ?></span>
            <?php endif; ?>
            <span class="badge" style="color: <?= $cfg['color'] ?>; border-color: <?= $cfg['color'] ?>;">
              <?= h($cfg['label']) ?>
            </span>
          </div>
          <div class="card-meta">
            <span class="card-date"><?= h(date('Y/m/d H:i', strtotime($c['createdAt']))) ?></span>
            <form method="post" style="display:inline;">
              <input type="hidden" name="action" value="status">
              <input type="hidden" name="id" value="<?= (int)$c['id'] ?>">
              <input type="hidden" name="status" value="<?= h($next['status']) ?>">
              <input type="hidden" name="filter" value="<?= h($filter) ?>">
              <button type="submit" class="status-btn"><?= h($next['label']) ?></button>
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
  <?php endif; ?>

</div>

<?php endif; ?>

</body>
</html>

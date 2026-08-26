<?php
// One-time import: upload the CSV exported from the old admin panel.
// Visit https://tradingkekhiladi.com/api/import_csv.php (after logging in is not required here,
// but DELETE this file right after importing).
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['csv'])) {
    $pdo = db();
    $fh = fopen($_FILES['csv']['tmp_name'], 'r');
    $header = fgetcsv($fh); // skip header row
    $ins = $pdo->prepare("INSERT IGNORE INTO applications (id, full_name, phone, email, city, dob, trading_experience, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $count = 0;
    while (($row = fgetcsv($fh)) !== false) {
        if (count($row) < 9) continue;
        $ins->execute([$row[0], $row[1], $row[2], $row[3], $row[4], $row[5], $row[6], $row[7], $row[8]]);
        $count++;
    }
    fclose($fh);
    header('Content-Type: text/plain');
    echo "Imported $count applications. DELETE api/import_csv.php now.";
    exit;
}
?>
<!doctype html><html><body style="background:#0A0A0A;color:#fff;font-family:sans-serif;display:grid;place-items:center;min-height:100vh">
<form method="post" enctype="multipart/form-data" style="border:1px solid #333;padding:32px;border-radius:12px">
  <h2>Import applications CSV</h2>
  <input type="file" name="csv" accept=".csv" required style="margin:16px 0">
  <br><button type="submit" style="background:#FF3333;color:#fff;border:0;padding:12px 24px;cursor:pointer">Import</button>
</form></body></html>

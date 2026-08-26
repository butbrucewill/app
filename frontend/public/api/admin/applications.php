<?php
// GET /api/admin/applications?search=
require_once __DIR__ . '/auth.php';

require_admin();

$search = trim($_GET['search'] ?? '');
$pdo = db();

if ($search !== '') {
    $like = '%' . $search . '%';
    $stmt = $pdo->prepare("SELECT id, full_name, phone, email, city, dob, trading_experience, status, created_at
                           FROM applications
                           WHERE full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR city LIKE ?
                           ORDER BY created_at DESC LIMIT 5000");
    $stmt->execute([$like, $like, $like, $like]);
} else {
    $stmt = $pdo->query("SELECT id, full_name, phone, email, city, dob, trading_experience, status, created_at
                         FROM applications ORDER BY created_at DESC LIMIT 5000");
}
$apps = $stmt->fetchAll();
$total = (int)$pdo->query("SELECT COUNT(*) AS c FROM applications")->fetch()['c'];

json_out(['applications' => $apps, 'total' => $total]);

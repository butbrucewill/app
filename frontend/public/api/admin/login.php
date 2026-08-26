<?php
// POST /api/auth/login
require_once __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['detail' => 'Method not allowed'], 405);
}

$in = body();
$email = strtolower(trim($in['email'] ?? ''));
$password = $in['password'] ?? '';

$stmt = db()->prepare("SELECT * FROM admins WHERE email = ?");
$stmt->execute([$email]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    json_out(['detail' => 'Invalid email or password'], 401);
}

$_SESSION['admin_id'] = $admin['id'];
json_out(['email' => $admin['email'], 'role' => 'admin', 'name' => $admin['name'], 'token' => 'session']);

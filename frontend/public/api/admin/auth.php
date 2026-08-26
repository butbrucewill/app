<?php
require_once dirname(__DIR__) . '/db.php';

session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'path' => '/']);
session_start();

function current_admin() {
    if (empty($_SESSION['admin_id'])) return null;
    $stmt = db()->prepare("SELECT email, name FROM admins WHERE id = ?");
    $stmt->execute([$_SESSION['admin_id']]);
    $a = $stmt->fetch();
    return $a ? ['email' => $a['email'], 'name' => $a['name'], 'role' => 'admin'] : null;
}

function require_admin() {
    $a = current_admin();
    if (!$a) json_out(['detail' => 'Not authenticated'], 401);
    return $a;
}

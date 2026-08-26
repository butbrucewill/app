<?php
// POST /api/auth/logout
require_once __DIR__ . '/auth.php';

$_SESSION = [];
session_destroy();
json_out(['status' => 'logged_out']);

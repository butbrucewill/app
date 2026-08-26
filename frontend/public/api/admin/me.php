<?php
// GET /api/auth/me
require_once __DIR__ . '/auth.php';

$admin = current_admin();
if (!$admin) json_out(['detail' => 'Not authenticated'], 401);
json_out($admin);

<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') json_out(['detail' => 'Method not allowed'], 405);
$fileId = trim($_GET['id'] ?? '');
$stmt = db()->prepare('SELECT content_type, data FROM blog_uploads WHERE file_id = ? LIMIT 1');
$stmt->execute([$fileId]);
$file = $stmt->fetch();
if (!$file) json_out(['detail' => 'File not found'], 404);

header('Content-Type: ' . $file['content_type']);
header('Cache-Control: public, max-age=31536000, immutable');
header('X-Content-Type-Options: nosniff');
echo $file['data'];
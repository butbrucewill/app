<?php
require_once __DIR__ . '/auth.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['detail' => 'Method not allowed'], 405);
if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    json_out(['detail' => 'Choose an image to upload.'], 400);
}
$file = $_FILES['file'];
if ($file['size'] > 5 * 1024 * 1024) json_out(['detail' => 'Image must be under 5 MB'], 400);
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!in_array($mime, $allowed, true)) json_out(['detail' => 'Only JPG, PNG, WEBP or GIF images are allowed'], 400);

$fileId = bin2hex(random_bytes(16));
$stmt = db()->prepare('INSERT INTO blog_uploads (file_id, content_type, data, created_at) VALUES (?, ?, ?, ?)');
$stmt->execute([$fileId, $mime, file_get_contents($file['tmp_name']), gmdate('c')]);
json_out(['url' => '/api/uploads/' . $fileId], 201);
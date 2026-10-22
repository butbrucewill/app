<?php
try {
    require_once __DIR__ . '/blog_helpers.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_out(['detail' => 'Method not allowed'], 405);
    }

    $pdo = db();
    $slug = trim($_GET['slug'] ?? '');
    if ($slug !== '') {
        $stmt = $pdo->prepare("SELECT * FROM blogs WHERE slug = ? AND status = 'published' LIMIT 1");
        $stmt->execute([$slug]);
        $blog = blog_from_row($stmt->fetch());
        if (!$blog) json_out(['detail' => 'Blog not found'], 404);
        json_out(['blog' => $blog]);
    }

    $rows = $pdo->query("SELECT * FROM blogs WHERE status = 'published' ORDER BY sort_order ASC, published_at DESC LIMIT 500")->fetchAll();
    $blogs = array_map('blog_from_row', $rows);
    foreach ($blogs as &$blog) unset($blog['content']);
    unset($blog);
    json_out(['blogs' => $blogs]);
} catch (Throwable $error) {
    error_log('Public blog API error: ' . $error->getMessage());
    $detail = 'Could not load blogs.';
    if (($_GET['debug'] ?? '') === '1') {
        try {
            require_once __DIR__ . '/admin/auth.php';
            if (current_admin()) {
                $detail .= ' ' . get_class($error) . ': ' . $error->getMessage();
            }
        } catch (Throwable $authError) {
            error_log('Blog debug authorization error: ' . $authError->getMessage());
        }
    }
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['detail' => $detail]);
    exit;
}
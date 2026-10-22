<?php
try {
    require_once __DIR__ . '/auth.php';
    require_admin();

    function blog_fields() {
        return [
            'title', 'h1', 'slug', 'excerpt', 'category', 'tags', 'author',
            'published_at', 'cover_image', 'cover_alt', 'meta_title',
            'meta_description', 'focus_keyword', 'secondary_keywords',
            'canonical_url', 'index_status', 'schema_type', 'og_title',
            'og_description', 'og_image', 'content', 'status',
        ];
    }

    function blog_from_row($row) {
        if (!$row) return null;
        $row['faqs'] = json_decode($row['faqs'] ?? '[]', true) ?: [];
        return $row;
    }

    function blog_slug($value) {
        $slug = strtolower(trim($value));
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        return trim(substr($slug, 0, 90), '-');
    }

    function blog_substr($value, $start, $length) {
        return function_exists('mb_substr')
            ? mb_substr($value, $start, $length, 'UTF-8')
            : substr($value, $start, $length);
    }

    function blog_strlen($value) {
        return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
    }

    function normalize_blog_input($input) {
        $data = [];
        foreach (blog_fields() as $field) {
            $data[$field] = isset($input[$field]) && is_scalar($input[$field])
                ? trim((string)$input[$field]) : '';
        }
        $data['slug'] = blog_slug($data['slug'] ?: $data['title']);
        $data['author'] = $data['author'] ?: 'Trading Ke Khiladi';
        $data['index_status'] = in_array($data['index_status'], ['index', 'noindex'], true)
            ? $data['index_status'] : 'index';
        $data['schema_type'] = $data['schema_type'] ?: 'BlogPosting';
        $data['status'] = in_array($data['status'], ['draft', 'published'], true)
            ? $data['status'] : 'draft';

        $faqs = [];
        foreach (array_slice(is_array($input['faqs'] ?? null) ? $input['faqs'] : [], 0, 30) as $faq) {
            $question = trim((string)($faq['question'] ?? ''));
            $answer = trim((string)($faq['answer'] ?? ''));
            if ($question !== '' && $answer !== '') {
                $faqs[] = ['question' => blog_substr($question, 0, 300), 'answer' => blog_substr($answer, 0, 3000)];
            }
        }
        $data['faqs'] = json_encode($faqs, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return $data;
    }

    function ensure_unique_blog_slug($slug, $excludeId = null) {
        $sql = 'SELECT blog_id FROM blogs WHERE slug = ?';
        $params = [$slug];
        if ($excludeId !== null) {
            $sql .= ' AND blog_id <> ?';
            $params[] = $excludeId;
        }
        $sql .= ' LIMIT 1';
        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        if ($stmt->fetch()) json_out(['detail' => 'This URL slug is already used by another blog.'], 409);
    }

    $pdo = db();
    $method = $_SERVER['REQUEST_METHOD'];
    $id = trim($_GET['id'] ?? '');
    $action = $_GET['action'] ?? '';

    if ($action === 'order' && $method === 'PUT') {
        $ids = body()['ids'] ?? null;
        if (!is_array($ids)) json_out(['detail' => 'Invalid blog order'], 422);
        $stmt = $pdo->prepare('UPDATE blogs SET sort_order = ? WHERE blog_id = ?');
        foreach (array_values($ids) as $index => $blogId) {
            $stmt->execute([$index, (string)$blogId]);
        }
        json_out(['status' => 'ok']);
    }

    if ($method === 'GET' && $id === '') {
        $rows = $pdo->query('SELECT * FROM blogs ORDER BY sort_order ASC, created_at DESC LIMIT 1000')->fetchAll();
        $blogs = array_map('blog_from_row', $rows);
        foreach ($blogs as &$blog) unset($blog['content']);
        unset($blog);
        json_out(['blogs' => $blogs]);
    }

    if ($method === 'GET' && $id !== '') {
        $stmt = $pdo->prepare('SELECT * FROM blogs WHERE blog_id = ? LIMIT 1');
        $stmt->execute([$id]);
        $blog = blog_from_row($stmt->fetch());
        if (!$blog) json_out(['detail' => 'Blog not found'], 404);
        json_out(['blog' => $blog]);
    }

    if ($method === 'DELETE' && $id !== '') {
        $stmt = $pdo->prepare('DELETE FROM blogs WHERE blog_id = ?');
        $stmt->execute([$id]);
        if (!$stmt->rowCount()) json_out(['detail' => 'Blog not found'], 404);
        json_out(['status' => 'deleted']);
    }

    if (($method === 'POST' && $id === '') || ($method === 'PUT' && $id !== '')) {
        $input = body();
        $data = normalize_blog_input($input);
        if (blog_strlen($data['title']) < 3 || blog_strlen($data['title']) > 200) {
            json_out(['detail' => 'Title must be between 3 and 200 characters.'], 422);
        }
        if ($data['slug'] === '') $data['slug'] = bin2hex(random_bytes(4));
        ensure_unique_blog_slug($data['slug'], $id !== '' ? $id : null);

        $now = gmdate('c');
        if ($method === 'POST') {
            $firstOrder = $pdo->query('SELECT MIN(sort_order) AS first_order FROM blogs')->fetch()['first_order'];
            $data['blog_id'] = bin2hex(random_bytes(16));
            $data['created_at'] = $now;
            $data['updated_at'] = $now;
            $data['published_at'] = $data['published_at'] ?: gmdate('Y-m-d');
            $data['sort_order'] = $firstOrder === null ? 0 : (int)$firstOrder - 1;
            $columns = array_keys($data);
            $sql = 'INSERT INTO blogs (' . implode(', ', $columns) . ') VALUES (' . implode(', ', array_fill(0, count($columns), '?')) . ')';
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($data));
            json_out(['blog' => blog_from_row($data)], 201);
        }

        $stmt = $pdo->prepare('SELECT * FROM blogs WHERE blog_id = ? LIMIT 1');
        $stmt->execute([$id]);
        $existing = $stmt->fetch();
        if (!$existing) json_out(['detail' => 'Blog not found'], 404);
        $data['published_at'] = $data['published_at'] ?: ($existing['published_at'] ?: substr($existing['created_at'], 0, 10));
        $data['updated_at'] = $now;
        $assignments = [];
        foreach (array_keys($data) as $field) $assignments[] = "$field = ?";
        $stmt = $pdo->prepare('UPDATE blogs SET ' . implode(', ', $assignments) . ' WHERE blog_id = ?');
        $params = array_merge(array_values($data), [$id]);
        $stmt->execute($params);
        json_out(['blog' => blog_from_row(array_merge($existing, $data))]);
    }

    json_out(['detail' => 'Method not allowed'], 405);
} catch (Throwable $error) {
    error_log('Blog API error: ' . $error->getMessage());
    $detail = 'Blog API failed. Check the hosting PHP error log.';
    if (($_GET['debug'] ?? '') === '1') {
        $detail .= ' ' . get_class($error) . ': ' . $error->getMessage();
    }
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['detail' => $detail]);
    exit;
}
<?php
require_once __DIR__ . '/db.php';

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
            $faqs[] = ['question' => mb_substr($question, 0, 300), 'answer' => mb_substr($answer, 0, 3000)];
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
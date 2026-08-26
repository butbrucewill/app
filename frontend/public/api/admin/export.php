<?php
// GET /api/admin/applications/export — CSV download
require_once __DIR__ . '/auth.php';

require_admin();

$rows = db()->query("SELECT * FROM applications ORDER BY created_at DESC")->fetchAll();

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename=tkk_applications.csv');

$out = fopen('php://output', 'w');
fputcsv($out, ['ID', 'Full Name', 'Phone', 'Email', 'City', 'Date of Birth', 'Trading Experience', 'Status', 'Applied At']);
foreach ($rows as $r) {
    fputcsv($out, [
        $r['id'], $r['full_name'], $r['phone'], $r['email'], $r['city'],
        $r['dob'], $r['trading_experience'], $r['status'], $r['created_at'],
    ]);
}
fclose($out);

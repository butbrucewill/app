<?php
// POST /api/applications — public application submit
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['detail' => 'Method not allowed'], 405);
}

$in = body();
$full_name = trim($in['full_name'] ?? '');
$phone = trim($in['phone'] ?? '');
$email = strtolower(trim($in['email'] ?? ''));
$city = trim($in['city'] ?? '');
$dob = trim($in['dob'] ?? '');
$exp = trim($in['trading_experience'] ?? '');

if (strlen($full_name) < 2 || strlen($phone) < 8 || strlen($phone) > 20 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($city) < 2 ||
    $dob === '' || strlen($exp) < 2) {
    json_out(['detail' => 'Please fill all fields correctly.'], 422);
}

$d = DateTime::createFromFormat('Y-m-d', $dob);
if (!$d) {
    json_out(['detail' => 'Invalid date of birth'], 400);
}
$age = (int)$d->diff(new DateTime('today'))->y;
if ($age < 18) {
    json_out(['detail' => 'You must be 18 or older to apply'], 400);
}

$pdo = db();
$chk = $pdo->prepare("SELECT id FROM applications WHERE email = ? OR phone = ? LIMIT 1");
$chk->execute([$email, $phone]);
if ($chk->fetch()) {
    json_out(['detail' => 'An application with this email or phone number already exists.'], 409);
}

$id = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
$ins = $pdo->prepare("INSERT INTO applications (id, full_name, phone, email, city, dob, trading_experience, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)");
$ins->execute([$id, $full_name, $phone, $email, $city, $dob, $exp, gmdate('c')]);

json_out(['status' => 'success', 'id' => $id], 201);

<?php
// One-time setup: visit https://tradingkekhiladi.com/api/setup.php once,
// then DELETE this file from the server (File Manager).
require_once __DIR__ . '/db.php';

try {
    $pdo = db();
    $pdo->exec("CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(120) NOT NULL,
        city VARCHAR(80) NOT NULL,
        dob VARCHAR(20) NOT NULL,
        trading_experience VARCHAR(60) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'new',
        created_at VARCHAR(40) NOT NULL,
        INDEX(email),
        INDEX(created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS game_scores (
        player_key VARCHAR(64) PRIMARY KEY,
        player_name VARCHAR(120) NOT NULL DEFAULT 'Guest Khiladi',
        player_email VARCHAR(120) NOT NULL DEFAULT '',
        rounds INT NOT NULL DEFAULT 0,
        wins INT NOT NULL DEFAULT 0,
        balance DECIMAL(12,2) NOT NULL DEFAULT 1000,
        best_streak INT NOT NULL DEFAULT 0,
        updated_at VARCHAR(40) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(120) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(80) NOT NULL,
        created_at VARCHAR(40) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $stmt = $pdo->prepare("SELECT id FROM admins WHERE email = ?");
    $stmt->execute([ADMIN_EMAIL]);
    if (!$stmt->fetch()) {
        $ins = $pdo->prepare("INSERT INTO admins (email, password_hash, name, created_at) VALUES (?, ?, ?, ?)");
        $ins->execute([ADMIN_EMAIL, password_hash(ADMIN_PASSWORD, PASSWORD_BCRYPT), 'Organizer Admin', gmdate('c')]);
    }

    header('Content-Type: text/plain');
    echo "Setup complete. Tables ready, admin seeded: " . ADMIN_EMAIL . "\n";
    echo "IMPORTANT: delete api/setup.php from the server now.";
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: text/plain');
    echo "Setup failed: " . $e->getMessage() . "\nCheck the database credentials in api/config.php";
}

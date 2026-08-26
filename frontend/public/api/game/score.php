<?php
// POST /api/game/score — save/refresh a player's game session
require_once dirname(__DIR__) . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['detail' => 'Method not allowed'], 405);
}

$in = body();
$key = substr(trim($in['player_key'] ?? ''), 0, 64);
$name = substr(trim($in['player_name'] ?? ''), 0, 120) ?: 'Guest Khiladi';
$email = substr(trim($in['player_email'] ?? ''), 0, 120);
$rounds = (int)($in['rounds'] ?? 0);
$wins = (int)($in['wins'] ?? 0);
$balance = (float)($in['balance'] ?? 1000);
$best = (int)($in['best_streak'] ?? 0);

if ($key === '' || $rounds < 1) {
    json_out(['detail' => 'Invalid score payload'], 422);
}

$stmt = db()->prepare("INSERT INTO game_scores (player_key, player_name, player_email, rounds, wins, balance, best_streak, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        player_name = VALUES(player_name),
        player_email = VALUES(player_email),
        rounds = VALUES(rounds),
        wins = VALUES(wins),
        balance = VALUES(balance),
        best_streak = VALUES(best_streak),
        updated_at = VALUES(updated_at)");
$stmt->execute([$key, $name, $email, $rounds, $wins, $balance, $best, gmdate('c')]);

json_out(['status' => 'saved']);

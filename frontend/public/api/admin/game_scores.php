<?php
// GET /api/admin/game-scores
require_once __DIR__ . '/auth.php';

require_admin();

$rows = db()->query("SELECT * FROM game_scores ORDER BY best_streak DESC, balance DESC, updated_at DESC LIMIT 2000")->fetchAll();

json_out(['scores' => $rows, 'total' => count($rows)]);

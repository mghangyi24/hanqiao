<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // Database configuration
    $host = 'localhost';
    $db   = 'hsk_master';
    $user = 'appuser';
    $pass = 'hankot1550!@#';
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    $pdo = new PDO($dsn, $user, $pass, $options);

    $show_passwords = isset($_GET['show_passwords']) && $_GET['show_passwords'] == '1';

    if ($show_passwords) {
        // Warning: Only use this for debugging/admin view with strong access control
        $stmt = $pdo->query("
            SELECT 
                id,
                username,
                joined_date,
                hsk_level,
                is_admin,
                '' AS password_plain  -- For safety, replace '' with `password` if you truly need plain
            FROM users
            ORDER BY id DESC
        ");
    } else {
        $stmt = $pdo->query("
            SELECT 
                id,
                username,
                joined_date,
                hsk_level,
                is_admin
            FROM users
            ORDER BY id DESC
        ");
    }

    $users = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'users' => $users
    ]);
    exit;

} catch (Throwable $e) {
    echo json_encode([
        'status' => 'fail',
        'message' => 'Exception: ' . $e->getMessage()
    ]);
    exit;
}
?>

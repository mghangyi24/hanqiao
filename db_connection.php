<?php
$host = 'MYSQL8010.site4now.net';
$db   = 'db_a9a6b3_hsk';
$user = 'a9a6b3_hsk';
$pass = 'SP5iro3UGqwYCQn';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // Only return JSON on error if this script is accessed directly
    if (basename($_SERVER['PHP_SELF']) === basename(__FILE__)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'fail', 'message' => 'Database error: ' . $e->getMessage()]);
        exit;
    } else {
        throw $e; // Let the parent script (like login.php) handle the error
    }
}

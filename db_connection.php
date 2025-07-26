<?php
$host = 'MYSQL8010.site4now.net';
$db   = 'db_a9a6b3_hsk';
$user = 'a9a6b3_hsk';
$pass = 'SP5iro3UGqwYCQn';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch assoc arrays by default
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Use native prepares
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Test connection and show tables for debugging
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "Connected to database '$db'. Tables found:\n";
    foreach ($tables as $table) {
        echo "- $table\n";
    }

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=hsk_master;charset=utf8mb4", "appuser", "hankot1550!@#");

    echo "PDO MySQL connection successful.";
} catch (PDOException $e) {
    echo "PDO connection failed: " . $e->getMessage();
}
?>

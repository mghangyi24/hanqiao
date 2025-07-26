<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "MYSQL8010.site4now.net";
$username = "a9a6b3_hsk";
$password = "SP5iro3UGqwYCQn";
$dbname = "db_a9a6b3_hsk";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("DB Connection failed: " . $conn->connect_error);
} else {
    echo "DB Connection successful!";
}

$conn->close();
?>

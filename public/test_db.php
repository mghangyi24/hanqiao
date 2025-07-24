<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "appuser";
$password = "hankot1550!@#";
$dbname = "hsk_master";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("DB Connection failed: " . $conn->connect_error);
} else {
    echo "DB Connection successful!";
}

$conn->close();
?>

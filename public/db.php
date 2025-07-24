<?php
$servername = "localhost";
$username = "appuser";  // your DB username
$password = "hankot1550!@#"; // your DB password
$dbname = "hsk_master";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->set_charset("utf8");
?>

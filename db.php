<?php
$servername = "MYSQL8010.site4now.net";
$username = "a9a6b3_hsk";  
$password = "SP5iro3UGqwYCQn"; 
$dbname = "db_a9a6b3_hsk";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->set_charset("utf8");
?>

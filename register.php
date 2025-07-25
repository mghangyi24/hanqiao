<?php
require 'db.php';

$username = $_POST['username'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$hsk_level = $_POST['hsk_level'];

$stmt = $conn->prepare("INSERT INTO users (username, password, hsk_level) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $username, $password, $hsk_level);

if ($stmt->execute()) {
    echo "User registered";
} else {
    echo "Error: " . $stmt->error;
}
?>

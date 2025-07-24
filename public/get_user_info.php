<?php
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "fail", "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT username, joined_date, hsk_level FROM users WHERE id=$user_id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode($user);
} else {
    echo json_encode(["status" => "fail", "message" => "User not found"]);
}
?>

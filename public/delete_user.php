<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["status" => "fail", "message" => "Invalid request method."]);
        exit;
    }

    $id = intval($_POST['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(["status" => "fail", "message" => "Invalid user ID."]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User deleted."]);
    } else {
        echo json_encode(["status" => "fail", "message" => "Delete failed: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();

} catch (Throwable $e) {
    echo json_encode(["status" => "fail", "message" => "Exception: " . $e->getMessage()]);
}
?>

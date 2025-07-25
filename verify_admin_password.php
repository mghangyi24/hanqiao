<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
header('Content-Type: application/json');
require 'db.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["status" => "fail", "message" => "Invalid request method."]);
        exit;
    }

    $admin_password = $_POST['admin_password'] ?? '';
    if (empty($admin_password)) {
        echo json_encode(["status" => "fail", "message" => "Password is required."]);
        exit;
    }

    $admin_password_hashed = md5(trim($admin_password));

    $admin_username = 'admin'; // Adjust if your admin username differs

    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? AND password = ? AND is_admin = 1 LIMIT 1");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ss", $admin_username, $admin_password_hashed);

    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();

    if ($result && $result->num_rows === 1) {
        $_SESSION['admin_password_verified'] = true;
        echo json_encode(["status" => "success", "verified" => true]);
    } else {
        echo json_encode(["status" => "success", "verified" => false]);
    }

    $stmt->close();
    $conn->close();

} catch (Throwable $e) {
    echo json_encode(["status" => "fail", "message" => "Exception: " . $e->getMessage()]);
}

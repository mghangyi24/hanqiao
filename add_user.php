<?php
require 'db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $hsk_level = trim($_POST['hsk_level'] ?? '');
    $is_admin = isset($_POST['is_admin']) ? (int)$_POST['is_admin'] : 0;

    if ($username === '' || $password === '' || $hsk_level === '') {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    // Validate HSK level format
    if (!preg_match('/^([1-6](,[1-6])*)$/', $hsk_level)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid HSK level format.']);
        exit;
    }

    // Check for existing user
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        echo json_encode(['status' => 'error', 'message' => 'Username already exists.']);
        exit;
    }

    // Insert user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, password, hsk_level, is_admin) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $hashedPassword, $hsk_level, $is_admin]);

    echo json_encode(['status' => 'success']);
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
exit;
?>

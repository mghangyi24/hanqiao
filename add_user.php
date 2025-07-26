<?php
require 'db_connection.php'; // Ensure this connects correctly to $pdo

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

    // Validate HSK level: accept "1" or "1,2" etc.
    if (!preg_match('/^([1-6](,[1-6])*)$/', $hsk_level)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid HSK level format. Use numbers 1–6 or comma-separated.']);
        exit;
    }

    try {
        // Check if user already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);

        if ($stmt->fetch()) {
            echo json_encode(['status' => 'error', 'message' => 'Username already exists.']);
            exit;
        }

        // Hash password (can use MD5 here if needed, but not recommended)
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        // If you *really* want MD5, use this line instead (not secure):
        // $hashedPassword = md5($password);

        // Insert into DB
        $stmt = $pdo->prepare("INSERT INTO users (username, password, hsk_level, is_admin) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $hashedPassword, $hsk_level, $is_admin]);

        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }

    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
exit;
?>

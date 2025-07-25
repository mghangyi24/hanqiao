<?php
header('Content-Type: application/json');
session_start();
require 'db_connection.php';

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(['status' => 'fail', 'message' => 'Username and password required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, username, password, is_admin FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user) {
        $storedPass = $user['password'];

        if (strpos($storedPass, '$2y$') === 0) {
            // bcrypt hash
            if (password_verify($password, $storedPass)) {
                loginSuccess($user);
                exit;
            }
        } elseif (preg_match('/^[a-f0-9]{32}$/i', $storedPass)) {
            // MD5 hash - verify by hashing input password to md5
            if (md5($password) === $storedPass) {
                // Upgrade to bcrypt
                $newHash = password_hash($password, PASSWORD_DEFAULT);
                $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $updateStmt->execute([$newHash, $user['id']]);

                loginSuccess($user);
                exit;
            }
        } else {
            // Assume plain text password
            if ($password === $storedPass) {
                // Upgrade to bcrypt
                $newHash = password_hash($password, PASSWORD_DEFAULT);
                $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $updateStmt->execute([$newHash, $user['id']]);

                loginSuccess($user);
                exit;
            }
        }
    }

    echo json_encode(['status' => 'fail', 'message' => 'Invalid username or password']);
} catch (Exception $e) {
    echo json_encode(['status' => 'fail', 'message' => 'Server error']);
}

function loginSuccess($user) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['is_admin'] = $user['is_admin'];

    echo json_encode([
        'status' => 'success',
        'is_admin' => (bool)$user['is_admin']
    ]);
}

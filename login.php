<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
    $pdo->query("SELECT 1"); // test connection

    $stmt = $pdo->prepare("SELECT id, username, password, is_admin FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user) {
        $storedPass = $user['password'];

        if (strpos($storedPass, '$2y$') === 0) {
            if (password_verify($password, $storedPass)) {
                loginSuccess($user);
                exit;
            }
        } elseif (preg_match('/^[a-f0-9]{32}$/i', $storedPass)) {
            if (md5($password) === $storedPass) {
                $newHash = password_hash($password, PASSWORD_DEFAULT);
                $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $updateStmt->execute([$newHash, $user['id']]);
                $user['password'] = $newHash;
                loginSuccess($user);
                exit;
            }
        } else {
            if ($password === $storedPass) {
                $newHash = password_hash($password, PASSWORD_DEFAULT);
                $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $updateStmt->execute([$newHash, $user['id']]);
                $user['password'] = $newHash;
                loginSuccess($user);
                exit;
            }
        }
    }

    echo json_encode(['status' => 'fail', 'message' => 'Invalid username or password']);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'fail', 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
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

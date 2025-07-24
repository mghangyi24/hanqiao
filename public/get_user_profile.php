<?php
header('Content-Type: application/json');
session_start();
require 'db_connection.php';

// Consistent "not_logged_in" status for your frontend redirect logic
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'status' => 'not_logged_in',
        'message' => 'You are not logged in.'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, username, joined_date, hsk_level, is_admin FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Sanitize output to prevent XSS if needed
        $user['username'] = htmlspecialchars($user['username'], ENT_QUOTES, 'UTF-8');
        $user['joined_date'] = htmlspecialchars($user['joined_date'], ENT_QUOTES, 'UTF-8');
        $user['hsk_level'] = htmlspecialchars($user['hsk_level'], ENT_QUOTES, 'UTF-8');
        $user['is_admin'] = (int)$user['is_admin'];

        echo json_encode([
            'status' => 'success',
            'user' => $user
        ]);
    } else {
        echo json_encode([
            'status' => 'fail',
            'message' => 'User not found.'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500); // Proper server error code
    echo json_encode([
        'status' => 'fail',
        'message' => 'Server error, please try again later.'
        // 'error_detail' => $e->getMessage() // Uncomment during debugging only
    ]);
}
?>

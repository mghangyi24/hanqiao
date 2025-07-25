<?php
require 'db.php';
session_destroy();
echo json_encode(["status" => "success"]);
?>
<?php
session_start();
session_unset();
session_destroy();
header('Content-Type: application/json');
echo json_encode(['status' => 'success']);
?>

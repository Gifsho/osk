<?php
header('Content-Type: application/json');

// เชื่อมต่อฐานข้อมูล
$servername = "localhost";
$username = "p";
$password = "1234";
$dbname = "login_system";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
}

// รับข้อมูล JSON จากฝั่ง Client
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    exit;
}

$user = $conn->real_escape_string($input['username']);
$pass = md5($input['password']); // เข้ารหัสรหัสผ่านแบบ MD5

$sql = "SELECT * FROM users WHERE username = '$user' AND password = '$pass'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
}

$conn->close();
?>

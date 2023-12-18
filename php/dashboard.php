<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'vendor/autoload.php';

use ReallySimpleJWT\Token;

$con = mysqli_connect("localhost", "root", "", "signup_db");

$response = array();

// Get token from the URL parameter
$token = isset($_GET['token']) ? $_GET['token'] : null;

// Return the header claims
Token::getHeader($token);

// Return the payload claims
$payload = Token::getPayload($token);

// Access the 'user_id' from the payload
$user_id = $payload['user_id'];

$sql_token = "SELECT token_status FROM user_token WHERE token_string = '$token'";
$result_token = mysqli_query($con, $sql_token);

if ($result_token) {
    $row_token = mysqli_fetch_assoc($result_token);

    // Decode the JSON data
    $token_status = $row_token['token_status'];

    // Include token_status in the response
    $response['token_status'] = $token_status;
} else {
    $response['error'] = "Error fetching token status: " . mysqli_error($con);
}

// Fetch dashboard data from the database
$sql = "SELECT dashboard_data FROM dashboard WHERE user_id = '$user_id'";
$result = mysqli_query($con, $sql);

if ($result) {
    $row = mysqli_fetch_assoc($result);

    // Decode the JSON data
    $dashboard_data = json_decode($row['dashboard_data'], true);

    // Include dashboard_data in the response
    $response['dashboard_data'] = $dashboard_data;
} else {
    $response['error'] = "Error fetching dashboard data: " . mysqli_error($con);
}

// Return the JSON response
echo json_encode($response);

?>

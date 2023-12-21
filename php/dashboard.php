<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include the connection file
include 'connection.php';

// Get token from the URL parameter
$token = isset($_GET['token']) ? $_GET['token'] : null;

$sql_token = "SELECT user_id FROM user_token WHERE token_string = '$token'";
$result_token = mysqli_query($con, $sql_token);

if ($result_token) {
    $row_token = mysqli_fetch_assoc($result_token);

    // Decode the JSON data
    $user_id = $row_token['user_id'];

    // Fetch dashboard data from the database
    $sql = "SELECT dashboard_data FROM dashboard WHERE user_id = '$user_id'";
    $result = mysqli_query($con, $sql);

    if ($result) {
        $row = mysqli_fetch_assoc($result);

        // Check if dashboard_data exists before decoding
        if (isset($row['dashboard_data'])) {
            // Decode the JSON data
            $dashboard_data = json_decode($row['dashboard_data'], true);
            $response = $dashboard_data;
        } else {
            $response['error'] = "No dashboard data found";
        }
    } else {
        $response['error'] = "Error fetching dashboard data: " . mysqli_error($con);
    }

    $sql_userInfo = "SELECT user_name , user_pass FROM users WHERE user_id = '$user_id'";
    $result_userInfo = mysqli_query($con, $sql_userInfo);

    if ($result_userInfo) {
        $row_userInfo = mysqli_fetch_assoc($result_userInfo);

        $user_name = $row_userInfo["user_name"];  
        $user_pass = $row_userInfo["user_pass"];
        
    } else {
        $response['error'] = "Error fetching user data: " . mysqli_error($con);
    }



}

// Return the JSON response
echo json_encode(["user_name" => $user_name] + $response);

?>
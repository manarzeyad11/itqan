<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include the connection file
include '../connection.php';

$response = []; // Initialize an empty array

if ($local_con) {

    // Get token from the URL parameter
    $token = isset($_GET['token']) ? $_GET['token'] : null;

    // Fix the SQL query syntax
    $sql_logoutToken = "DELETE FROM user_token WHERE token_string = '$token'";
    $result_token = mysqli_query($local_con, $sql_logoutToken);

    if ($result_token) {
        // Provide a response if needed
        $response["logout"] = true;
    } else {
        $response["logout"] = false;
        $response["error"] = "Error deleting token";
    }

} else {
    $response["logout"] = false;
    $response["error"] = "Database connection failed";
}

// Send the JSON response
echo json_encode($response);

?>

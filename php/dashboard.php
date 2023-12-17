<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$con = mysqli_connect("localhost", "root", "", "signup_db");

$responce = array();


// Get user ID from the URL parameter
$user_id = isset($_GET['userId']) ? (int)$_GET['userId'] : 0;

// Validate user ID
if ($user_id <= 0) {
    echo "Invalid user ID.";
    exit();
}

// Fetch dashboard data from the database
$sql = "SELECT dashboard_data FROM dashboard WHERE user_id = $user_id";
$result = mysqli_query($con, $sql);

if ($result) {
    $row = mysqli_fetch_assoc($result);

    // Decode the JSON data
    $dashboard_data = json_decode($row['dashboard_data'], true);

    echo json_encode([ $dashboard_data]);


} else {
    echo "Error fetching dashboard data: " . mysqli_error($conn);
}


?>

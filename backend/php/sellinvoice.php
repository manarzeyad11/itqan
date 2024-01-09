<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include the connection file
include '../connection.php';

// Check if the required parameter is provided
if (isset($_GET["customername"])) {
    // Get the customer name from the query parameters
    $customerName = $_GET["customername"];

    // echo ($customerName);

    // To prevent from SQL injection
    $customerName = stripcslashes($customerName);
    $customerName = mysqli_real_escape_string($itqan_con, $customerName);

    // SQL query to search for the customer in the accounts table
    $sql = "SELECT accountstring FROM accounts WHERE accountstring LIKE '%$customerName%'";
    
    $result = mysqli_query($itqan_con, $sql);

    if ($result) {
        $rows = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        }

        // Return the results as JSON
        echo json_encode($rows);
    } else {
        // Handle the case when the query fails
        echo json_encode(["error" => "Failed to execute the query"]);
    }
} else {
    // Handle the case when the required parameter is missing
    echo json_encode(["error" => "Missing parameters in the URL"]);
}

?>

<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include the connection file
include '../connection.php';

// Check if the required parameter is provided
if (isset($_GET["itemname"])) {
    // Get the item name from the query parameters
    $itemname = $_GET["itemname"];

    echo ($itemname);

    // To prevent from SQL injection
    $itemname = stripcslashes($itemname);
    $itemname = mysqli_real_escape_string($itqan_con, $itemname);

    // SQL query to search for the customer in the items table
    $sql = "SELECT itemstring FROM items WHERE itemstring LIKE '%$itemname%'";
    
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

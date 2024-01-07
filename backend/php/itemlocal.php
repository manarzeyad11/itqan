<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include the connection file
include '../connection.php';

// SQL query to get all itemstring values from the accounts table
$sql = "SELECT itemstring FROM items";

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

?>

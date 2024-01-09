<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include the connection file
include '../connection.php';

// SQL query to join invoices_copy, accounts, and invoicesdet_copy tables
$sql = "SELECT invoices_copy.*, accounts.accountstring, invoicesdet_copy.*, items.itemstring  
        FROM invoices_copy
        LEFT JOIN accounts ON invoices_copy.theaccountid = accounts.accountid
        LEFT JOIN invoicesdet_copy ON invoices_copy.invoiceid = invoicesdet_copy.theinvoiceid
        LEFT JOIN items ON invoicesdet_copy.theitemid = items.itemid";


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

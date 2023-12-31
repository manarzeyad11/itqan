<?php

// mysqli_connect(host, username, password, dbname)
$local_con = mysqli_connect("localhost", "root", "", "signup_db");

$servername = "188.161.179.89";
$username = "root";
$password = "AlMamounPass123";
$database = "almamoun2015";

$itqan_con = new mysqli($servername, $username, $password, $database);


// Set the character set to UTF-8
mysqli_set_charset($itqan_con, 'utf8mb4');



$responce = array();

// if ($con) {
//     echo json_encode(["message" => "Database connection successfully"]);
// } else {
//     echo json_encode(["error" => "Database connection failed"]);
// }

?>
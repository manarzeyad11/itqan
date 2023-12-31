<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$local_con = mysqli_connect("localhost", "root", "", "signup_db");

$responce = array();

if ($local_con) {
    // Assuming you have received username and password as parameters
    $username = isset($_POST["user"]) ? $_POST["user"] : "";
    $password = isset($_POST["pass"]) ? $_POST["pass"] : "";

    echo json_encode([$username]);

    echo json_encode([$password]);

    $sql = "INSERT INTO users (user_name, user_pass) VALUES ('$username', '$password')";
    $result = mysqli_query($local_con, $sql);

    if ($result) {
        echo json_encode(["message" => "Data inserted successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . mysqli_error($local_con)]);
    }
} else {
    echo json_encode(["error" => "Database connection failed"]);
}

?>

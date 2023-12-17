<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$con = mysqli_connect("localhost", "root", "", "signup_db");

$responce = array();

if ($con) {
    if (isset($_GET["username"]) && isset($_GET["password"])) {
        $username = $_GET["username"];
        $password = $_GET["password"];

        // To prevent from mysqli injection
        $username = stripcslashes($username);
        $password = stripcslashes($password);
        $username = mysqli_real_escape_string($con, $username);
        $password = mysqli_real_escape_string($con, $password);

        $sql = "SELECT user_id FROM users WHERE user_name = '$username' AND user_pass = '$password'";
        $result = mysqli_query($con, $sql);

        if ($result && $row = mysqli_fetch_assoc($result)) {
            $user_id = $row['user_id'];
            echo json_encode(["login" => "Y", "user_id" => $user_id]);
        } else {
            
            echo json_encode(["login" => "N"]);
        }
    } else {
        echo json_encode(["error" => "Missing parameters in the URL"]);
    }
} else {
    echo json_encode(["error" => "Database connection failed"]);
}

?>

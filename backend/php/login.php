<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include the connection file
include '../connection.php';

session_start();

if ($local_con) {
    if (isset($_GET["username"]) && isset($_GET["password"])) {
        $username = $_GET["username"];
        $password = $_GET["password"];

        // To prevent from mysqli injection
        $username = stripcslashes($username);
        $password = stripcslashes($password);
        $username = mysqli_real_escape_string($local_con, $username);
        $password = mysqli_real_escape_string($local_con, $password);

        // Check if there is an existing token for the user
        $existingTokenSql = "SELECT user_id, token_string, token_status FROM user_token WHERE user_id IN (SELECT user_id FROM users WHERE user_name = '$username' AND user_pass = '$password')";
        $existingTokenResult = mysqli_query($local_con, $existingTokenSql);

        if ($existingTokenResult && $existingTokenRow = mysqli_fetch_assoc($existingTokenResult)) {
            $user_id = $existingTokenRow['user_id'];
            $existingToken = $existingTokenRow['token_string'];
            $token_status = $existingTokenRow['token_status'];

            // Check if the token status is "approved"
            if ($token_status == 'approved') {
                echo json_encode(["login" => "Y", "user_id" => $user_id, "token" => $existingToken, "token_status" => $token_status]);
            } else {
                echo json_encode(["login" => "Y", "user_id" => $user_id, "token" => $existingToken, "token_status" => $token_status]);
            }
        } else {
            // No existing token, generate a new one
            $sql = "SELECT user_id FROM users WHERE user_name = '$username' AND user_pass = '$password'";
            $result = mysqli_query($local_con, $sql);

            if ($result && $row = mysqli_fetch_assoc($result)) {
                $user_id = $row['user_id'];

                $token = session_id();
                // echo json_encode(['Token from session_id' => $token]);

                // Insert the token into the user_token table with token_status as "not approved"
                $insertTokenSql = "INSERT INTO user_token (user_id, token_string, token_status) VALUES ('$user_id', '$token', 'NA')";
                $insertTokenResult = mysqli_query($local_con, $insertTokenSql);

                if ($insertTokenResult) {
                    echo json_encode(["login" => "Y", "user_id" => $user_id, "token" => $token, "token_status" => "NA"]);
                } else {
                    echo json_encode(["error" => "Failed to store token"]);
                }
            } else {
                echo json_encode(["login" => "N"]);
            }
        }
    } else {
        echo json_encode(["error" => "Missing parameters in the URL"]);
    }
} else {
    echo json_encode(["error" => "Database connection failed"]);
}

?>

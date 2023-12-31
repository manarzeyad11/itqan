<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header('Content-Type: text/html; charset=utf-8');

ini_set('default_charset', 'UTF-8');

mb_internal_encoding('UTF-8');

// Include the connection file
include '../connection.php';

$response = array();

// Get token from the URL parameter
$token = isset($_GET['token']) ? $_GET['token'] : null;

$sql_token = "SELECT user_id FROM user_token WHERE token_string = '$token'";
$result_token = mysqli_query($local_con, $sql_token);

if ($result_token) {
    $row_token = mysqli_fetch_assoc($result_token);

    // Check if 'user_id' key exists in $row_token before accessing it
    if (isset($row_token['user_id'])) {
        // Decode the JSON data
        $user_id = $row_token['user_id'];

        $sql = "SELECT license_id FROM user_license WHERE user_id = '$user_id'";
        $result = mysqli_query($local_con, $sql);

        if ($result) {
            $row = mysqli_fetch_assoc($result);

            $license_id = $row["license_id"];

            $sql_usertype = "SELECT user_type_id FROM license WHERE license_id = '$license_id'";
            $result_usertype = mysqli_query($local_con, $sql_usertype);

            if ($result_usertype) {
                $row_usertype = mysqli_fetch_assoc($result_usertype);
                $user_type_id = $row_usertype["user_type_id"];

                $styling_data = array(); // Initialize the styling_data as an array

                if ($user_type_id == 1) {
                    // If user_type_id is 1, admin
                    $styleid = "admin";
                } elseif ($user_type_id == 2) {
                    // If user_type_id is 2, user
                    $styleid = "user";
                }


                // $sql_style = "SELECT s.*, c.color_name AS color 
                // FROM styling s 
                // JOIN colors c ON s.color = c.color_id 
                // WHERE s.styleid = '$styleid'";

                // $sql_style = "SELECT s.*, c.color_name, w.wordstring AS stylestring, w.wordid AS color 
                //   FROM styling s 
                //   JOIN colors c ON s.color = c.color_id 
                //   JOIN words w ON s.stylestring = w.wordid 
                //   WHERE s.styleid = '$styleid' and w.langid = 'ar'";

                $sql_style = "SELECT s.*, c.color_name AS color, w.wordstring AS stylestring
              FROM styling s 
              JOIN colors c ON s.color = c.color_id 
              JOIN words w ON s.stylestring = w.wordid 
              WHERE s.styleid = '$styleid' AND w.langid = 'ar'";


                // $sql_style = "SELECT * FROM words";

                $result_style = mysqli_query($itqan_con, $sql_style);



                if ($result_style) {
                    // Fetch all rows from the styling table when $styleid is "admin" or "user"
                    while ($row_style = mysqli_fetch_assoc($result_style)) {
                        $styling_data[] = $row_style;
                    }
                } else {
                    $response['error'] = "Error fetching styling data: " . mysqli_error($local_con);
                }

            } else {
                $response['error'] = "Error fetching user type data: " . mysqli_error($local_con);
            }
        } else {
            $response['error'] = "Error fetching license data: " . mysqli_error($local_con);
        }

        $sql_userInfo = "SELECT user_name, user_pass FROM users WHERE user_id = '$user_id'";
        $result_userInfo = mysqli_query($local_con, $sql_userInfo);

        if ($result_userInfo) {
            $row_userInfo = mysqli_fetch_assoc($result_userInfo);

            $user_name = $row_userInfo["user_name"];
            $user_pass = $row_userInfo["user_pass"];
        } else {
            $response['error'] = "Error fetching user data: " . mysqli_error($local_con);
        }
    } else {
        $response['error'] = "User ID not found in token data.";
    }
} else {
    $response['error'] = "Error fetching token data: " . mysqli_error($local_con);
}

// Return the JSON response
echo json_encode([
    "user_id" => $user_id,
    "user_name" => $user_name,
    "license_id" => $license_id,
    "user_type_id" => $user_type_id,
    "styling_data" => $styling_data,
] + $response);

?>
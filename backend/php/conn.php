<?php
$servername = "188.161.179.89";
$username = "root";
$password = "AlMamounPass123";
$database = "almamoun2015";

$itqan_con = new mysqli($servername, $username, $password, $database);


if ($itqan_con->connect_error) {
    die("Connection failed: " . $itqan_con->connect_error);
}

// Fetch all rows from the styling table
$result = $itqan_con->query("SELECT * FROM styling");

if ($result->num_rows > 0) {
    echo "<table border='1'>";
    echo "<tr><th>styleid</th><th>x</th><th>y</th><th>color</th><th>size</th><th>styleicon</th><th>form</th><th>stylestring</th><th>page</th><th>fun</th><th>styleapp</th></tr>";

    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        echo "<tr><td>" . $row["styleid"] . "</td><td>" . $row["x"] . "</td><td>" . $row["y"] . "</td><td>" . $row["color"] . "</td><td>" . $row["size"] . "</td><td>" . $row["styleicon"] . "</td><td>" . $row["form"] . "</td><td>" . $row["stylestring"] . "</td><td>" . $row["page"] . "</td><td>" . $row["fun"] . "</td><td>" . $row["styleapp"] . "</td></tr>";
    }

    echo "</table>";
} else {
    echo "No records found in the 'styling' table";
}

$itqan_con->close();
?>

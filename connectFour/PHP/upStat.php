<?php
include './connectDB.php';

$conn = db_connect();
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // This part will help decide which column needs to be updated
    $statement = '';
    if ($_GET['result'] == -1) $statement = 'draws=draws+1';
    else if ($_GET['result'] == 0) $statement = 'wins=wins+1';
    else if ($_GET['result'] == 1) $statement = 'losses=losses+1';

    $sql = 'UPDATE records SET ' . $statement . ', time_played=time_played+? WHERE login = ?';
    if ($stmt = mysqli_prepare($conn, $sql)) {
        // Here we'll bind variables to the prepared statement as parameters
        mysqli_stmt_bind_param($stmt, "ss", $_GET['time'], $_SESSION['login']);
        // Then we'll try to execute the prepared statement
        if (!mysqli_stmt_execute($stmt)) {
            echo "Something seems to have happened incorrectly. Sorry, but come back in a second or two and we'll have it fixed.";
        }
    }
}
?>
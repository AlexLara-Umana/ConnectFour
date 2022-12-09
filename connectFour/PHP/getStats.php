<?php
include './connectDB.php';

$conn = db_connect();

// Initializes the session
session_start();

// This sql statement gets the stats of a player
$sql = 'SELECT * FROM records WHERE login=?';

if ($stmt = mysqli_prepare($conn, $sql)) {
    // Binds the variables to the prepared statement as parameters
    mysqli_stmt_bind_param($stmt, "s", $username);
    // Sets the parameters
    $username = $_SESSION['login'];
    if (mysqli_stmt_execute($stmt)) {
        mysqli_stmt_bind_result($stmt, $username, $wins, $losses, $draws, $time_played);
        mysqli_stmt_fetch($stmt);
        $result = [
            'login' => $username,
            'wins' => $wins,
            'losses' => $losses,
            'draws' => $draws,
            'time_played' => $time_played
        ];
        echo json_encode($result);
    }
    mysqli_stmt_close($stmt);
}

?>
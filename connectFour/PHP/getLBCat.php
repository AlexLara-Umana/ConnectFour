<?php
include './connectDB.php';

if ($_SERVER['REQUEST_METHOD']) {
    $category = $_POST['category'];
    $order = $_POST['ascend'] ? 'ASC' : 'DESC';
    
    $conn = db_connect();
    $sql = 'SELECT login, ' . $category . 
            ' FROM records ORDER BY ' . $category .
            ' ' . $order . ' LIMIT 5';
    
    if ($stmt = mysqli_prepare($conn, $sql)) {
        $users = [];
        if (mysqli_stmt_execute($stmt)) {
            $result = mysqli_stmt_get_result($stmt);
            while ($row = mysqli_fetch_row($result)) {
                array_push($users, ['login' => $row[0], 'value' => $row[1]]);
            }
        }
        mysqli_stmt_close($stmt);
        echo json_encode($users);
    } 
    else {
        echo json_encode('A mistake has occured when attempting to retreive data from the leaderboard!');
        die();
    }
}
?>
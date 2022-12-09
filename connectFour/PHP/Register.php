<?php
include './connectDB.php';

$conn = db_connect();

// Put no values for username and password as a default
$username = $password = $password_confirm = "";
$username_err = $password_err = $password_confirm_err = "";

// validate request method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // validate username
    if (empty(trim($_POST["login"]))) {
        $username_err = "Please enter a username of your choice";
    } 
    elseif (!preg_match('/^[a-zA-Z0-9_]+$/', trim($_POST["login"]))) { // Alphaneumeric regex that would let you use underscores
        $username_err = "Username can only be made up of letters, numbers, and the exception of underscores";
    } 
    else {
        // Prepare a select statement for the database
        $sql = "SELECT id FROM admin WHERE login = ?";
        if($stmt = mysqli_prepare($conn, $sql)){
            // This will bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "s", $param_username);
            // Here we'll set parameters
            $param_username = trim($_POST["login"]);
            // Then we'll attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
                /* storing the result... */
                mysqli_stmt_store_result($stmt);
                
                if(mysqli_stmt_num_rows($stmt) == 1){
                    $username_err = "Unfortunately, this username is already taken. Please try a different name.";
                } 
                else{
                    $username = trim($_POST["login"]);
                }
            } 
            else{
                echo "Unfortunately there seems to be a mishap. Please come back later.";
            }
            // The closing statement
            mysqli_stmt_close($stmt);
        }
    }

    // Here we'll verify the password
    if(empty(trim($_POST["password"]))){
        $password_err = "Please enter a password of your choice.";     
    } 
    elseif(strlen(trim($_POST["password"])) < 6){
        $password_err = "Password must contain atleast 6 characters.";
    } 
    else{
        $password = trim($_POST["password"]);
    }
    
    // Validate confirm password
    if(empty(trim($_POST["password-confirm"]))){
        $password_confirm_err = "Please confirm the password.";     
    } 
    else{
        $password_confirm = trim($_POST["password-confirm"]);
        if(empty($password_err) && ($password != $password_confirm)){
            $password_confirm_err = "Password doesn't seem to match.";
        }
    }

    // Check input errors before inserting in database
    if(empty($username_err) && empty($password_err) && empty($password_confirm_err)){
        // Prepare an insert statement
        $sql_users = "INSERT INTO admin (login, password) VALUES (?, ?)";
        $sql_stats = "INSERT INTO records (login, wins, losses, draws, time_played) VALUES (?, 0, 0, 0, 0)";
        if(($stmt_users = mysqli_prepare($conn, $sql_users)) && ($stmt_stats = mysqli_prepare($conn, $sql_stats))) {
            // This will help bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt_users, "ss", $param_username, $param_password);
            mysqli_stmt_bind_param($stmt_stats, "s", $param_username);
            // Here we set the parameters
            $param_username = $username;
            $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash for us
            // Attempts to execute the prepared statement for the DB
            if(mysqli_stmt_execute($stmt_users) && mysqli_stmt_execute($stmt_stats)){
                // Redirects to the login page afterwards
                header("Location: ../Pages/Log.php?message=success");
            } 
            else{
                echo "Something seems to have malfunctioned. Please try again in a second or two.";
            }
            // The closing statement
            mysqli_stmt_close($stmt_users);
            mysqli_stmt_close($stmt_stats);
        }
    } 
    else {
        $error = '';
        // Here we prioritize reporting of the username error, then the password errors
        if (!empty($username_err)) $error = $username_err;
        elseif (!empty($password_err)) $error = $password_err;
        elseif (!empty($password_confirm_err)) $error = $password_confirm_err;
        // Then we'll redirect to the account page using get request to report error
        header("Location: ../Pages/Log.php?message=failure&error=" . $error . "");
    }
    // The closing connection
    mysqli_close($conn);
}

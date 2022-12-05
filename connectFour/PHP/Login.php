<?php

include './connectDB.php';

$conn = db_connect();

// Initialize the session
session_start();

// We redirect to the account page if you're logged in
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    header("Location: ../Pages/Account.php?message=loggedin");
    exit;
}

// Define variables and initialize with empty values
$username = $password = "";
$username_err = $password_err = $login_err = "";

// We process the form data when the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Check if username is empty
    if (empty(trim($_POST["login"]))) {
        $username_err = "Please enter username of your choice.";
    } 
    else {
        $username = trim($_POST["login"]);
    }

    // Check if password is empty
    if (empty(trim($_POST["password"]))) {
        $password_err = "Please enter your password of any kind.";
    } 
    else {
        $password = trim($_POST["password"]);
    }

    // Validate credentials for the user
    if (empty($username_err) && empty($password_err)) {
        // Prepares a select statement
        $sql = "SELECT id, login, password FROM admin WHERE login = ?";
        echo $sql;
        if ($stmt = mysqli_prepare($conn, $sql)) {
            // Bind the variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "s", $param_username);

            // Sets the parameters
            $param_username = $username;

            // Attempts to execute the prepared statement for us
            if (mysqli_stmt_execute($stmt)) {
                // Stores the result
                mysqli_stmt_store_result($stmt);

                // Check if the username already exists, if yes then verifies the password
                if (mysqli_stmt_num_rows($stmt) == 1) {
                    // Binds the result variables
                    mysqli_stmt_bind_result($stmt, $id, $username, $hashed_password);
                    if (mysqli_stmt_fetch($stmt)) {
                        if (password_verify($password, $hashed_password)) {
                            // If the Password is correct, then we start a new session
                            session_start();

                            // Stores data in the session variables
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["login"] = $username;
                            // Redirects the user to the account page
                            header('Location: ../Pages/Account.php?message=loggedin');
                        } 
                        else {
                            // If the Password is not valid, then we display a basic error message
                            $login_err = "Invalid Username, please check what you typed.";
                        }
                    }
                } 
                else {
                    // If the Username doesn't exist, then we display a basic error message
                    $login_err = "Invalid Password, please check how you typed it, make sure it's longer than six characters.";
                }
            } 
            else {
                $error = 'Something seems to have gone awry. Please try again in a sec or two.';
                header('Location: ../Pages/Account.php?message=failure&error=' . $error);
            }

            // The closing statement
            mysqli_stmt_close($stmt);
        }
    }

    // checks for errors
    $error = '';
    if (!empty($username_err)) $error = $username_err;
    elseif (!empty($password_err)) $error = $password_err;
    elseif (!empty($login_err)) $error = $login_err;

    // reports the error if one occured
    if (!empty($error))
        header('Location: ../Pages/Account.php?message=failure&error=' . $error);

    // The closing connection
    mysqli_close($conn);
}
?>
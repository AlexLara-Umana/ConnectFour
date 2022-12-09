<?php

function parse_db_credentials() {
    $db_params = parse_ini_file('./credDB.ini');
    define('DB_SERVER', $db_params['server']);
    define('DB_USERNAME', $db_params['username']);
    define('DB_PASSWORD', $db_params['password']);
    define('DB_NAME', $db_params['dbname']);
    define('DB_PORT', $db_params['port']);
}

function ensure_tables_exist($conn) {
    $user_table_query = 'CREATE TABLE IF NOT EXISTS admin (
        `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        `login` VARCHAR(50) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP);';
    
    $stats_table_query = 'CREATE TABLE IF NOT EXISTS records (
        `login` VARCHAR(50) PRIMARY KEY,
        `wins` INT NOT NULL,
        `losses` INT NOT NULL,
        `draws` INT NOT NULL,
        `time_played` INT NOT NULL);';
    
    if ($stmt = mysqli_prepare($conn, $user_table_query)) {
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }
    if ($stmt = mysqli_prepare($conn, $stats_table_query)) {
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }
    // Used for inserting dummy data
    $dummy_users = [
        ['roger', 'filler', 'sometime'],
        ['gitgud', 'filler', 'sometime'],
        ['rick', 'filler', 'sometime']
    ];
    $dummy_stats = [
        ['roger', 1245, 5, 2, 24865],
        ['samantha', 70, 30, 36, 12119],
        ['rick', 49, 1001, 1, 909]
    ];
    $user_sql = 'INSERT IGNORE INTO admin (login, password, created_at)
                    VALUES (?, ?, ?)';
    $stat_sql = 'INSERT IGNORE INTO records (login, wins, losses, draws, time_played)
                    VALUES (?, ?, ?, ?, ?)';

    foreach ($dummy_users as $user) {
        $stmt = $conn->prepare($user_sql);
        $stmt->bind_param("sss", $user[0], $user[1], $user[2]);
        $stmt->execute();
    }
    foreach ($dummy_stats as $stat) {
        $stmt = $conn->prepare($stat_sql);
        $stmt->bind_param("siiii", $stat[0], $stat[1], $stat[2], $stat[3], $stat[4]);
        $stmt->execute();
    }
}

function ensure_db_exists() {
    $conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, port:DB_PORT);
    $sql = 'CREATE DATABASE IF NOT EXISTS ' . DB_NAME . ';';
    $conn->query($sql);
}

function db_connect() {
    parse_db_credentials();
    ensure_db_exists();

    $conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT);
    ensure_tables_exist($conn);

    // flag false connection
    if ($conn == false) { die("ERROR: Unable to connect. " . mysqli_connect_error()); }

    return $conn;
}

?>
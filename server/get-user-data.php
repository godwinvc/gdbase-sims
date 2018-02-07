<?php
    include('./connection.php');
    $username = file_get_contents('php://input');
    // $username = "godwinvc";
    $query = "SELECT * FROM `students` WHERE `username` = '$username'";
    $userData = $db -> query($query);
    $userData = $userData -> fetch(PDO::FETCH_ASSOC);
    echo json_encode($userData);
?>
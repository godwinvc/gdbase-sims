<?php
    include('./connection.php');
    $username = json_decode(file_get_contents('php://input'));
    $username = $username -> username;
    // $username = "godwinvc";
    $query = "SELECT `simulation` FROM `students` WHERE `username` = '$username'";
    $simulation = $db -> query($query);
    $simulation = $simulation -> fetch();
    echo $simulation['simulation'];
?>
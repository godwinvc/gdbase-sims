<?php
    include('./connection.php');
    include('./import_wordpress.php');
    $data = json_decode(file_get_contents('php://input'));
    $username = $data -> username;
    $token = $data -> token;
    $q = $db -> query("SELECT * FROM `students` WHERE `token` = '$token' AND `username` = '$username'");
    $check = $q -> fetchAll();
    if(is_user_logged_in() && count($check) == 1){
        echo "good";
    }else{
        echo "bad";
    }
?>
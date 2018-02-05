<?php
    include('./connection.php');
    $login_data = json_decode(file_get_contents('php://input'));
    $username = $login_data -> username;
    $password = sha1($login_data -> password);
    $query = "SELECT `username` FROM `students` WHERE `username` = '$username' AND `password` = '$password'";
    $user_info = $db -> query($query);
    $user_info = $user_info -> fetchAll();

    if(count($user_info) == 1){
        $token = $username ."|". uniqid().uniqid().uniqid();
        $q = "UPDATE `students` SET `token` = :token WHERE `username` = :username AND `password` = :password";
        $query = $db -> prepare($q);
        $execute = $query -> execute(array(
            ":token" => $token,
            ":username" => $username,
            ":password" => $password
        ));
        echo $token;
    }else{
        echo 'ERROR';
    }
?>

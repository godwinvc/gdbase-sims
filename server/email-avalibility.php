<?php
    include('./connection.php');
    include('./import_wordpress.php');
    $email_entered = file_get_contents('php://input');
    $allUsers = $db -> query('SELECT `email` FROM `students`;');
    $allUsers = $allUsers -> fetchAll();
    $unique = 'null';
    for($i = 0; $i < count($allUsers); $i++){
        if($allUsers[$i]['email'] !== $email_entered && !email_exists($email_entered)){
            $unique = '0';
        }else{
            $unique = '1';
            break;
        }
    }
    echo $unique;
    //print_r($allUsers);
?>
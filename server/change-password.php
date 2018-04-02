<?php
include './connection.php';
include './import_wordpress.php';
$inputs = json_decode(file_get_contents('php://input'));
$email = $inputs->email;
$password = $inputs->password;
//echo $password;
$gwp_user = get_user_by('email', $email);
$query = "UPDATE `students` SET `password` = '".sha1($password)."' WHERE `email` = '$email'";
wp_set_password($password, $gwp_user->ID);
$gwp_user = get_user_by('email', $email);
if (wp_check_password($password, $gwp_user->user_pass, $gwp_user->ID)) {
    if(execute($db, $query)){
        echo "changedSucessfully";
    }else{
        echo "ERROR From Inside";
    }
}else{
    echo "ERROR From Outside";
}

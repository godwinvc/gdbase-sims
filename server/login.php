<?php
include './connection.php';
include('./import_wordpress.php');
$login_data = json_decode(file_get_contents('php://input'));
// $login_data = json_decode('{"username":"godwinvc","password":"$$$learning9"}');
$username = $login_data->username;
$password = sha1($login_data->password);
$password_plain = $login_data->password;
$query = "SELECT `username` FROM `students` WHERE `username` = '$username' AND `password` = '$password'";
// $query = "SELECT * FROM `students` WHERE `username` = '$username'";
$user_info = $db->query($query);
$user_info = $user_info->fetchAll();
// $user_info = $user_info->fetch(PDO::FETCH_ASSOC);
// print_r($user_info)."<br>";
// echo $password."<br>";
// echo $user_info['password'];
$user = get_user_by('login', $username);
if ($user && wp_check_password($password_plain, $user->data->user_pass, $user->ID) && count($user_info) == 1) {
    $token = $username . "|" . uniqid() . uniqid() . uniqid();
    $q = "UPDATE `students` SET `token` = :token WHERE `username` = :username AND `password` = :password";
    $query = $db->prepare($q);
    $execute = $query->execute(array(
        ":token" => $token,
        ":username" => $username,
        ":password" => $password,
    ));
    $user_signon = wp_signon(array('user_login' => $username, 'user_password' => $password_plain, 'remember' => true), false);
    if (is_wp_error($user_signon)) {
        echo $user_signon->get_error_message();
        echo $password_plain;
    } else {
        echo $token;
    }
} else {
    echo 'ERROR';
}

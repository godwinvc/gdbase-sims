<?php
include './connection.php';
$signup_data = json_decode(file_get_contents('php://input'));
// $signup_data = json_decode('{"firstname":"Godwin","lastname":"Rathnamary","email":"alfa.godwin.omega@gmail.com","mobile":"9704323232","username":"godwinvc","password":"$$$learning9"}');

$token = $signup_data->username . "|" . uniqid() . uniqid() . uniqid();

$query = "INSERT INTO `students`(`firstname`, `lastname`, `username`, `email`, `mobile`,`password`, `token`, `simulation`) VALUES ('" . $signup_data->firstname . "', '" . $signup_data->lastname . "', '" . $signup_data->username . "', '" . $signup_data->email . "', '" . $signup_data->mobile . "', '" . sha1($signup_data->password) . "','" . $token . "', '{activationCode:".uniqid()."}')";

if (execute($db, $query)) {
    echo $token;
} else {
    echo "ERROR";
}

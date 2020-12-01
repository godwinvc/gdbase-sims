<?php
include './connection.php';
include './import_wordpress.php';
$email_entered = file_get_contents('php://input');
$allUsers = $db->query("SELECT * FROM `students` WHERE `email` = '$email_entered'");
$allUsers = $allUsers->fetch(PDO::FETCH_ASSOC);
$unique = 'null';
if ($allUsers != false && email_exists($email_entered)) {
    // has email in both databases
    echo json_encode(array(
        'response' => 'mailCode',
        'email'=> $email_entered,
        'firstname' => $allUsers['firstname'],
        'username' => $allUsers['username']
    ));
} elseif ($allUsers != false && !email_exists($email_entered)) {
    // found in my database but not in wordpress
    $user_id = wp_create_user($allUsers['username'], uniqid(), $allUsers['email']);
    if(!is_wp_error($user_id)){
        echo json_encode(array(
            'response' => 'addedToWordpress',
            'username' => $allUsers['username'],
            'email' => $allUsers['email'],
            'firstname' => $allUsers['firstname']
        ));
    }else{
        echo 'ERROR';
    }
} elseif ($allUsers == false && email_exists($email_entered)) {
    // found in wordpress database but not in mine
    $user = get_user_by( 'email', $email_entered );
    $token = 'LOGGED_OUT';
    $activation_code = uniqid();
    $resetPassQuery = "INSERT INTO `students`(`firstname`, `lastname`, `username`, `email`,`password`, `token`, `simulation`) VALUES ('" . $user -> user_nicename . "', '" . $user -> display_name . "', '" . $user -> user_login . "', '" . $user -> user_email . "','" . sha1(uniqid()) . "','" . $token . "', '{\"activationCode\":\"$activation_code\",\"accountActivated\":false,\"simulationMetadata\":{\"simulation1\":{\"paid\":true,\"attempted\":false},\"simulation2\":{\"paid\":false,\"attempted\":false},\"simulation3\":{\"paid\":false,\"attempted\":false},\"simulation4\":{\"paid\":false,\"attempted\":false},\"simulation5\":{\"paid\":false,\"attempted\":false},\"simulation6\":{\"paid\":false,\"attempted\":false}}}')";
    if (execute($db, $resetPassQuery)) {
        echo json_encode(array(
            'response' => 'addedToMyDB',
            'username' => $user -> user_login,
            'email' => $user -> user_email,
            'firstname' => $user -> user_nicename,
            'activationCode' => $activation_code
        ));
    }else{
        echo 'ERROR';
    }
} else {
    // not found any where. Unkown email address.
    echo "Unknown";
}

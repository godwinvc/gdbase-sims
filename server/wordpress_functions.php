<?php
require $_SERVER['DOCUMENT_ROOT'] . '/wordpress/wp-load.php';
$username = 'godwinvc2';
$password = 'user@1234';
$user_email = 'godwin.k01@elearningserv.com';

// code to for checking login.
/*$user = get_user_by('login', $username);
if ($user && wp_check_password($password, $user->data->user_pass, $user->ID)) {
echo "Good to go";
} else {
echo "Nope";
}*/

// code need for sign up
/*$user_id = username_exists($username);
if (!$user_id) {
    if (!email_exists($user_email)) {
        $user_id = wp_create_user($username, $password, $user_email);
        // wp_insert_user(array('user_login' => $username,'user_pass' => $password, 'user_email' => $user_email));
        if ( ! is_wp_error( $user_id ) ) {
            echo "User created : ". $user_id;
        }
    }else{
        echo "eMail already registered";
    }
} else {
    echo "username already exists";
}*/


// wordpress code for login with credientials 
/*function wordpress_login ($user_login, $user_password){
    $creds = array(
        'user_login' => $user_login,
        'user_password' => $user_password,
        'remember' => true
    );
    $user = wp_signon( $creds, true );
    if ( is_wp_error( $user ) ) {
        return $user->get_error_message();
    }else{
        return "loggined sucessfully";
    }
}
echo wordpress_login($username,$password);*/

// code to check if the user is loggedin
if(is_user_logged_in()){
    echo "Hell Yeah!";
}else{
    echo "Please fuck off";
}
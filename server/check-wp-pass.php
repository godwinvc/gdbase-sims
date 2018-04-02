<?php
include './connection.php';
include './import_wordpress.php';
$user = get_user_by( 'login', 'godwinvc' );
if ( $user && wp_check_password( 'user@123', $user -> user_pass, $user -> ID) )
   echo "That's it";
else
   echo "Nope";

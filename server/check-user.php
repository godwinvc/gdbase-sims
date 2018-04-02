<?php
    include ('./import_wordpress.php');
    if(is_user_logged_in()){
        echo "loggedIn";
    }else{
        echo "notLoggedIn";
    }
?>

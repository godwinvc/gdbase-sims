<?php
    include('./connection.php');
    $signup_data = json_decode(file_get_contents('php://input'));

    $token = $signup_data -> username ."|".uniqid().uniqid().uniqid();

    $query = "INSERT INTO `students`(`firstname`, `lastname`, `username`, `email`, `mobile`,`password`, `token`, `simulation`) VALUES ('".$signup_data -> firstname."', '".$signup_data -> lastname."', '".$signup_data -> username."', '".$signup_data -> email."', '".$signup_data -> mobile."', '".$signup_data -> password."','".$token."', '{}')";
    
    function execute(PDO $conn, $sql) {
        $affected = $conn->exec($sql);
        if ($affected === false) {
            $err = $conn->errorInfo();
            if ($err[0] === '00000' || $err[0] === '01000') {
                return true;
            }
            return false;
        }else{
            return true;
        }
    }

    if(execute($db,$query)){
        echo $token;
    }else{
        echo "ERROR";
    }
?>
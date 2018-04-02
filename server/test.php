<?php
    include("./connection.php");
    $password = 'kingkiller_22';
    $email = 'godwin@godwinvc.com';
    $query = "UPDATE `students` SET `password` = '$password' WHERE `email` = '$email'";

    function execute_test(PDO $conn, $sql) {
        $affected = $conn->exec($sql);
        if ($affected === false) {
            $err = $conn->errorInfo();
            if ($err[0] === '00000' || $err[0] === '01000') {
                return true;
            }
            print_r($err);
        }else{
            echo "Insterted Successfully";
        }
    }
    print_r (execute_test($db, $query));
?>
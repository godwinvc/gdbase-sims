<?php

    include("./connection.php");

    $query = "INSERT INTO `students` (`firstname`, `lastname`, `email`, `mobile`, `username`, `password`, `token`, `simulation`) VALUES
    ('firstname', 'lastname', 'email', 'mobile', 'username', 'password', 'token', 'simulation');";

    function execute(PDO $conn, $sql) {
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
    print_r (execute($db, $query));
?>
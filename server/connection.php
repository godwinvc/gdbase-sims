<?php
$db = new PDO("mysql:host=localhost;dbname=gdbaqsej_users;port:3306","gdbaqsej_godwinvc","GDBase1504!");

// try {

//     $db = new PDO("mysql:host=localhost;dbname=gdbaqsej_users;port:3306", "root", "password");
//     $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//     echo "Database Conncetion Success";
// } catch (PDOException $e) {
//     echo "Connection Failed: " . $e->getMessage();
// }

function execute(PDO $conn, $sql)
{
    $affected = $conn->exec($sql);
    if ($affected === false) {
        $err = $conn->errorInfo();
        if ($err[0] === '00000' || $err[0] === '01000') {
            return true;
        }
        return $err;
    } else {
        return true;
    }
}

<?php
include './connection.php';
$sim_data = json_decode(file_get_contents('php://input'));
$username = $sim_data->username;
$simulationData = json_encode($sim_data->simulation);
$query = "UPDATE `students` SET `simulation`='$simulationData' WHERE `username` = '$username'";
if (execute($db, $query)) {
    echo 'updated';
} else {
    echo execute($db, $query);
}
;

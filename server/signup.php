<?php
include './connection.php';
include './import_wordpress.php';
$signup_data = json_decode(file_get_contents('php://input'));

// $signup_data = json_decode('{"firstname":"Godwin","lastname":"Rathnamary","email":"alfa.godwin.omega@gmail.com","mobile":"9704323232","username":"godwinvc","password":"$$$learning9"}');

$token = $signup_data->username . "|" . uniqid() . uniqid() . uniqid();
$activation_code = uniqid();
$query = "INSERT INTO `students`(`firstname`, `lastname`, `username`, `email`, `mobile`,`password`, `token`, `simulation`) VALUES ('" . $signup_data->firstname . "', '" . $signup_data->lastname . "', '" . $signup_data->username . "', '" . $signup_data->email . "', '" . $signup_data->mobile . "', '" . sha1($signup_data->password) . "','" . $token . "', '{\"activationCode\":\"$activation_code\",\"accountActivated\":false,\"simulationMetadata\":{\"simulation1\":{\"paid\":true,\"attempted\":false},\"simulation2\":{\"paid\":false,\"attempted\":false},\"simulation3\":{\"paid\":false,\"attempted\":false},\"simulation4\":{\"paid\":false,\"attempted\":false},\"simulation5\":{\"paid\":false,\"attempted\":false},\"simulation6\":{\"paid\":false,\"attempted\":false}}}')";

if (execute($db, $query)) {
    $user_id = wp_create_user($signup_data->username, $signup_data->password, $signup_data->email);
    if (!is_wp_error($user_id)) {
        $user = get_user_by('login', $signup_data->username);
        $user_signon = wp_signon(array('user_login' => $signup_data->username, 'user_password' => $signup_data->password, 'remember' => true), false);
        if (is_wp_error($user_signon)) {
            //echo $user_signon->get_error_message();
            echo "ERROR logging in after signup";
        } else {

            // MailChimp Credintials
            $apiKey = "";
            $listID = "";

            // MailChimp API URL
            $memberID = md5(strtolower($signup_data->email));
            $dataCenter = substr($apiKey, strpos($apiKey, '-') + 1);
            $apiURL = 'https://' . $dataCenter . '.api.mailchimp.com/3.0/lists/' . $listID . '/members';

            // member info in json for MailChimps
            $mcJson = json_encode([
                'email_address' => $signup_data->email,
                'status' => 'subscribed',
                'merge_fields' => [
                    'FNAME' => $signup_data->firstname,
                    'LNAME' => $signup_data->lastname,
                    'PHONE' => $signup_data->mobile
                ]
            ]);

            // HTTP POST to MailChimp dataCenter with curl
            $ch = curl_init($apiURL);
            curl_setopt($ch, CURLOPT_USERPWD, 'user:' . $apiKey);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']); 
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $mcJson);
            $mailChimpResponse = curl_exec($ch);
            $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            // send end result.
            echo json_encode(array("signUp" => true, "token" => $token, "activationCode" => $activation_code, "mailChimpStatus" => $status_code, 'mailchimpData' => $mailChimpResponse));
        }
    } else {
        echo 'ERROR creating user in wordpress';
    }
} else {
    echo execute($db, $query);
}

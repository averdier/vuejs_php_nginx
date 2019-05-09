<?php
    include('utils/auth.php');
    include('config.php');

    function get_client_from_username ($dbClient, $username) {
        $clean = mysqli_real_escape_string($dbClient, $username);
        $query = "SELECT id, password_hash FROM clients WHERE username = '$clean'";
        $result = mysqli_query($dbClient, $query);
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

        if (mysqli_num_rows($result) > 0) {
            return $row;
        }

        return NULL;
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        header('Content-Type: application/json');
        
        $content = file_get_contents("php://input");
        $decoded = json_decode($content, true);
        $client = get_client_from_username($db, $decoded['username']);
        
        if ($client != NULL) {
            if (password_verify($decoded['password'], $client['password_hash']))  {
                $token = build_token(file_get_contents(AUTH_PRIVKEY), array("username" => $decoded['username']), 3600);
                echo json_encode(array('token' => $token));
            }
            else {
                http_response_code(401);
                echo json_encode(array('error' => 'Invalid username or password'));
            }
        }
        else {
            http_response_code(401);
            echo json_encode(array('error' => 'Invalid username or password'));
        }
    }
?>
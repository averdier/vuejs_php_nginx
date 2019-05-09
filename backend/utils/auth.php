<?php
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;

/**
 * Build JWT token
 */
function build_token ($private_key, $client_data, $duration) {
    $now = time();
    $unencoded = array(
        "iss" => "boilerplate",
        "aud" => "boilerplate",
        "iat" => $now,
        "exp" => $now + $duration,
        "client" => $client_data
    );
    return JWT::encode($unencoded, $private_key, 'RS512');
}

function decode_token($public_key, $token) {
    try {
        $decoded = JWT::decode($token, $public_key, array('RS512'));
        return $decoded;
    } catch (Exception $e) {
        return NULL;
    }
}

function require_auth () {
    $headers = getallheaders();
    
    $authenticated = FALSE;
    if (isset($headers['Authorization'])) {
        $parts = explode(" ", $headers['Authorization']);
        if (count($parts) > 1 && $parts[0] == "Bearer") {
            $token = decode_token(file_get_contents(AUTH_PUBKEY), $parts[1]);
            if ($token != null) {
                $authenticated = TRUE;
            }
        }  
    }

    if ($authenticated) {
        return TRUE;
    }
    else {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(array('error' => 'Invalid username or password'));
        exit();
    }
}

?>
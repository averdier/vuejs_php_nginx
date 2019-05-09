<?php
    define('DB_SERVER', 'database:3306');
    define('DB_USERNAME', 'root');
    define('DB_PASSWORD', 'password');
    define('DB_DATABASE', 'database');
    define('AUTH_PUBKEY', '/var/www/keys/auth_pubkey.pem');
    define('AUTH_PRIVKEY', '/var/www/keys/auth_privkey.pem');
    $db = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);
?>
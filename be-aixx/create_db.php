<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS be_aixx");
    echo "Database 'be_aixx' created successfully or already exists.\n";
} catch (PDOException $e) {
    die("DB ERROR: " . $e->getMessage());
}

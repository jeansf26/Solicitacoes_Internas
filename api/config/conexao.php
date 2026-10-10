<?php
// config/conexao.php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(dirname(__DIR__, 1));
$dotenv->load();

$host = $_ENV['DB_HOST'];
$port = $_ENV['DB_PORT'] ?? '3306';
$db = $_ENV['DB_NAME'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    return $pdo;
} catch (PDOException $e) {
    error_log("Falha na conexão com o banco de dados: " . $e->getMessage());
    die(json_encode(["erro" => "Erro interno do servidor ao conectar com o banco."]));
}
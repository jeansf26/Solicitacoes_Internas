<?php
// migrate.php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ );
$dotenv->load();

$host = $_ENV['DB_HOST'];
$port = $_ENV['DB_PORT'] ?? '3306';
$db = $_ENV['DB_NAME'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];

try {
    $pdo = new PDO("mysql:host=$host;port=$port;charset=utf8mb4", $user,$pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    // Cria o banco
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `$db`;");

    // Tabela 1: solicitacao
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS solicitacao (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            descricao TEXT NOT NULL,
            solicitante VARCHAR(255) NOT NULL,
            area_solicitante VARCHAR(255) NOT NULL,
            prioridade VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            comentario TEXT,
            data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data_atualizacao TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
        );
    ");

    // Tabela 2: Usuario
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS usuario (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ");

    $senhaHash = password_hash('admin', PASSWORD_DEFAULT);

    $stmt =$pdo->prepare("INSERT IGNORE INTO usuario (nome, email, senha) VALUES (:nome1, :email1, :senha)");

    $stmt->execute([
        'nome1'  => 'Administrador do Sistema',
        'email1' => 'admin@gmail.com',
        'senha'  => $senhaHash
    ]);

    echo "Sucesso: Banco de dados e tabelas criados/atualizados com sucesso!\n";

} catch (PDOException $e) {
    echo "Erro na migração: " . $e->getMessage() . "\n";
}
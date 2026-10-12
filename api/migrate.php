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

    // Tabela 1: Usuario
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS usuario (
            id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Tabela 2: solicitacao
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS solicitacao (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            descricao TEXT NOT NULL,
            area_solicitante VARCHAR(255) NOT NULL,
            prioridade VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            comentario TEXT,
            data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data_atualizacao TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
            solicitante_id INT NOT NULL,
            CONSTRAINT fk_solicitante FOREIGN KEY (solicitante_id) REFERENCES usuario(id) ON DELETE CASCADE
        );
    ");

    // Inserção dos 2 usuários iniciais
    $senhaHash = password_hash('admin', PASSWORD_DEFAULT);

    $usuarios = [
        [
            'nome'  => 'Administrador do Sistema',
            'email' => 'admin@gmail.com',
            'senha' => $senhaHash,
        ],
        [
            'nome'  => 'Maria Oliveira',
            'email' => 'maria@gmail.com',
            'senha' => $senhaHash,
        ],
    ];

    $stmtUsuario = $pdo->prepare("INSERT IGNORE INTO usuario (nome, email, senha) VALUES (:nome, :email, :senha)");
    foreach ($usuarios as $u) {
        $stmtUsuario->execute($u);
    }

    // Busca os IDs dos usuários criados para vincular às solicitações
    $stmtFindUser = $pdo->prepare("SELECT id FROM usuario WHERE email = :email");
    $stmtFindUser->execute(['email' => 'admin@gmail.com']);
    $adminId = $stmtFindUser->fetchColumn();

    $stmtFindUser->execute(['email' => 'maria@gmail.com']);
    $mariaId = $stmtFindUser->fetchColumn();

    // Insere as solicitações iniciais apenas se a tabela estiver vazia
    $totalSolicitacoes = $pdo->query("SELECT COUNT(*) FROM solicitacao")->fetchColumn();

    if ($totalSolicitacoes == 0) {
        $solicitacoes = [
            [
                'titulo'           => 'Aquisição de novos notebooks para desenvolvimento',
                'descricao'        => 'Atualização das máquinas da equipe técnica para suportar os novos ambientes de desenvolvimento e virtualização.',
                'area_solicitante' => 'TI',
                'prioridade'       => 'Alta',
                'status'           => 'Aberta',
                'comentario'       => null,
                'solicitante_id'   => $adminId,
            ],
            [
                'titulo'           => 'Treinamento de Onboarding e Segurança da Informação',
                'descricao'        => 'Contratação de plataforma para capacitação dos novos colaboradores nas diretrizes internas de segurança.',
                'area_solicitante' => 'RH',
                'prioridade'       => 'Média',
                'status'           => 'Aberta',
                'comentario'       => null,
                'solicitante_id'   => $mariaId,
            ],
            [
                'titulo'           => 'Renovação das licenças de software de design',
                'descricao'        => 'Renovação anual de licenças de ferramentas de design e prototipação da equipe.',
                'area_solicitante' => 'Marketing',
                'prioridade'       => 'Média',
                'status'           => 'Aberta',
                'comentario'       => null,
                'solicitante_id'   => $adminId,
            ],
            [
                'titulo'           => 'Substituição de cadeiras ergonômicas no escritório',
                'descricao'        => 'Troca de cadeiras danificadas para adequação aos padrões de ergonomia do setor operacional.',
                'area_solicitante' => 'Operações',
                'prioridade'       => 'Baixa',
                'status'           => 'Aberta',
                'comentario'       => null,
                'solicitante_id'   => $mariaId,
            ],
            [
                'titulo'           => 'Reembolso de despesas de viagem sem comprovante fiscal',
                'descricao'        => 'Solicitação de reembolso de transporte corporativo apresentando apenas recibo não-fiscal.',
                'area_solicitante' => 'Financeiro',
                'prioridade'       => 'Baixa',
                'status'           => 'Aberta',
                'comentario'       => null,
                'solicitante_id'   => $adminId,
            ],
            [
                'titulo'           => 'Upgrade de link de internet e redundância de rede',
                'descricao'        => 'Contratação de link secundário dedicado para contingência em caso de oscilações do provedor principal.',
                'area_solicitante' => 'TI',
                'prioridade'       => 'Alta',
                'status'           => 'Aberta',
                'comentario'       => null,
                'solicitante_id'   => $mariaId,
            ],
        ];

        $stmtSolicitacao = $pdo->prepare("
            INSERT INTO solicitacao (titulo, descricao, area_solicitante, prioridade, status, comentario, solicitante_id)
            VALUES (:titulo, :descricao, :area_solicitante, :prioridade, :status, :comentario, :solicitante_id)
        ");

        foreach ($solicitacoes as $s) {
            $stmtSolicitacao->execute($s);
        }
    }

    echo "Sucesso: Banco de dados e tabelas criados/atualizados com sucesso!\n";

} catch (PDOException $e) {
    echo "Erro na migração: " . $e->getMessage() . "\n";
}
<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController
{
    public function login(Request $request, Response $response, array $args): Response
    {
        $pdo = require __DIR__ . '/../../config/conexao.php';

        $jwtSecret = $_ENV['JWT_SECRET'];

        // Pega os dados enviados no corpo da requisição (JSON)
        $data = $request->getParsedBody();
        
        $email = $data['email'] ?? null;
        $senha = $data['senha'] ?? null;

        if (!$email || !$senha) {
            $payload = json_encode(['erro' => 'E-mail e senha são obrigatórios']);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        $sql = "SELECT * FROM usuario WHERE email = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['email' => $email]);
        $usuario = $stmt->fetch();

        if ($usuario && password_verify($senha, $usuario['senha'])) {
            
            // Dados que vão dentro do token (Payload)
            $payloadData = [
                'iat' => time(),
                'exp' => time() + (60 * 60 * 2), // 2 horas
                'data' => [
                    'id' => $usuario['id'],
                ]
            ];

            $token = JWT::encode($payloadData, $jwtSecret, 'HS256');

            $resposta = json_encode([
                'status' => 'sucesso',
                'token' => $token
            ]);
            
            $response->getBody()->write($resposta);
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        }

        $payload = json_encode(['erro' => 'Credenciais inválidas']);
        $response->getBody()->write($payload);
        
        return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
    }
}
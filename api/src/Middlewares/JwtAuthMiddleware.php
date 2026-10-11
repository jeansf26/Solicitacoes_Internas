<?php
namespace App\Middlewares;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtAuthMiddleware {

    public function __invoke(Request $request, RequestHandler $handler): Response {
        $pdo = require __DIR__ . '/../../config/conexao.php';

        $jwtSecret = $_ENV['JWT_SECRET'];

        $authHeader = $request->getHeaderLine('Authorization');

        // Remove a palavra "Bearer " para pegar apenas o token
        $token = trim(str_ireplace('Bearer', '', $authHeader));

        if (empty($token)) {
            $response = new Response();
            $response->getBody()->write(json_encode(['erro' => 'Token não fornecido']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }

        try {
            // Tenta decodificar JWT enviado na requisição
            $decoded = JWT::decode($token, new Key($jwtSecret, 'HS256'));

            $usuarioId = $decoded->data->id;

            // Verifica se o usuário realmente existe no banco de dados
            $stmt = $pdo->prepare("SELECT id FROM usuario WHERE id = :id");
            $stmt->execute(['id' => $usuarioId]);
            $usuarioBanco = $stmt->fetch();

            if(!$usuarioBanco){
                $response = new Response();
                $response->getBody()->write(json_encode(['erro' => 'Token inválido ou expirado']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
            }

            // Pega o id de dentro do token e envia para o Controller
            $request = $request->withAttribute('usuario_id', $usuarioId);

        } catch(\Exception $e){
            $response = new Response();
            $response->getBody()->write(json_encode(['erro' => 'Token inválido ou expirado']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }

        // Se chegou aqui o token é valido e segue adiante
        return $handler->handle($request);
    }
}
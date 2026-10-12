<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class RequestController
{
    public function index(Request $request, Response $response, array $args): Response
    {
        $pdo = require __DIR__ . '/../../config/conexao.php';
        
        // Captura correta dos parâmetros de filtro
        $params = $request->getQueryParams();
        $titulo = $params['titulo'] ?? null;
        $prioridade = $params['prioridade'] ?? null;
        $status = $params['status'] ?? null;
        $ordem = (isset($params['ordem']) && strtoupper($params['ordem']) === 'DESC') ? 'DESC' : 'ASC';

        $where = "WHERE s.id > -1";
        $binds = [];

        if (!empty($titulo)) {
            $where .= " AND s.titulo LIKE ?";
            $binds[] = "%" . $titulo . "%";
        }
        if (!empty($prioridade)) {
            $where .= " AND s.prioridade = ?";
            $binds[] = $prioridade;
        }
        if (!empty($status)) {
            $where .= " AND s.status = ?";
            $binds[] = $status;
        }

        $sql = "SELECT 
                s.id,
                s.titulo,
                s.descricao,
                s.area_solicitante,
                s.prioridade,
                s.status,
                s.comentario,
                s.data_solicitacao,
                s.data_atualizacao,
                u.nome as nome_solicitante
                FROM solicitacao as s
                INNER JOIN usuario AS u ON u.id = s.solicitante_id 
                " . $where . " 
                ORDER BY s.data_solicitacao " . $ordem;

        $stmt = $pdo->prepare($sql);
        // Executa passando o array de valores correspondentes aos '?' da query
        $stmt->execute($binds);
        $solicitacoes = $stmt->fetchAll();

        $payload = json_encode($solicitacoes);
        $response->getBody()->write($payload);

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $pdo = require __DIR__ . '/../../config/conexao.php';
        $solicitacaoId = $args['id'] ?? null;

        $sql = "SELECT * FROM solicitacao WHERE id = :id_solicitacao";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id_solicitacao' => $solicitacaoId]);
        $solicitacoes = $stmt->fetch();

        $payload = json_encode($solicitacoes);
        $response->getBody()->write($payload);

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    public function store(Request $request, Response $response, array $args): Response
    {
        $pdo = require __DIR__ . '/../../config/conexao.php';
        $usuario = $request->getAttribute('usuario_id');

        // Pega os dados enviados no corpo da requisição (JSON)
        $data = $request->getParsedBody();
        
        $titulo = $data['titulo'] ?? null;
        $descricao = $data['descricao'] ?? null;
        $area = $data['area'] ?? null;
        $prioridade = $data['prioridade'] ?? null;
        $status = $data['status'] ?? null;
        $comentario = $data['comentario'] ?? null;

        if(!$titulo || !$descricao || !$area || !$prioridade || !$status ){
            $payload = json_encode("Há campos faltando na solicitação!");
            $response->getBody()->write($payload);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400);
        }

        $sql = "INSERT IGNORE INTO solicitacao 
        (titulo, descricao, area_solicitante, prioridade, status, comentario, solicitante_id)
        VALUES (:titulo, :descricao, :area, :prioridade, :status, :comentario, :solicitante_id)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'titulo' => $titulo,
            'descricao' => $descricao,
            'area' => $area,
            'prioridade' => $prioridade,
            'status' => $status,
            'comentario' => $comentario,
            'solicitante_id' => $usuario
        ]);

        $payload = json_encode("Solicitacao cadastrada com sucesso!");
        $response->getBody()->write($payload);

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $pdo = require __DIR__ . '/../../config/conexao.php';
        $solicitacaoId = $args['id'] ?? null;

        // Pega os dados enviados no corpo da requisição (JSON)
        $data = $request->getParsedBody();
        
        $titulo = $data['titulo'] ?? null;
        $descricao = $data['descricao'] ?? null;
        $area = $data['area'] ?? null;
        $prioridade = $data['prioridade'] ?? null;
        $status = $data['status'] ?? null;
        $comentario = $data['comentario'] ?? null;

        if(!$titulo || !$descricao || !$area || !$prioridade || !$status ){
            $payload = json_encode("Há campos faltando na solicitação!");
            $response->getBody()->write($payload);

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400);
        }

        $sql = "UPDATE solicitacao SET 
                titulo = :titulo, 
                descricao = :descricao, 
                area_solicitante = :area, 
                prioridade = :prioridade, 
                status = :status, 
                comentario = :comentario 
                WHERE id = :id";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'titulo' => $titulo,
            'descricao' => $descricao,
            'area' => $area,
            'prioridade' => $prioridade,
            'status' => $status,
            'comentario' => $comentario,
            'id' => $solicitacaoId
        ]);

        $payload = json_encode("Solicitação atualizada com sucesso!");
        $response->getBody()->write($payload);

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $pdo = require __DIR__ . '/../../config/conexao.php';
        $solicitacaoId = $args['id'] ?? null;

        $sql = "DELETE FROM solicitacao WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $solicitacaoId]);

        $payload = json_encode("Solicitação deletada com sucesso!");
        $response->getBody()->write($payload);

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }
}
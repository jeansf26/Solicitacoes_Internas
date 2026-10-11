<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use App\Controllers\AuthController;
use App\Controllers\RequestController;
use App\Middlewares\JwtAuthMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();


$app->addBodyParsingMiddleware(); // Permite que o Slim leia o corpo das requisições JSON
$app->addRoutingMiddleware(); // Permite que o Slim gerencie as rotas
$app->addErrorMiddleware(true, true, true); // Ativa o middleware de tratamento de erros para desenvolvimento

$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write("API de Solicitações rodando!");
    return $response;
});

// Rota de Login
$app->post('/login', [AuthController::class, 'login']);

// Rotas protegidas por JWT
$app->group('/solicitacoes', function (RouteCollectorProxy $group) {
    $group->get('/', [RequestController::class, 'index']);
    $group->get('/{id}', [RequestController::class, 'show']);
    $group->post('/cadastrar', [RequestController::class, 'store']);
    $group->post('/update/{id}', [RequestController::class, 'update']);
    $group->post('/delete/{id}', [RequestController::class, 'delete']);
})->add(new JwtAuthMiddleware());

$app->run();
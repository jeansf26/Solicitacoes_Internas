# Gestão de Solicitações Internas — Protótipo Web

> **Desafio Técnico:** Assessor de Desenvolvimento de Sistemas  
> **Formato:** Aplicação Web Full-Stack

## 💡 Visão Geral da Solução

O projeto consiste em um protótipo web para gerenciamento e acompanhamento de solicitações internas, substituindo fluxos informais (planilhas, e-mails e mensagens instantâneas).

A solução oferece:
- **Painel de Solicitações**
- **Fluxo de Análise e Decisão**
- **Dashboard Gerencial**
- **Autenticação Segura**

---

## 🛠 Tecnologias Utilizadas

### Front-end
- **Framework:** [Next.js](https://nextjs.org/) 16 (React 19) com App Router
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Ícones e Feedback:** Lucide React e React Hot Toast

### Back-end
- **Linguagem:** PHP 8.x
- **Microframework:** [Slim Framework 4](https://www.slimframework.com/) com PSR-7
- **Autenticação:** Firebase JWT (`firebase/php-jwt`)
- **Variáveis de Ambiente:** PHP dotenv (`vlucas/phpdotenv`)
- **Acesso a Dados:** PDO (PHP Data Objects) com Prepared Statements

### Banco de Dados
- **SGBD:** MySQL

---

## 📂 Arquitetura e Estrutura do Projeto

O repositório é organizado no formato de monorepo desacoplado:

```text
solicitacoes_internas/
├── api/                             # Back-end em PHP (Slim)
│   ├── config/
│   │   └── conexao.php              
│   ├── public/
│   │   └── index.php                # ponto de entrada da API
│   ├── src/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php     # Login e emissão de JWT
│   │   │   └── RequestController.php  # CRUD de solicitações e dashboard
│   │   └── Middlewares/
│   │       └── JwtAuthMiddleware.php  # Validador de token JWT
│   ├── migrate.php                  # Criação do banco de dados
│   ├── composer.json                
│   └── .env                         # Variáveis de ambiente da API
│
├── frontend/                        # Front-end em Next.js
│   ├── app/
│   │   ├── interno/                 
│   │   │   ├── dashboard/           # Página de métricas e indicadores
│   │   │   ├── solicitacoes/        # Gestão, listagem, criação e decisão
│   │   │   │   └── components/      # Modais de cadastro, filtro e exclusão
│   │   │   └── layout.tsx           # Layout com navegação lateral e validação de sessão
│   │   ├── login/                   # Tela de autenticação
│   │   └── services/                # Serviços de API, Cookies e formatação
│   ├── package.json                 
│   └── .env.local                   # URL da API para o cliente Next.js
│
└── README.md                        # Documentação da solução
```

---

## 💻 Pré-requisitos

Para executar o projeto localmente:
- **PHP** >= 8.1 com extensões `pdo_mysql` e `mbstring` habilitadas
- **Composer** >= 2.x
- **Node.js** >= 18.x e **npm** >= 9.x
- **MySQL** em execução

---

## 🚀 Instruções de Configuração e Execução


### 1. Back-end e Banco de dados (API PHP)

1. No diretório `api/`, instale as dependências via Composer:
   ```bash
   cd api
   composer install
   ```
2. Garanta que o serviço do MySQL esteja ativo.
3. Acesse o diretório `api/` e verifique o arquivo `.env.example` e renomeie para `.env`:
   ```env
   DB_HOST='127.0.0.1'
   DB_PORT='3306'
   DB_NAME='SolicitacoesInternas'
   DB_USER='root'
   DB_PASS=''
   JWT_SECRET='{MINHA_JWT_SECRET}'
   ```
   *(Ajuste o usuário e senha do MySQL caso seu ambiente local exija).*

4. Execute o script de criação do banco de dados, tabelas e dados iniciais (seeds):
   ```bash
   php migrate.php
   ```
   > Esse script cria o database `SolicitacoesInternas`, as tabelas `usuario` e `solicitacao` com chave estrangeira e insere 2 usuários e solicitações iniciais para demonstração.
   
5. Inicie o servidor embutido do PHP apontando para a pasta `public`:
   ```bash
   php -S localhost:80 -t public
   ```
   *(Caso a porta 80 esteja ocupada pelo Apache/IIS no Windows, você pode subir em outra porta, por exemplo `php -S localhost:8080 -t public`, e atualizar o `.env.local` do frontend).*

3. Verifique o funcionamento acessando no navegador: `http://localhost:80/` (retornará `"API de Solicitações rodando!"`).

---

### 2. Front-end (Next.js)

1. Em um novo terminal, acesse a pasta `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Verifique o arquivo `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:80
   ```
3. Inicie a aplicação Next.js em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse no navegador: **`http://localhost:3000`**

---

## 🔐 Credenciais de Acesso Pré-configuradas

O script de migração já popula a base com dois usuários para teste imediato:

| Nome | E-mail | Senha | Perfil |
| :--- | :--- | :--- | :--- |
| **Administrador do Sistema** | `admin@gmail.com` | `admin` | Gestor / Solicitante |
| **Maria Oliveira** | `maria@gmail.com` | `admin` | Solicitante |

---

## 📡 Endpoints da API

Todas as rotas sob `/solicitacoes` exigem o cabeçalho `Authorization: Bearer <token_jwt>`.

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/login` | Autentica usuário e retorna JWT |
| `GET` | `/solicitacoes/` | Lista solicitações com filtros (`titulo`, `prioridade`, `status`, `ordem`) |
| `GET` | `/solicitacoes/{id}` | Retorna detalhes de uma solicitação específica |
| `POST` | `/solicitacoes/cadastrar` | Cria uma nova solicitação associada ao usuário autenticado |
| `POST` | `/solicitacoes/update/{id}` | Atualiza dados da solicitação (status, comentário) |
| `POST` | `/solicitacoes/delete/{id}` | Exclui uma solicitação |
| `GET` | `/solicitacoes/dashboard` | Retorna dados prontos para o dashboard |

---

## ⚖️ Premissas e Limitações

### Premissas
1. **Separação de Responsabilidades:** O projeto foi dividido em duas partes, o frontend (Next.js) e o backend (API PHP), para permitir que cada um evolua independentemente.
2. **Segurança Na API:** Nenhuma solicitação pode ser cadastrada anonimamente; a API associa a autoria da solicitação diretamente ao ID extraído do payload do token JWT validado no backend.
3. **Simplicidade Visual:** Foco na usabilidade e clareza na apresentação das informações.

### Limitações do Protótipo
- **Níveis de acesso de Perfis:** Qualquer usuário autenticado tem acesso a todas as funcionalidades do sistema. Em versão produtiva, deve-se separar perfis em cargos.
- **Paginação:** A listagem atual traz o conjunto filtrado sem divisão por páginas, o que atende ao volume de um protótipo. Em um projeto completo a paginação seria necessária.

---

## 🏛 Considerações Arquiteturais

### Evolução da Solução

- **Paginação:** Para uma implementação futura, a paginação se daria necessaria par o caso de haver muitas solicitações cadastradas. Poderia ser feita na API com LIMIT/OFFSet.

- **Concorrência:** Para uma implementação futura, seria necessário pensar em um controle de concorrência, uma vez que em produção, mais de um usuário poderia tentar alterar o mesmo registro.

- **Paginação:** Para uma implementação futura, a paginação se daria necessaria par o caso de haver muitas solicitações cadastradas. Poderia ser feita na API com LIMIT/OFFSet.

- **Logs de Auditoria:** Para uma implementação futura, seria necessário implementar um sistema de logs de auditoria para registrar todas as ações realizadas pelos usuários.
---

### Integração com Sistemas Externos

*Cenário: Após a aprovação de uma solicitação, deve-se comunicar automaticamente um sistema corporativo externo (ex.: ERP, CRM ou sistema de compras).*

- **Acionar a Integração após uma solicitação ser cadastrada ou atualizada**
- **Realizar a comunicação pelo back-end, sem depender do front-end.**
- **Autenticação conforme as exigências do sistema externo.**
- **Garantir que a integração não impacte a experiência do usuário, preferencialmente de forma assíncrona.**
- **Registrar logs de erros para melhor depuração das tentativas de conexão.**

---

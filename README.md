## Cubos Bank API 
Bem-vindo(a) ao repositório da API do Cubos Bank

## Descrição do Projeto
O objetivo deste projeto é criar uma API RESTful para um Banco Digital, permitindo a realização de diversas operações bancárias. Este é um projeto piloto, com a possibilidade de adição de mais funcionalidades no futuro. Neste estágio inicial, os dados do banco, como nome, agência, etc., serão imutáveis.

## Funcionalidades Implementadas
A API permite realizar as seguintes operações:

-Criar conta bancária: Cria uma nova conta bancária com um número único de identificação, definindo o saldo inicial como 0.

-Atualizar dados do usuário: Permite atualizar os dados do usuário associado a uma conta bancária.

-Depositar em uma conta bancária: Realiza um depósito em uma conta bancária existente, aumentando seu saldo.

-Sacar de uma conta bancária: Realiza um saque em uma conta bancária existente, diminuindo seu saldo.

-Transferir valores entre contas bancárias: Permite transferir dinheiro de uma conta bancária para outra.

-Consultar saldo da conta bancária: Obtém o saldo atual de uma conta bancária.

-Emitir extrato bancário: Exibe o extrato contendo todas as transações realizadas em uma conta bancária.

-Excluir uma conta bancária: Remove uma conta bancária existente, desde que seu saldo seja igual a 0.

## Organização do Código
O código da API está organizado seguindo as melhores práticas de estruturação:

index.js: Ponto de entrada da aplicação.
servidor.js: Configuração e inicialização do servidor HTTP.
rotas.js: Definição das rotas da API.
Pasta controladores: Contém os controladores de cada rota, responsáveis por processar as requisições.
bancodedados.js: Arquivo contendo o objeto de persistência de dados em memória.
Persistência de Dados
Os dados das contas bancárias, transações de depósito, saque e transferência são persistidos em memória dentro do objeto bancodedados.js, seguindo uma estrutura pré-definida.

# Status Code
A API utiliza os seguintes Status Code padrão como resposta:

-200: Requisição bem sucedida.
-201: Requisição bem sucedida e algo foi criado.
-400: O servidor não entendeu a requisição pois está com uma sintaxe/formato inválido.
-404: O servidor não pode encontrar o recurso solicitado.
Endpoints Disponíveis
-Abaixo estão listados os endpoints disponíveis na API:

## Listar contas bancárias (Pessoa A):

GET /contas?senha_banco=123: Retorna a listagem de todas as contas bancárias existentes, após verificar a senha do banco.
Criar conta bancária (Pessoa B):

-POST /contas: Cria uma nova conta bancária com os dados fornecidos no body da requisição.
Atualizar usuário da conta bancária (Pessoa A):

-PUT /contas/:numeroConta/usuario: Atualiza os dados do usuário associado a uma conta bancária específica.
Excluir Conta (Pessoa A/B):

-DELETE /contas/:numeroConta: Exclui uma conta bancária existente, desde que seu saldo seja igual a 0.
Depositar (Pessoa B):

-POST /transacoes/depositar: Realiza um depósito em uma conta bancária existente.
Sacar (Pessoa A):

-POST /transacoes/sacar: Realiza um saque em uma conta bancária existente.
Transferir (Pessoa B):

-POST /transacoes/transferir: Permite transferir dinheiro entre contas bancárias.
Saldo (Pessoa A):

-GET /contas/saldo?numero_conta=123&senha=123: Retorna o saldo de uma conta bancária específica, após verificar a senha.
Extrato (Pessoa B):

-GET /contas/extrato?numero_conta=123&senha=123: Retorna o extrato contendo todas as transações de uma conta específica.
Observações
Valores monetários são representados em centavos (exemplo: R$ 10,00 = 1000).
Evite código duplicado, centralizando lógicas em funções reutilizáveis.
A persistência de dados é realizada em memória, no objeto bancodedados.js.
## Como Testar
Para testar a API, importe as collections disponíveis na pasta insomnia no seu cliente Insomnia ou similar. As coleções já contêm os endpoints e exemplos de requisições e respostas para cada funcionalidade.

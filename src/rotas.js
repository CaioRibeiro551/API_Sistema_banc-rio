const express = require('express');
const controladorConta = require('./controladores/funcoes');

const router = express.Router();


router.post('/contas', controladorConta.criarConta);

router.get('/contas', controladorConta.listarConta);

router.put('/contas/:numeroConta/usuario', controladorConta.atualizarUsuarioConta);

router.delete('/contas/:numeroConta', controladorConta.deletarConta);

router.post('/transacoes/depositar', controladorConta.depositar);

router.post('/transacoes/sacar', controladorConta.saque);

router.post('/transacoes/transferir', controladorConta.transferir)

router.get('./contas/saldo', controladorConta.saldo)
router.post('/transacoes/transferir', controladorConta.transferir);

router.get('/contas/saldo', controladorConta.saldo);

router.get('/contas/extrato', controladorConta.extrato);

module.exports = router;


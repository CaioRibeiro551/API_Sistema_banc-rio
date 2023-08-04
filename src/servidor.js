const express = require('express');
const servidor = express();
const rotas = require('./rotas');

function iniciarServidor() {
    servidor.use(express.json());
    servidor.use(rotas);
    servidor.listen(3000, () => {
        console.log('Servidor iniciado na porta 3000');
    })
};

module.exports = { servidor, iniciarServidor };


const { format } = require('date-fns');
const bancoDeDados = require('../bancodedados');

function listarConta(req, res) {
    const { senha_banco } = req.query;
    if (senha_banco !== bancoDeDados.banco.senha) {
        return res.json({ mensagem: 'senha do banco inválida' });
    }
    return res.status(200).json(bancoDeDados.contas);
};


function criarConta(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }


    const contaExistente = bancoDeDados.contas.find((conta) => conta.usuario.cpf === cpf || conta.usuario.email === email || conta.usuario.telefone === telefone);

    if (contaExistente) {
        return res.status(404).json({ mensagem: 'Já existe uma conta com os mesmos dados' })
    }

    const numeroConta = String(bancoDeDados.contas.length + 1);
    const NovaConta = {
        numero: numeroConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        },
    };

    bancoDeDados.contas.push(NovaConta);

    return res.status(201).json(NovaConta);

};


function atualizarUsuarioConta(req, res) {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = bancoDeDados.contas.find((conta) => conta.numero === numeroConta);

    if (!conta) {
        return res.status(400).json({ mensagem: 'Conta não encontrada' });
    }

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: 'Nenhum campo foi informado para atualização.' });
    }

    if (cpf && bancoDeDados.contas.some((conta) => conta.usuario.cpf === cpf)) {
        return res.status(400).json({ mensagem: 'Já existe outra conta com o mesmo CPF.' });
    }

    if (email && bancoDeDados.contas.some((conta) => conta.usuario.email === email)) {
        return res.status(400).json({ mensagem: 'Já existe outra conta com o mesmo email.' });
    }

    if (nome) {
        conta.usuario.nome = nome;
    }
    if (data_nascimento) {
        conta.usuario.data_nascimento = data_nascimento;
    }
    if (cpf) {
        conta.usuario.cpf = cpf;
    }
    if (email) {
        conta.usuario.email = email;
    }
    if (telefone) {
        conta.usuario.telefone = telefone;
    }
    if (senha) {
        conta.usuario.senha = senha;
    }

    return res.status(200).json({ mensagem: 'Conta atualizada com sucesso!' })
}


function deletarConta(req, res) {
    const { numeroConta } = req.params;

    const contaValida = bancoDeDados.contas.find((conta) => conta.numero === numeroConta);

    if (!contaValida) {
        return res.status(404).json({ mensagem: 'Número da conta inválida' });
    }

    if (contaValida.saldo != 0) {
        return res.status(400).json({ mensagem: 'Seu saldo deve ser 0, para excluir a conta' });
    }

    bancoDeDados.contas = bancoDeDados.contas.filter((conta) => conta.numero !== contaValida.numero);
    return res.status(200).json({ mensagem: 'Conta excluida com sucesso!' });
}


function depositar(req, res) {
    const { numero_conta, valor } = req.body;


    const contaNumero = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

    if (contaNumero === null || valor === null) {
        return res.status(404).json({ mensagem: 'Forneça o numero da conta e o valor corretamente' })
    }

    if (!contaNumero) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Valor de depósito inválido' })
    }

    contaNumero.saldo += valor;



    const data = format(new Date(), "YYY'-'MM'-'dd k':'m':'ss");
    bancoDeDados.depositos.push({ data, numero_conta: contaNumero.numero, valor });

    return res.status(200).json({ mensagem: 'Depósito realizado com sucesso ', depositos: bancoDeDados.depositos })
};


function saque(req, res) {
    const { numero_conta, valor, senha } = req.body;

    const numeroConta = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

    if (!numeroConta) {
        return res.status(404).json({ mensagem: 'Número da conta inexistente' });
    }
    if (senha !== numeroConta.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta' });
    }
    if (valor > numeroConta.saldo) {
        return res.status(400).json({ mensagem: 'Saldo Insuficiente' });
    }

    const data = format(new Date(), "YYY'-'MM'-'dd k':'m':'ss");
    numeroConta.saldo -= valor;
    bancoDeDados.saques.push({ data, numero_conta: numeroConta.numero, valor });
    return res.status(200).json({ mensagem: 'Saque realizado com sucesso', saques: bancoDeDados.saques });
}
function transferir(req, res) {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    const contaOrigem = bancoDeDados.contas.find((conta) => conta.numero === numero_conta_origem);
    const contaDestino = bancoDeDados.contas.find((conta) => conta.numero === numero_conta_destino);


    if (!numero_conta_origem && !numero_conta_destino && !valor && !senha) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos' });
    }

    if (!contaOrigem) {
        return res.status(400).json({ mensagem: 'Conta de origem não existe' });
    }
    if (!contaDestino) {
        return res.status(400).json({ mensagem: 'Conta de destino não existe' });
    }

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha inválida' });
    }
    if (valor > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente' });
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const data = format(new Date(), "YYY'-'MM'-'dd k':'m':'ss");
    bancoDeDados.transferencias.push({ data, numero_conta_origem, numero_conta_destino, valor });

    return res.status(200).json({ mensagem: 'Transferencia realizada com sucesso', transferencias: bancoDeDados.transferencias });

}
function saldo(req, res) {
    const { numero_conta, senha } = req.query


    if (!numero_conta && !senha) {
        return res.status(400).json({ mensagem: 'Informe senha e numero da conta' });
    }

    const numeroConta = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);


    if (!numero_conta && !senha) {
        return res.status(400).json({ mensagem: 'Informe senha e numero da conta' });
    }


    if (!numeroConta) {
        return res.status(400).json({ mensagem: 'Conta não existe' });
    }

    if (senha !== numeroConta.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha inválida' });
    }

    return res.json({ saldo: numeroConta.saldo });
}


function extrato(req, res) {
    const { numero_conta, senha } = req.query;

    const numeroConta = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

    if (!numero_conta && !senha) {
        return res.status(400).json({ mensagem: 'Informe senha e numero da conta' });
    }

    if (!numeroConta) {
        return res.status(404).json({ mensagem: 'Conta não existe' });
    }

    if (senha !== numeroConta.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha inválida' });
    }

    const depositos = bancoDeDados.depositos.filter((deposito) => deposito.numero_conta === numero_conta);

    const saques = bancoDeDados.saques.filter((saque) => saque.numero_conta === numero_conta);

    const enviados = bancoDeDados.transferencias.filter((enviado) => enviado.numero_conta_origem === numero_conta);

    const recebidos = bancoDeDados.transferencias.filter((recebido) => recebido.numero_conta_destino === numero_conta);

    const relatorioConta = { depositos: depositos, saques: saques, transferenciasEnviadas: enviados, transferenciasRecebidas: recebidos };


    return res.status(200).json(relatorioConta);
};

module.exports = {
    listarConta, criarConta, atualizarUsuarioConta, deletarConta, depositar,
    saque, transferir, saldo, extrato
};
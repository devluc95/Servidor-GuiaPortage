const express = require('express');
const cors = require('cors');
const { Usuario, Aluno, sequelize } = require('./bd'); // Ajuste o caminho conforme necessário

const app = express();
const port = 3001; // Ajuste a porta conforme necessário

app.use(cors()); // Habilita CORS
app.use(express.json()); // Faz o parsing do JSON no corpo das requisições

// Rota para obter todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll(); // Busca todos os usuários
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// Rota para obter um usuário por ID
app.get('/usuario/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id); // Busca um usuário pelo ID
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

// Rota para criar um novo usuário
app.post('/usuario/inserir', async (req, res) => {
  try {
    const novoUsuario = await Usuario.create(req.body); // Cria um novo usuário
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao inserir usuário.' });
  }
});

// Rota para atualizar um usuário
app.put('/usuario/atualizar/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id); // Busca um usuário pelo ID
    if (usuario) {
      await usuario.update(req.body); // Atualiza o usuário com os novos dados
      res.json(usuario);
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

// Rota para deletar um usuário
app.delete('/usuario/deletar/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id); // Busca um usuário pelo ID
    if (usuario) {
      await usuario.destroy(); // Deleta o usuário
      res.json({ message: 'Usuário deletado com sucesso.' });
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
});

// Rota para obter todos os alunos
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.findAll(); // Busca todos os alunos
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos.' });
  }
});

// Rota para obter um aluno por ID
app.get('/aluno/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id); // Busca um aluno pelo ID
    if (aluno) {
      res.json(aluno);
    } else {
      res.status(404).send('Aluno não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aluno.' });
  }
});

// Rota para criar um novo aluno
app.post('/aluno/inserir', async (req, res) => {
  try {
    const novoAluno = await Aluno.create(req.body); // Cria um novo aluno
    res.status(201).json(novoAluno);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao inserir aluno.' });
  }
});

// Rota para atualizar um aluno
app.put('/aluno/atualizar/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id); // Busca um aluno pelo ID
    if (aluno) {
      await aluno.update(req.body); // Atualiza o aluno com os novos dados
      res.json(aluno);
    } else {
      res.status(404).send('Aluno não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aluno.' });
  }
});

// Rota para deletar um aluno
app.delete('/aluno/deletar/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id); // Busca um aluno pelo ID
    if (aluno) {
      await aluno.destroy(); // Deleta o aluno
      res.json({ message: 'Aluno deletado com sucesso.' });
    } else {
      res.status(404).send('Aluno não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aluno.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

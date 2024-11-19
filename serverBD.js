// serverBD.js
const express = require('express');
const cors = require('cors');
const { Usuario, Aluno, AreaConhecimento, Pergunta, OpcaoResposta, Resposta, sequelize } = require('./bd'); // Ajuste o caminho conforme necessário

const app = express();
const port = 3002; // Ajuste a porta conforme necessário

app.use(cors()); // Habilita CORS
app.use(express.json()); // Faz o parsing do JSON no corpo das requisições

// Funções auxiliares para evitar repetição de código nas rotas
const handleError = (res, error, message) => res.status(500).json({ error: message || 'Erro interno no servidor.', details: error });

// Usuários
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    handleError(res, error, 'Erro ao buscar usuários.');
  }
});

app.get('/usuario/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    usuario ? res.json(usuario) : res.status(404).send('Usuário não encontrado');
  } catch (error) {
    handleError(res, error, 'Erro ao buscar usuário.');
  }
});

app.post('/usuario/inserir', async (req, res) => {
  const { nome, email, senha } = req.body; // Ajuste os campos conforme necessário
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const novoUsuario = await Usuario.create(req.body);
    res.status(201).json(novoUsuario);
  } catch (error) {
    handleError(res, error, 'Erro ao inserir usuário.');
  }
});

app.put('/usuario/atualizar/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    
    await usuario.update(req.body);
    res.json(usuario);
  } catch (error) {
    handleError(res, error, 'Erro ao atualizar usuário.');
  }
});

app.delete('/usuario/deletar/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    
    await usuario.destroy();
    res.json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    handleError(res, error, 'Erro ao deletar usuário.');
  }
});
// Rota de login
app.post('/usuario/login', async (req, res) => {
  const { email, senha } = req.body; // Ajuste os campos conforme necessário

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Aqui você deve comparar a senha fornecida com a senha armazenada.
    // Por questões de segurança, é recomendado usar bcrypt ou outra biblioteca para hashear senhas.
    if (usuario.senha !== senha) { // Altere isso para a comparação adequada
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // Se tudo estiver correto, retorne os dados do usuário ou um token
    res.json({ message: 'Login bem-sucedido.', usuario });
  } catch (error) {
    handleError(res, error, 'Erro ao fazer login.');
  }
});
// Fim Usuários

// Alunos
/* app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.json(alunos);
  } catch (error) {
    handleError(res, error, 'Erro ao buscar alunos.');
  }
}); */
/* app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.findAll({
      attributes: ['id', 'nome', 'data_nascimento'],
    });

    // Calcula a idade com base na data de nascimento
    const alunosComIdade = alunos.map(aluno => {
      const hoje = new Date();
      const nascimento = new Date(aluno.data_nascimento);
      const idade = hoje.getFullYear() - nascimento.getFullYear();
      const ajusteAniversario = hoje < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate()) ? -1 : 0;
      
      return {
        id: aluno.id,
        nome: aluno.nome,
        idade: idade + ajusteAniversario,
      };
    });

    res.json(alunosComIdade);
  } catch (error) {
    handleError(res, error, 'Erro ao buscar alunos.');
  }
}); */

app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.findAll({
      attributes: ['id', 'nome', 'data_nascimento', 'sexo'], // Inclui o campo 'sexo'
    });

    // Calcula a idade com base na data de nascimento
    const alunosComIdade = alunos.map(aluno => {
      const hoje = new Date();
      const nascimento = new Date(aluno.data_nascimento);
      const idade = hoje.getFullYear() - nascimento.getFullYear();
      const ajusteAniversario = hoje < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate()) ? -1 : 0;

      return {
        id: aluno.id,
        nome: aluno.nome,
        data_nascimento: aluno.data_nascimento, // Retorna a data de nascimento
        sexo: aluno.sexo,                      // Retorna o sexo
        idade: idade + ajusteAniversario,      // Calcula a idade
      };
    });

    res.json(alunosComIdade);
  } catch (error) {
    handleError(res, error, 'Erro ao buscar alunos.');
  }
});

app.get('/alunos/perguntas', async (req, res) => {
  try {
    const alunos = await Aluno.findAll({
      attributes: ['nome', 'data_nascimento'], // Retorna apenas 'nome' e 'data_nascimento'
    });

    // Calcula a idade com base na data de nascimento
    const alunosComIdade = alunos.map(aluno => {
      const idade = aluno.data_nascimento;
      return {
        nome: aluno.nome,
        idade: idade, // Adiciona a idade ao objeto
      };
    });

    res.json(alunosComIdade); // Retorna os alunos com nome e idade
  } catch (error) {
    handleError(res, error, 'Erro ao buscar alunos.');
  }
});

app.get('/aluno/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    aluno ? res.json(aluno) : res.status(404).send('Aluno não encontrado');
  } catch (error) {
    handleError(res, error, 'Erro ao buscar aluno.');
  }
});

app.post('/aluno/inserir', async (req, res) => {
  console.log("Dados recebidos:", req.body); // Log dos dados recebidos
  const {nome, data_nascimento, sexo } = req.body;

  if (!nome || !data_nascimento || !sexo) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: id_usuario, nome, data_nascimento e sexo.' });
  }

  try {
      const novoAluno = await Aluno.create(req.body);
      res.status(201).json(novoAluno);
  } catch (error) {
      console.error('Erro completo:', error); // Log detalhado do erro
      handleError(res, error, 'Erro ao inserir aluno.');
  }
});

app.put('/aluno/atualizar/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).send('Aluno não encontrado');
    
    await aluno.update(req.body);
    res.json(aluno);
  } catch (error) {
    handleError(res, error, 'Erro ao atualizar aluno.');
  }
});

app.delete('/aluno/deletar/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).send('Aluno não encontrado');
    
    await aluno.destroy();
    res.json({ message: 'Aluno deletado com sucesso.' });
  } catch (error) {
    handleError(res, error, 'Erro ao deletar aluno.');
  }
});

// Exemplo de rota no serverBD.js para adicionar um aluno com tratamento de erro
app.post('/api/alunos', async (req, res) => {
  try {
      const { nome, data_nascimento, sexo } = req.body;
      // Validações de dados antes de inserir
      if (!nome || !data_nascimento || !sexo) {
          return res.status(400).json({ error: 'Nome, data de nascimento e sexo são obrigatórios.' });
      }
      const aluno = await Aluno.create({ nome, data_nascimento, sexo });
      res.status(201).json(aluno);
  } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      res.status(500).json({ error: 'Erro ao adicionar aluno.' });
  }
});

// Áreas de Conhecimento
app.get('/areas-conhecimento', async (req, res) => {
  try {
    const areas = await AreaConhecimento.findAll();
    res.json(areas);
  } catch (error) {
    handleError(res, error, 'Erro ao buscar áreas de conhecimento.');
  }
});

// Perguntas
app.get('/perguntas', async (req, res) => {
  try {
    const perguntas = await Pergunta.findAll();
    res.json(perguntas);
  } catch (error) {
    handleError(res, error, 'Erro ao buscar perguntas.');
  }
});
// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const client = require('./bd');
const cors = require('cors');
const port = 3000;
const app = express();


app.use(bodyParser.json());
app.use(express.json());
app.use(cors())


let autenticado = false
let user


app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Consulta no banco de dados para verificar as credenciais
    const userResult = await client.query('SELECT id, email, senha FROM usuario WHERE email = $1 AND senha = $2', [email, senha]);
    user = userResult.rows[0];
    console.log(user[0])

    if (user.email === email && user.senha === senha) {
      autenticado = true

      res.json(true);
    } else {

      res.json(false);
    }
  } catch (error) {
    console.error('Erro ao verificar credenciais:', error);
    res.status(500).json(false);
  }
  console.log(autenticado)
});



// Função para registrar um usuário
app.post('/registrar', async (req, res) => {
  const { email, senha } = req.body;

  try {
    await client.query('INSERT INTO usuario (email, senha) VALUES ($1, $2)', [email, senha]);
    res.json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
  console.log(req.body)
});


// Função para listar as senhas de um usuário
app.get('/senhas', async (req, res) => {
  if (autenticado == true) {
    // Consultar as senhas
    try {
      // Consulta do ID do usuário autenticado no banco de dados
      // const userResult = await client.query('SELECT id FROM usuario WHERE email = $1', [email]);


      const userId = user.id;

      // Consultar todas as senhas do usuário pelo seu ID
      const result = await client.query('SELECT senha, descricao FROM senhas WHERE usuario_id = $1', [userId]);
      const senhas = result.rows;

      res.json({ senhas });
    } catch (error) {
      console.error('Erro ao listar senhas:', error);
      res.status(500).json({ message: 'Erro ao listar senhas' });
    }
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});


// Função para adicionar uma senha
app.post('/adicionarSenha', async (req, res) => {
  const { senha, descricao } = req.body;
  //const autenticado = 'marcelowilker0998@gmail.com' // ainda precisa fazer a autenticação
  console.log(req.body)
  try {
    //  consulta do ID do usuário autenticado no banco de dados
    //const userResult = await client.query('SELECT id FROM usuario WHERE email = $1', [autenticado]); 
    //const user = userResult.rows[0];

    const userId = user.id;

    // Inserir a nova senha na tabela "senhas"
    const result = await client.query('INSERT INTO senhas (usuario_id, senha, descricao) VALUES ($1, $2, $3) RETURNING *', [userId, senha, descricao]);

    res.json({ message: 'Senha adicionada com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar senha:', error);
    res.status(500).json({ message: 'Erro ao adicionar senha' });
  }
});


// Função para atualizar uma senha
app.put('/atualizarSenha/:id', async (req, res) => {
  //const { id } = req.params;
  const { senha, descricao } = req.body;
  const userId = user.id;
  try {
    await client.query('UPDATE senhas SET senha = $1, descricao = $2 WHERE id = $3', [senha, descricao, userId]);
    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ message: 'Erro ao atualizar senha' });
  }
});

// Função para excluir uma senha
app.delete('/excluirSenha/:id', async (req, res) => {
  // const { id } = req.params;
  const userId = user.id;
  try {
    await client.query('DELETE FROM senhas WHERE id = $1', [userId]);
    res.json({ message: 'Senha excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir senha:', error);
    res.status(500).json({ message: 'Erro ao excluir senha' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



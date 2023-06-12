const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const client = require('../bd');
const usuarioRouter = require("./usuario");

let autenticado = false;

const secretKey = 'MinhaChaveTesteAgoraVai'; 

router.post('/adicionar', async (req, res) => {
  const { usuario_acesso, senha, tipo } = req.body;

  try {
    // Verifica o token enviado no cabeçalho da requisição
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;

    // Inserir a nova senha na tabela "senhas" com o ID do usuário autenticado
    const result = await client.query('INSERT INTO senhas (usuario_id, usuario_acesso, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING *', [userId, usuario_acesso, senha, tipo]);

    res.json({ message: 'Senha adicionada com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar senha:', error);
    res.status(500).json({ message: 'Erro ao adicionar senha' });
  }
});



 
router.put('/atualizar', async (req, res) => {
    const { usuario_acesso, senha, tipo } = req.body;
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;
    try {
      await client.query('UPDATE senhas SET senha = $1, tipo = $2, usuario_acesso = $3 WHERE id = $4',  [senha, tipo , usuario_acesso, userId]);
      res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      res.status(500).json({ message: 'Erro ao atualizar senha' });
    }
  });

  module.exports = router;
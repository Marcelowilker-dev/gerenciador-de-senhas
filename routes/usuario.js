const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const client = require('../bd');
let userId;


const secretKey = 'MinhaChaveTesteAgoraVai'; 


router.post('/cadastrar', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const hashedSenha = await bcrypt.hash(senha, 10); // Hash da senha com 10 rounds de salt
    console.log(hashedSenha)
    await client.query('INSERT INTO usuario (email, senha) VALUES ($1, $2)', [email, hashedSenha]);
    res.json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Consulta no banco de dados para verificar as credenciais
    const userResult = await client.query('SELECT id, email, senha FROM usuario WHERE email = $1', [email]);
    const user = userResult.rows[0];
    console.log("retorno do banco")
    console.log(user)
    if (await bcrypt.compare(senha, user.senha)) {
      
      userId = user.id;

      // Gera o token com o ID do usuário
      const token = jwt.sign({ userId }, secretKey);
      
      res.json({ message: 'login realizado com sucesso', token });
      
    } else {
     res.json({ message: 'credenciais invalidas'});
    }
    
  } catch (error) {
    console.error('Erro ao verificar credenciais:', error);
    res.status(500).json(false);
  }
});






router.delete('/excluirSenha', async (req, res) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, secretKey);
  const userId = decodedToken.userId;
  

  try {
    await client.query('DELETE FROM senhas WHERE id = $1', [userId]);
    res.json({ message: 'Senha excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir senha:', error);
    res.status(500).json({ message: 'Erro ao excluir senha' });
  }
});

module.exports = router;

index.js



const express = require('express');
const app = express();
const router = express.Router();
const client = require('../bd');
const usuarioRouter = require("./usuario");
const jwt = require('jsonwebtoken');

app.use(express.json());

app.use('/', router);


function verificarToken(req, res, next) {
 
  const token = req.header('Authorization');

  // Verifique se o token está presente
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Verifique e decodifique o token
    const decoded = jwt.verify(token, 'MinhaChaveTesteAgoraVai'); 

    
    req.userId = decoded.userId;

    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

router.get('/', verificarToken, async (req, res) => {
 

  try {
    // Consultar todas as senhas do usuário pelo seu ID
    const result = await client.query('SELECT usuario_acesso, senha, tipo  FROM senhas WHERE usuario_id = $1', [req.userId]);
    const senhas = result.rows;
    res.json({ senhas });
  } catch (error) {
    console.error('Erro ao listar senhas:', error);
    res.status(500).json({ message: 'Erro ao listar senhas' });
  }
});

module.exports = router;

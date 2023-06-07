const express = require('express');
const app = express();
const router = express.Router();
const client = require('../bd');
const usuarioRouter = require("./usuario");

app.use(express.json());

app.use('/', router);




router.get('/', async (req, res) => {
let autenticado = usuarioRouter.autenticado;
autenticado = true
let userId = usuarioRouter.userId;
    if (autenticado == true) {
      // Consultar as senhas
      try {
    
        // Consultar todas as senhas do usuário pelo seu ID
        const result = await client.query('SELECT usuario_acesso, senha, tipo  FROM senhas WHERE usuario_id = $1', [userId]);
        const senhas = result.rows;
  
        res.json({ senhas });
      } catch (error) {
        console.error('Erro ao listar senhas:', error);
        res.status(500).json({ message: 'Erro ao listar senhas' });
      }
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
      console.log(userId)
    }
  });


  module.exports = router;
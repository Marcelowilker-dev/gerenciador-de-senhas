const express = require('express');
const app = express();
const router = express.Router();
const client = require('../bd');
const usuarioRouter = require("./usuario");
const jwt = require('jsonwebtoken');

app.use(express.json());

app.use('/', router);

// Função de middleware para verificar o token
function verificarToken(req, res, next) {
  // Obtenha o token do cabeçalho da requisição
  const token = req.header('Authorization');

  // Verifique se o token está presente
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Verifique e decodifique o token
    const decoded = jwt.verify(token, 'MinhaChaveTesteAgoraVai'); // Substitua 'chave_secreta' pela sua chave de assinatura

    // Adicione o ID do usuário decodificado ao objeto de solicitação para uso posterior
    req.userId = decoded.userId;

    // Prossiga para a próxima função de middleware ou rota
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

router.get('/', verificarToken, async (req, res) => {
  // Agora você pode acessar o ID do usuário decodificado em req.userId

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

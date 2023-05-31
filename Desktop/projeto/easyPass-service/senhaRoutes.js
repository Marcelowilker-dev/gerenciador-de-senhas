const express = require('express');








const router = express.Router();

// Rota para adicionar uma senha
router.post('/usuario', senhaController.adicionarSenha);

router.post('/', senhaController.register);

// Rota para obter todas as senhas
router.get('/usuario/home', senhaController.obterSenhas);

// Rota para atualizar uma senha
router.put('/atualiza/:id', senhaController.atualizarSenha);

// Rota para excluir uma senha
router.delete('/delete/:id', senhaController.excluirSenha);

module.exports = router;

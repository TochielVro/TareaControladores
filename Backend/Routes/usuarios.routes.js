const express = require('express');
const router = express.Router();
const usuariosController = require('../Controllers/usuarios.controller');

router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuarioById);
router.post('/', usuariosController.createUsuario);
router.post('/login', usuariosController.loginUsuario);
router.put('/:id', usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

module.exports = router;
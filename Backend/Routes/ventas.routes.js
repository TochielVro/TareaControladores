const express = require('express');
const router = express.Router();
const ventasController = require('../Controllers/ventas.controller');

router.get('/', ventasController.getVentas);
router.get('/:id', ventasController.getVentaById);
router.post('/', ventasController.createVenta);

module.exports = router;
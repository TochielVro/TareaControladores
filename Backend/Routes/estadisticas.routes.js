const express = require('express');
const router = express.Router();
const estadisticasController = require('../Controllers/estadisticas.controller');

router.get('/estadisticas', estadisticasController.getEstadisticas);
router.get('/ventas/recientes', estadisticasController.getVentasRecientes);

module.exports = router;
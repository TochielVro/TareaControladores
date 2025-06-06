const VentaModel = require('../Models/ventas.model');

const getVentas = (req, res) => {
  VentaModel.obtenerVentas((err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

const getVentaById = (req, res) => {
  VentaModel.obtenerVentaPorId(req.params.id, (err, venta) => {
    if (err) return res.status(500).json({ error: err });
    if (!venta || venta.length === 0) return res.status(404).json({ mensaje: 'Venta no encontrada' });
    res.json(venta);
  });
};

const createVenta = (req, res) => {
  VentaModel.crearVenta(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ mensaje: 'Venta creada', id: result.venta_id });
  });
};

module.exports = {
  getVentas,
  getVentaById,
  createVenta
};
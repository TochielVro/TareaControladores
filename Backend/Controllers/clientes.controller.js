const ClienteModel = require('../Models/clientes.model');

const getClientes = (req, res) => {
  ClienteModel.obtenerClientes((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const getClienteById = (req, res) => {
  ClienteModel.obtenerClientePorId(req.params.id, (err, cliente) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  });
};

const createCliente = (req, res) => {
  const { nombre, documento_identidad, direccion, telefono } = req.body;
  
  if (!nombre || !documento_identidad) {
    return res.status(400).json({ error: 'Nombre y documento_identidad son obligatorios' });
  }

  ClienteModel.crearCliente(req.body, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El documento de identidad ya existe' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ mensaje: 'Cliente creado', id: result.id });
  });
};

const updateCliente = (req, res) => {
  ClienteModel.actualizarCliente(req.params.id, req.body, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El documento de identidad ya existe' });
      }
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente actualizado' });
  });
};

const deleteCliente = (req, res) => {
  ClienteModel.eliminarCliente(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado' });
  });
};

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};
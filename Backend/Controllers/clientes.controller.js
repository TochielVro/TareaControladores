const ClienteModel = require('../Models/clientes.model');

const getClientes = async (req, res) => {
  try {
    const clientes = await ClienteModel.obtenerClientes();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getClienteById = async (req, res) => {
  try {
    const cliente = await ClienteModel.obtenerClientePorId(req.params.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCliente = async (req, res) => {
  const { nombre, documento_identidad, direccion, telefono } = req.body;
  
  if (!nombre || !documento_identidad) {
    return res.status(400).json({ error: 'Nombre y documento_identidad son obligatorios' });
  }

  try {
    const result = await ClienteModel.crearCliente(req.body);
    res.status(201).json({ mensaje: 'Cliente creado', id: result.id });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El documento de identidad ya existe' });
    }
    res.status(500).json({ error: err.message });
  }
};

const updateCliente = async (req, res) => {
  try {
    const result = await ClienteModel.actualizarCliente(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente actualizado' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El documento de identidad ya existe' });
    }
    res.status(500).json({ error: err.message });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const result = await ClienteModel.eliminarCliente(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};
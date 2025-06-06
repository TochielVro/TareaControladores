const ClienteModel = require('../Models/clientes.model');
const getClientes = (req, res) => {
ClienteModel.obtenerClientes((err, rows) => {
if (err) return res.status(500).json({ error: err });
res.json(rows);
});
};
const getClienteById = (req, res) => {

ClienteModel.obtenerClientePorId(req.params.id, (err, rows) => {
if (err) return res.status(500).json({ error: err });
if (rows.length === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
res.json(rows[0]);
});
};
const createCliente = (req, res) => {
ClienteModel.crearCliente(req.body, (err, result) => {
if (err) return res.status(500).json({ error: err });
res.status(201).json({ mensaje: 'Cliente creado', id: result.insertId });
});
};
const updateCliente = (req, res) => {
ClienteModel.actualizarCliente(req.params.id, req.body, (err, result) => {
if (err) return res.status(500).json({ error: err });
res.json({ mensaje: 'Cliente actualizado' });
});
};
const deleteCliente = (req, res) => {
ClienteModel.eliminarCliente(req.params.id, (err, result) => {
if (err) return res.status(500).json({ error: err });
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
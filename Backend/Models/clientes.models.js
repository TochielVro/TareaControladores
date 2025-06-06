const db = require('../Database/connection');
// Obtener todos los clientes
const obtenerClientes = (callback) => {
db.query('SELECT * FROM clientes', callback);
};
// Obtener un cliente por ID
const obtenerClientePorId = (id, callback) => {
db.query('SELECT * FROM clientes WHERE id = ?', [id], callback);
};
// Crear un nuevo cliente
const crearCliente = (datos, callback) => {
const { nombre, correo, telefono } = datos;
db.query(
'INSERT INTO clientes (nombre, correo, telefono) VALUES (?, ?, ?)',
[nombre, correo, telefono],
callback
);
};
// Actualizar cliente
const actualizarCliente = (id, datos, callback) => {
const { nombre, correo, telefono } = datos;
db.query(
'UPDATE clientes SET nombre = ?, correo = ?, telefono = ? WHERE id = ?',
[nombre, correo, telefono, id],
callback
);
};
// Eliminar cliente
const eliminarCliente = (id, callback) => {
db.query('DELETE FROM clientes WHERE id = ?', [id], callback);
};
module.exports = {
obtenerClientes,
obtenerClientePorId,
crearCliente,
actualizarCliente,
eliminarCliente,
};
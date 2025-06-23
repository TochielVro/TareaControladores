const db = require('../Database/connection');

// Obtener todos los clientes (versión con callbacks)
const obtenerClientes = (callback) => {
  db.query('SELECT * FROM clientes', callback);
};

// Obtener un cliente por ID (versión con callbacks)
const obtenerClientePorId = (id, callback) => {
  db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows[0] || null);
  });
};

// Crear un nuevo cliente (versión con callbacks)
const crearCliente = (datos, callback) => {
  const { nombre, documento_identidad, direccion, telefono } = datos;
  db.query(
    'INSERT INTO clientes (nombre, documento_identidad, direccion, telefono) VALUES (?, ?, ?, ?)',
    [nombre, documento_identidad, direccion, telefono],
    (err, result) => {
      if (err) return callback(err);
      callback(null, { id: result.insertId });
    }
  );
};

// Actualizar cliente (versión con callbacks)
const actualizarCliente = (id, datos, callback) => {
  const { nombre, documento_identidad, direccion, telefono } = datos;
  db.query(
    'UPDATE clientes SET nombre = ?, documento_identidad = ?, direccion = ?, telefono = ? WHERE id = ?',
    [nombre, documento_identidad, direccion, telefono, id],
    (err, result) => {
      if (err) return callback(err);
      callback(null, { affectedRows: result.affectedRows });
    }
  );
};

// Eliminar cliente (versión con callbacks)
const eliminarCliente = (id, callback) => {
  db.query('DELETE FROM clientes WHERE id = ?', [id], (err, result) => {
    if (err) return callback(err);
    callback(null, { affectedRows: result.affectedRows });
  });
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
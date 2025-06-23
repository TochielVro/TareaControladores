const db = require('../Database/connection');

// Obtener todos los clientes (versión con promesas)
const obtenerClientes = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM clientes', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

// Obtener un cliente por ID (versión con promesas)
const obtenerClientePorId = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, rows) => {
      if (err) reject(err);
      resolve(rows[0] || null);
    });
  });
};

// Crear un nuevo cliente (versión con promesas)
const crearCliente = (datos) => {
  const { nombre, documento_identidad, direccion, telefono } = datos;
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO clientes (nombre, documento_identidad, direccion, telefono) VALUES (?, ?, ?, ?)',
      [nombre, documento_identidad, direccion, telefono],
      (err, result) => {
        if (err) reject(err);
        resolve({ id: result.insertId });
      }
    );
  });
};

// Actualizar cliente (versión con promesas)
const actualizarCliente = (id, datos) => {
  const { nombre, documento_identidad, direccion, telefono } = datos;
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE clientes SET nombre = ?, documento_identidad = ?, direccion = ?, telefono = ? WHERE id = ?',
      [nombre, documento_identidad, direccion, telefono, id],
      (err, result) => {
        if (err) reject(err);
        resolve({ affectedRows: result.affectedRows });
      }
    );
  });
};

// Eliminar cliente (versión con promesas)
const eliminarCliente = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM clientes WHERE id = ?', [id], (err, result) => {
      if (err) reject(err);
      resolve({ affectedRows: result.affectedRows });
    });
  });
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
const db = require('../Database/connection');

// Obtener todos los productos
const obtenerProductos = (callback) => {
  db.query('SELECT * FROM productos', callback);
};

// Obtener un producto por ID
const obtenerProductoPorId = (id, callback) => {
  db.query('SELECT * FROM productos WHERE id = ?', [id], callback);
};

// Crear un nuevo producto
const crearProducto = (datos, callback) => {
  const { nombre, precio, stock } = datos;
  db.query(
    'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
    [nombre, precio, stock],
    callback
  );
};

// Actualizar producto
const actualizarProducto = (id, datos, callback) => {
  const { nombre, precio, stock } = datos;
  db.query(
    'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
    [nombre, precio, stock, id],
    callback
  );
};

// Eliminar producto
const eliminarProducto = (id, callback) => {
  db.query('DELETE FROM productos WHERE id = ?', [id], callback);
};

// Actualizar stock
const actualizarStock = (id, cantidad, callback) => {
  db.query(
    'UPDATE productos SET stock = stock - ? WHERE id = ?',
    [cantidad, id],
    callback
  );
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStock
};
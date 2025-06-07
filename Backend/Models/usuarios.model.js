const db = require('../Database/connection');

// Obtener todos los usuarios
const obtenerUsuarios = (callback) => {
  db.query('SELECT id, nombre, email FROM usuarios', callback);
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = (id, callback) => {
  db.query('SELECT id, nombre, email FROM usuarios WHERE id = ?', [id], callback);
};

// Crear un nuevo usuario (con hash de contraseña)
const crearUsuario = (datos, callback) => {
  const { nombre, email, password } = datos;
  db.query(
    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
    [nombre, email, password],
    callback
  );
};

// Actualizar usuario
const actualizarUsuario = (id, datos, callback) => {
  const { nombre, email } = datos;
  db.query(
    'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
    [nombre, email, id],
    callback
  );
};

// Eliminar usuario
const eliminarUsuario = (id, callback) => {
  db.query('DELETE FROM usuarios WHERE id = ?', [id], callback);
};

// Autenticar usuario (login)
const autenticarUsuario = (email, password, callback) => {
  db.query(
    'SELECT id, nombre, email FROM usuarios WHERE email = ? AND password = ?',
    [email, password],
    callback
  );
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  autenticarUsuario
};
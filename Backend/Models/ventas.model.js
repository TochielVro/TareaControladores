const db = require('../Database/connection');

// Crear una nueva venta
const crearVenta = (datos, callback) => {
  const { cliente_id, usuario_id, total, detalles } = datos;
  
  // Iniciar transacción
  db.beginTransaction(err => {
    if (err) return callback(err);
    
    // 1. Insertar la venta principal
    db.query(
      'INSERT INTO ventas (cliente_id, usuario_id, total) VALUES (?, ?, ?)',
      [cliente_id, usuario_id, total],
      (err, result) => {
        if (err) return db.rollback(() => callback(err));
        
        const venta_id = result.insertId;
        const detallesValues = detalles.map(detalle => [
          venta_id,
          detalle.producto_id,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.subtotal
        ]);
        
        // 2. Insertar los detalles de la venta
        db.query(
          'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ?',
          [detallesValues],
          (err, result) => {
            if (err) return db.rollback(() => callback(err));
            
            // 3. Actualizar el stock de cada producto
            const updatePromises = detalles.map(detalle => {
              return new Promise((resolve, reject) => {
                db.query(
                  'UPDATE productos SET stock = stock - ? WHERE id = ?',
                  [detalle.cantidad, detalle.producto_id],
                  (err, result) => {
                    if (err) reject(err);
                    else resolve();
                  }
                );
              });
            });
            
            Promise.all(updatePromises)
              .then(() => {
                db.commit(err => {
                  if (err) return db.rollback(() => callback(err));
                  callback(null, { venta_id, detalles: result });
                });
              })
              .catch(err => db.rollback(() => callback(err)));
          }
        );
      }
    );
  });
};

// Obtener todas las ventas
const obtenerVentas = (callback) => {
  db.query(`
    SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre 
    FROM ventas v
    JOIN clientes c ON v.cliente_id = c.id
    JOIN usuarios u ON v.usuario_id = u.id
    ORDER BY v.fecha DESC
  `, callback);
};

// Obtener una venta por ID con sus detalles
const obtenerVentaPorId = (id, callback) => {
  db.query(`
    SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre 
    FROM ventas v
    JOIN clientes c ON v.cliente_id = c.id
    JOIN usuarios u ON v.usuario_id = u.id
    WHERE v.id = ?
  `, [id], (err, venta) => {
    if (err) return callback(err);
    if (venta.length === 0) return callback(null, []);
    
    db.query(`
      SELECT dv.*, p.nombre as producto_nombre 
      FROM detalle_ventas dv
      JOIN productos p ON dv.producto_id = p.id
      WHERE dv.venta_id = ?
    `, [id], (err, detalles) => {
      if (err) return callback(err);
      
      const resultado = {
        ...venta[0],
        detalles: detalles
      };
      
      callback(null, resultado);
    });
  });
};

module.exports = {
  crearVenta,
  obtenerVentas,
  obtenerVentaPorId
};
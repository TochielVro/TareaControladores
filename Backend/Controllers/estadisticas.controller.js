const db = require('../Database/connection');

const getEstadisticas = async (req, res) => {
  try {
    // Total clientes
    const [clientes] = await db.query('SELECT COUNT(*) as total FROM clientes');
    
    // Total productos
    const [productos] = await db.query('SELECT COUNT(*) as total FROM productos');
    
    // Ventas hoy
    const [ventasHoy] = await db.query(`
      SELECT COUNT(*) as total 
      FROM ventas 
      WHERE DATE(fecha) = CURDATE()
    `);
    
    // Ingresos mes actual
    const [ingresosMes] = await db.query(`
      SELECT COALESCE(SUM(total), 0) as total 
      FROM ventas 
      WHERE MONTH(fecha) = MONTH(CURDATE()) 
      AND YEAR(fecha) = YEAR(CURDATE())
    `);

    res.json({
      totalClientes: clientes[0].total,
      totalProductos: productos[0].total,
      ventasHoy: ventasHoy[0].total,
      ingresosMes: ingresosMes[0].total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVentasRecientes = async (req, res) => {
  try {
    const [ventas] = await db.query(`
      SELECT v.id, c.nombre as cliente_nombre, v.fecha, v.total 
      FROM ventas v
      JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.fecha DESC
      LIMIT 5
    `);
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEstadisticas,
  getVentasRecientes
};
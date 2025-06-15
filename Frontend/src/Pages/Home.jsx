import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function Home() {
  // Datos de ejemplo (en una aplicación real estos vendrían de una API)
  const stats = [
    { title: 'Clientes', value: 124, icon: '👥', color: 'primary' },
    { title: 'Productos', value: 56, icon: '📦', color: 'success' },
    { title: 'Ventas Hoy', value: 18, icon: '💰', color: 'info' },
    { title: 'Ingresos Mes', value: '$12,450', icon: '💵', color: 'warning' }
  ];

  const recentSales = [
    { id: 1, cliente: 'Juan Pérez', total: '$125.50', fecha: '2023-05-15' },
    { id: 2, cliente: 'María Gómez', total: '$89.99', fecha: '2023-05-15' },
    { id: 3, cliente: 'Carlos Ruiz', total: '$210.00', fecha: '2023-05-14' }
  ];

  return (
    <div className="home-page">
      <h2 className="mb-4">Resumen del Sistema</h2>
      
      {/* Estadísticas */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col md={3} key={index}>
            <Card bg={stat.color} text="white" className="mb-4">
              <Card.Body className="text-center">
                <h1 className="display-4">{stat.icon}</h1>
                <Card.Title>{stat.title}</Card.Title>
                <Card.Text className="display-6">{stat.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Últimas ventas */}
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header as="h5">Últimas Ventas</Card.Header>
            <Card.Body>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.id}</td>
                      <td>{sale.cliente}</td>
                      <td>{sale.total}</td>
                      <td>{sale.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>

        {/* Acciones rápidas */}
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Acciones Rápidas</Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <a href="/clientes" className="btn btn-primary btn-lg mb-2">
                  Gestionar Clientes
                </a>
                <a href="/productos" className="btn btn-success btn-lg mb-2">
                  Gestionar Productos
                </a>
                <a href="/ventas" className="btn btn-info btn-lg">
                  Registrar Nueva Venta
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';

function Ventas() {
  // Estados del componente
  const [clientes, setClientes] = useState([]);      // Lista de clientes
  const [productos, setProductos] = useState([]);    // Lista de productos
  const [clienteId, setClienteId] = useState('');    // ID del cliente seleccionado
  const [carrito, setCarrito] = useState([]);        // Lista de productos en el carrito
  const [alert, setAlert] = useState(null);          // Mensajes de éxito o error

  // useEffect: cargar clientes y productos al inicio
  useEffect(() => {
    fetch('http://localhost:3001/api/clientes')
      .then(res => res.json())
      .then(setClientes);

    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(setProductos);
  }, []);

  // Agrega un producto al carrito o aumenta su cantidad si ya está
  const agregarProducto = (producto) => {
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
      setCarrito(carrito.map(p =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Calcula el total del carrito
  const calcularTotal = () =>
    carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0).toFixed(2);

  // Función para confirmar la venta
  const confirmarVenta = async () => {
    // Validar que haya cliente y productos seleccionados
    if (!clienteId || carrito.length === 0) {
      setAlert({ type: 'danger', message: 'Selecciona cliente y productos' });
      return;
    }

    // Formatear los productos para el backend
    const detalles = carrito.map(p => ({
      producto_id: p.id,
      cantidad: p.cantidad,
      precio_unitario: p.precio,
      subtotal: (p.precio * p.cantidad)
    }));

    // Crear objeto de venta
    const venta = {
      cliente_id: parseInt(clienteId),
      usuario_id: 1, // ID del usuario que registra (puedes extraerlo de localStorage)
      total: detalles.reduce((acc, d) => acc + d.subtotal, 0),
      detalles,
    };

    try {
      // Enviar venta al backend
      await fetch('http://localhost:3001/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venta)
      });

      // Mostrar mensaje de éxito y limpiar formulario
      setAlert({ type: 'success', message: 'Venta registrada correctamente' });
      setClienteId('');
      setCarrito([]);
    } catch {
      // Mostrar mensaje de error
      setAlert({ type: 'danger', message: 'Error al registrar venta' });
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Registrar Nueva Venta</h2>

      {/* Alerta de éxito o error */}
      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Selector de cliente */}
      <Form.Group className="mb-3">
        <Form.Label>Cliente</Form.Label>
        <Form.Select value={clienteId} onChange={e => setClienteId(e.target.value)} required>
          <option value="">Selecciona un cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Botones de productos */}
      <Form.Group className="mb-3">
        <Form.Label>Productos</Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {productos.map(p => (
            <Button
              key={p.id}
              variant="outline-primary"
              onClick={() => agregarProducto(p)}
            >
              {p.nombre} - ${p.precio}
            </Button>
          ))}
        </div>
      </Form.Group>

      {/* Tabla del carrito */}
      <h5 className="mt-4">Carrito</h5>
      <Table bordered>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.cantidad}</td>
              <td>${p.precio}</td>
              <td>${(p.precio * p.cantidad).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Total y botón de confirmar */}
      <div className="d-flex justify-content-between align-items-center">
        <h5>Total: ${calcularTotal()}</h5>
        <Button variant="success" onClick={confirmarVenta}>Confirmar Venta</Button>
      </div>
    </div>
  );
}

export default Ventas;

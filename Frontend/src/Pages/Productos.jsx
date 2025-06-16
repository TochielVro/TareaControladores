import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';

function Productos() {
  // Estados del componente
  const [productos, setProductos] = useState([]); // Lista de productos
  const [showModal, setShowModal] = useState(false); // Mostrar/ocultar modal
  const [formData, setFormData] = useState({ nombre: '', precio: '', stock: '' }); // Formulario
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [editMode, setEditMode] = useState(false); // Modo edición
  const [currentId, setCurrentId] = useState(null); // ID del producto a editar
  const [alert, setAlert] = useState(null); // Alerta de éxito o error

  // Se ejecuta al cargar el componente (componentDidMount)
  useEffect(() => {
    cargarProductos();
  }, []);

  // Función para obtener productos desde el backend
  const cargarProductos = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Error al cargar productos' });
    }
  };

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Crear o actualizar un producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode
      ? `http://localhost:3001/api/productos/${currentId}`
      : 'http://localhost:3001/api/productos';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setAlert({ type: 'success', message: editMode ? 'Producto actualizado' : 'Producto creado' });
      cargarProductos(); // Recargar lista después de guardar
      handleClose();     // Cerrar el modal
    } catch {
      setAlert({ type: 'danger', message: 'Error al guardar' });
    } finally {
      setIsLoading(false);
    }
  };

  // Preparar formulario para editar un producto
  const handleEdit = (producto) => {
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock
    });
    setCurrentId(producto.id);
    setEditMode(true);
    setShowModal(true);
  };

  // Eliminar un producto
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await fetch(`http://localhost:3001/api/productos/${id}`, { method: 'DELETE' });
      setAlert({ type: 'success', message: 'Producto eliminado' });
      cargarProductos();
    } catch {
      setAlert({ type: 'danger', message: 'Error al eliminar' });
    }
  };

  // Cerrar el modal y resetear el formulario
  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setFormData({ nombre: '', precio: '', stock: '' });
    setCurrentId(null);
  };

  return (
    <div className="container py-4">
      {/* Encabezado y botón para agregar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Productos</h2>
        <Button onClick={() => setShowModal(true)}>＋ Nuevo Producto</Button>
      </div>

      {/* Mostrar alerta */}
      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Tabla de productos */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(p)}>✏️</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>🗑️</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para crear/editar producto */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name="precio" value={formData.precio} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} required />
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={handleClose}>Cancelar</Button>{' '}
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Productos;

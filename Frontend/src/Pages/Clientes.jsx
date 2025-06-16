import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert, Spinner, Badge } from 'react-bootstrap';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    documento_identidad: '',
    direccion: '',
    telefono: ''
  });

  // Cargar clientes al iniciar
  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/clientes');
        if (!response.ok) throw new Error("Error al cargar clientes");
        const data = await response.json();
        setClientes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientes();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar datos (POST/PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const url = editMode 
        ? `http://localhost:3001/api/clientes/${currentCliente.id}`
        : 'http://localhost:3001/api/clientes';
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al guardar");

      // Recargar lista
      const updatedResponse = await fetch('http://localhost:3001/api/clientes');
      const updatedData = await updatedResponse.json();
      setClientes(updatedData);
      
      setSuccess(editMode ? '✅ Cliente actualizado' : '✅ Cliente creado');
      handleCloseModal();
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Editar cliente
  const handleEdit = (cliente) => {
    setCurrentCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      documento_identidad: cliente.documento_identidad,
      direccion: cliente.direccion,
      telefono: cliente.telefono
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Eliminar cliente
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/clientes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error("Error al eliminar");
      
      setClientes(clientes.filter(cliente => cliente.id !== id));
      setSuccess('✅ Cliente eliminado');
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  // Cerrar modal y resetear
  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentCliente(null);
    setFormData({
      nombre: '',
      documento_identidad: '',
      direccion: '',
      telefono: ''
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Clientes <Badge bg="secondary">{clientes.length}</Badge></h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          ＋ Nuevo Cliente
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Cargando clientes...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.documento_identidad}</td>
                  <td>{cliente.direccion || '-'}</td>
                  <td>{cliente.telefono || '-'}</td>
                  <td>
                    <Button variant="outline-warning" size="sm" onClick={() => handleEdit(cliente)}>
                      ✏️ Editar
                    </Button>{' '}
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cliente.id)}>
                      🗑 Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay clientes registrados</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal para agregar/editar */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Cliente' : 'Nuevo Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Documento *</Form.Label>
              <Form.Control
                type="text"
                name="documento_identidad"
                value={formData.documento_identidad}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Clientes;
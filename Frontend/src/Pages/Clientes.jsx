// Implementar la interfaz de usuario para la gestión de clientes
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios'; // Asumiendo que tienes axios instalado

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // Cargar clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        // Reemplaza con tu endpoint real
        const response = await axios.get('https://api.example.com/clientes');
        setClientes(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar clientes');
        setIsLoading(false);
      }
    };
    
    fetchClientes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editMode) {
        // Actualizar cliente existente
        await axios.put(`https://api.example.com/clientes/${currentCliente.id}`, formData);
        setSuccess('Cliente actualizado correctamente');
      } else {
        // Crear nuevo cliente
        await axios.post('https://api.example.com/clientes', formData);
        setSuccess('Cliente creado correctamente');
      }
      
      // Refrescar lista
      const response = await axios.get('https://api.example.com/clientes');
      setClientes(response.data);
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await axios.delete(`https://api.example.com/clientes/${id}`);
        setClientes(clientes.filter(cliente => cliente.id !== id));
        setSuccess('Cliente eliminado correctamente');
      } catch (err) {
        setError('Error al eliminar el cliente');
      }
    }
  };

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
        <h2>
          Clientes 
          <Badge bg="secondary" className="ms-2">{clientes.length}</Badge>
        </h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Cliente
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {isLoading && !showModal ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="shadow-sm">
            <thead className="table-dark">
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
                clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.documento_identidad}</td>
                    <td>{cliente.direccion || '-'}</td>
                    <td>{cliente.telefono || '-'}</td>
                    <td>
                      <Button 
                        variant="outline-warning" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(cliente)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(cliente.id)}
                      >
                        <i className="bi bi-trash"></i>
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
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Cliente' : 'Nuevo Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el nombre completo"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Documento de Identidad <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="documento_identidad"
                value={formData.documento_identidad}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el documento"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Ingrese la dirección"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Ingrese el teléfono"
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" role="status" />
                    <span className="ms-2">Guardando...</span>
                  </>
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Clientes;
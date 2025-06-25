import React, { useEffect, useState } from 'react';
import { 
  getProductos, 
  createProducto, 
  updateProducto, 
  deleteProducto 
} from '../Services/productoService';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    precio: '', 
    stock: '' 
  });
  const [editando, setEditando] = useState(false);
  const [productoId, setProductoId] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    getProductos()
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error cargando productos:', err));
  };

  const handleChange = e => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (editando) {
      updateProducto(productoId, formData)
        .then(() => {
          cargarProductos();
          resetForm();
        })
        .catch(err => console.error('Error actualizando producto:', err));
    } else {
      createProducto(formData)
        .then(() => {
          cargarProductos();
          resetForm();
        })
        .catch(err => console.error('Error creando producto:', err));
    }
  };

  const handleEdit = producto => {
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock
    });
    setEditando(true);
    setProductoId(producto.id);
  };

  const handleDelete = id => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProducto(id)
        .then(() => cargarProductos())
        .catch(err => console.error('Error eliminando producto:', err));
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', precio: '', stock: '' });
    setEditando(false);
    setProductoId(null);
  };

  return (
    <div className="container mt-4">
      <h3>Productos</h3>
      
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Precio"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            min="0"
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            {editando ? 'Actualizar' : 'Agregar'}
          </button>
        </div>
        {editando && (
          <div className="col-md-2">
            <button 
              type="button" 
              className="btn btn-secondary w-100"
              onClick={resetForm}
            >
              Cancelar
            </button>
          </div>
        )}
      </form>

      <table className="table table-striped">
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
              <td>${parseFloat(p.precio).toFixed(2)}</td>
              <td>{p.stock}</td>
              <td>
                <button 
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(p)}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
import React, { useEffect, useState } from 'react';
import { getVentas, getVentaById, createVenta } from '../Services/ventaService';
import { getClientes } from '../Services/clienteService';
import { getProductos } from '../Services/productoService';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [formData, setFormData] = useState({
    cliente_id: '',
    usuario_id: 1,
    total: 0,
    detalles: []
  });

  const [selectedProduct, setSelectedProduct] = useState({
    producto_id: '',
    cantidad: 1,
    precio_unitario: 0,
    subtotal: 0
  });

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = () => {
    getVentas().then(res => setVentas(res.data)).catch(err => console.error('Error cargando ventas:', err));
    getClientes().then(res => setClientes(res.data)).catch(err => console.error('Error cargando clientes:', err));
    getProductos().then(res => setProductos(res.data.filter(p => p.stock > 0))).catch(err => console.error('Error cargando productos:', err));
  };

  const handleClienteChange = e => {
    setFormData({ ...formData, cliente_id: e.target.value });
  };

  const handleProductoChange = e => {
    const productoId = e.target.value;
    const producto = productos.find(p => p.id === parseInt(productoId));

    const precio = producto ? Number(producto.precio) : 0;
    const cantidad = selectedProduct.cantidad;

    setSelectedProduct({
      producto_id: productoId,
      cantidad: cantidad,
      precio_unitario: precio,
      subtotal: cantidad * precio
    });
  };

  const handleCantidadChange = e => {
    const cantidad = parseInt(e.target.value) || 0;
    const precio = Number(selectedProduct.precio_unitario);

    setSelectedProduct({
      ...selectedProduct,
      cantidad: cantidad,
      subtotal: cantidad * precio
    });
  };

  const agregarDetalle = () => {
    if (!selectedProduct.producto_id || selectedProduct.cantidad <= 0) return;

    const producto = productos.find(p => p.id === parseInt(selectedProduct.producto_id));
    if (!producto) return;

    if (selectedProduct.cantidad > producto.stock) {
      alert('No hay suficiente stock disponible');
      return;
    }

    const nuevoDetalle = {
      producto_id: selectedProduct.producto_id,
      cantidad: selectedProduct.cantidad,
      precio_unitario: Number(selectedProduct.precio_unitario),
      subtotal: Number(selectedProduct.subtotal),
      producto_nombre: producto.nombre
    };

    const nuevosDetalles = [...detalles, nuevoDetalle];
    const nuevoTotal = formData.total + nuevoDetalle.subtotal;

    setDetalles(nuevosDetalles);
    setFormData({
      ...formData,
      total: nuevoTotal,
      detalles: nuevosDetalles.map(d => ({
        producto_id: d.producto_id,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal
      }))
    });

    setSelectedProduct({
      producto_id: '',
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0
    });
  };

  const eliminarDetalle = (index) => {
    const detalleEliminado = detalles[index];
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    const nuevoTotal = formData.total - detalleEliminado.subtotal;

    setDetalles(nuevosDetalles);
    setFormData({
      ...formData,
      total: nuevoTotal,
      detalles: nuevosDetalles.map(d => ({
        producto_id: d.producto_id,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal
      }))
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.cliente_id || formData.detalles.length === 0) {
      alert('Seleccione un cliente y agregue al menos un producto');
      return;
    }

    createVenta(formData)
      .then(res => {
        alert(`Venta creada con ID: ${res.data.id}`);
        cargarDatosIniciales();
        setFormData({ cliente_id: '', usuario_id: 1, total: 0, detalles: [] });
        setDetalles([]);
      })
      .catch(err => {
        console.error('Error creando venta:', err);
        alert('Error al crear la venta');
      });
  };

  return (
    <div className="container mt-4">
      <h3>Registro de Ventas</h3>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Nueva Venta</h5>

          <div className="mb-3">
            <label className="form-label">Cliente</label>
            <select
              className="form-select"
              value={formData.cliente_id}
              onChange={handleClienteChange}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} - {cliente.documento_identidad}
                </option>
              ))}
            </select>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-5">
              <label className="form-label">Producto</label>
              <select
                className="form-select"
                value={selectedProduct.producto_id}
                onChange={handleProductoChange}
              >
                <option value="">Seleccione un producto</option>
                {productos.map(producto => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - Stock: {producto.stock} - ${Number(producto.precio).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={selectedProduct.cantidad}
                onChange={handleCantidadChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Precio Unitario</label>
              <input
                type="text"
                className="form-control"
                value={`$${Number(selectedProduct.precio_unitario).toFixed(2)}`}
                readOnly
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Subtotal</label>
              <input
                type="text"
                className="form-control"
                value={`$${Number(selectedProduct.subtotal).toFixed(2)}`}
                readOnly
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={agregarDetalle}
            disabled={!selectedProduct.producto_id}
          >
            Agregar Producto
          </button>
        </div>
      </div>

      {detalles.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Detalle de Venta</h5>

            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.producto_nombre}</td>
                    <td>{detalle.cantidad}</td>
                    <td>${Number(detalle.precio_unitario).toFixed(2)}</td>
                    <td>${Number(detalle.subtotal).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarDetalle(index)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                  <td><strong>${Number(formData.total).toFixed(2)}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmit}
            >
              Registrar Venta
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Historial de Ventas</h5>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(venta => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{new Date(venta.fecha).toLocaleString()}</td>
                  <td>{venta.cliente_nombre}</td>
                  <td>${Number(venta.total).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => {
                        getVentaById(venta.id)
                          .then(res => {
                            alert(`Detalles de la venta:\n${JSON.stringify(res.data, null, 2)}`);
                          })
                          .catch(err => console.error('Error obteniendo venta:', err));
                      }}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ventas;

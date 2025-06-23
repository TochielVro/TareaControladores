import React, { useEffect, useState } from 'react';
import { getClientes, createCliente, updateCliente, deleteCliente
} from '../Services/clienteService';
const Clientes = () => {
const [clientes, setClientes] = useState([]);
const [formData, setFormData] = useState({ nombre: '',
documento_identidad: '', direccion: '', telefono: '' });
const [editando, setEditando] = useState(false);
const [clienteId, setClienteId] = useState(null);
useEffect(() => {
cargarClientes();
}, []);
const cargarClientes = () => {
getClientes().then(res => setClientes(res.data));
};
const handleChange = e => {
setFormData({ ...formData, [e.target.name]: e.target.value
});
};
const handleSubmit = e => {
e.preventDefault();
if (editando) {
updateCliente(clienteId, formData).then(() => {
cargarClientes();
resetForm();
});
} else {
createCliente(formData).then(() => {
cargarClientes();
resetForm();
});
}
};
const handleEdit = cliente => {
  setFormData({
nombre: cliente.nombre,
documento_identidad: cliente.documento_identidad,
direccion: cliente.direccion,
telefono: cliente.telefono
});
setEditando(true);
setClienteId(cliente.id);
};
const handleDelete = id => {
deleteCliente(id).then(() => cargarClientes());
};
const resetForm = () => {
setFormData({ nombre: '', documento_identidad: '', direccion:
'', telefono: '' });
setEditando(false);
setClienteId(null);
};
return (
<div className="container mt-4">
<h3>Clientes</h3>
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
<div className="col-md-3">
<input
type="text"
className="form-control"
name="documento_identidad"
value={formData.documento_identidad}
onChange={handleChange}
placeholder="Documento de Identidad"
required
/>
</div>
<div className="col-md-3">
<input
type="text"
className="form-control"
name="direccion"
value={formData.direccion}
onChange={handleChange}
placeholder="Dirección"
required
/>
</div>
<div className="col-md-2">
<input
type="text"
className="form-control"
name="telefono"
value={formData.telefono}
onChange={handleChange}
placeholder="Teléfono"
required
/>
</div>
<div className="col-md-1">
<button type="submit" className="btn btn-primary

w-100">

{editando ? 'Actualizar' : 'Agregar'}
</button>
</div>
</form>
<table className="table table-striped">
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
{clientes.map(c => (
<tr key={c.id}>
<td>{c.id}</td>
<td>{c.nombre}</td>
<td>{c.documento_identidad}</td>
<td>{c.direccion}</td>
<td>{c.telefono}</td>
<td>
<button className="btn btn-warning btn-sm me-2"

onClick={() => handleEdit(c)}>Editar</button>

<button className="btn btn-danger btn-sm"
onClick={() => handleDelete(c.id)}>Eliminar</button>

</td>
</tr>
))}
</tbody>
</table>
</div>
);
};
export default Clientes;
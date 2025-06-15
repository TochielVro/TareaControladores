import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
      <h4 className="text-center mb-4">Menú</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link text-white">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/clientes" className="nav-link text-white">Clientes</Link>
        </li>
        <li className="nav-item">
          <Link to="/productos" className="nav-link text-white">Productos</Link>
        </li>
        <li className="nav-item">
          <Link to="/ventas" className="nav-link text-white">Ventas</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
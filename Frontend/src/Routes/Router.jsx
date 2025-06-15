import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Home from './Pages/Home';
import Productos from './Pages/Productos';
import Clientes from './Pages/Clientes';
import Ventas from './Pages/Ventas';
import Layout from './Layouts/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/productos" element={<Layout><Productos /></Layout>} />
        <Route path="/clientes" element={<Layout><Clientes /></Layout>} />
        <Route path="/ventas" element={<Layout><Ventas /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
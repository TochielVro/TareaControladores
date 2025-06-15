import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layouts/Layout';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Clientes from './Pages/Clientes';
import Productos from './Pages/Productos';
import Ventas from './Pages/Ventas';
import Home from './Pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/clientes" element={<Layout><Clientes /></Layout>} />
        <Route path="/productos" element={<Layout><Productos /></Layout>} />
        <Route path="/ventas" element={<Layout><Ventas /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

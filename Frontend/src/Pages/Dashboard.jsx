import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al home después de mostrar el mensaje de bienvenida
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1>Bienvenido al Sistema de Ventas</h1>
        <p>Redirigiendo al inicio...</p>
      </div>
    </div>
  );
}

export default Dashboard;
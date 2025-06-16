// Implementar el login de usuario
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Asumiendo que tienes un contexto de autenticación

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Hook del contexto de autenticación

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Reemplaza con tu endpoint real
      const response = await axios.post('https://api.example.com/auth/login', {
        email,
        password
      });
      
      // Guardar token y datos de usuario
      login(response.data.token, response.data.user, rememberMe);
      
      // Redirigir al dashboard
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="mb-3" 
                    style={{ height: '60px' }} 
                  />
                  <h2 className="h4">Iniciar Sesión</h2>
                  <p className="text-muted">Ingrese sus credenciales para acceder</p>
                </div>
                
                {error && (
                  <Alert variant="danger" onClose={() => setError(null)} dismissible className="text-center">
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="usuario@ejemplo.com"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Ingrese su contraseña"
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Recordarme"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    
                    <a href="/forgot-password" className="text-decoration-none">
                      ¿Olvidó su contraseña?
                    </a>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" role="status" />
                        <span className="ms-2">Iniciando sesión...</span>
                      </>
                    ) : (
                      'Ingresar'
                    )}
                  </Button>
                  
                  <div className="text-center mt-3">
                    <small className="text-muted">
                      ¿No tienes una cuenta?{' '}
                      <a href="/register" className="text-decoration-none">
                        Regístrate aquí
                      </a>
                    </small>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
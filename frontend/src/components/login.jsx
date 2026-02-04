import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/login.css';


const Login = () => {
  const [formData, setFormData] = useState({ nombre_usuario: '', pass_usuario: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess('');
    console.log('Formulario enviado', formData);


    try {
      const response = await fetch('http://localhost:5000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Respuesta del servidor', data);

      if (response.ok) {
        setSuccess('Inicio de sesión exitoso');
        // Almacenar el token y otros datos en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.usuario.rol_id || '')
        localStorage.setItem('nombre_usuario', data.usuario.nombre_usuario || '');        
        console.log('Respuesta del servidor:', data);
        navigate('/inicio'); // Redirigir a la vista inicio.jsx
        // Aquí puedes manejar el inicio de sesión exitoso, como redirigir al usuario
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error al conectar con el servidor', err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card">
        <img src={require('../images/logo.png')} alt="Logo" className="imgLogo2" />
        <h2 className="title">Sistema de Gestión Cajas Nap y diagramas de empalme</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <div className="inputBox">
              <input
                type="text"
                id="nombre_usuario"
                name="nombre_usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                required
              />
              <span className="user"><i className="bi bi-person-badge-fill"></i>Usuario</span>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div className="inputBox">
              <input
                type="password"
                id="password"
                name="pass_usuario"
                value={formData.pass_usuario}
                onChange={handleChange}
                required
              />
              <span className="password"><i className="bi bi-person-badge-fill"></i>Password</span>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button className="enter" type="submit" id="btnlogin" name="btnlogin">INGRESAR</button>
          </div>
          <span className="nav-link text-center text-black py-4"><i className="bi bi-c-circle"></i> Grupo Cable Vision all rigth reserved</span>  
        </form>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
      </div>
    </div>
  );
};

export default Login;
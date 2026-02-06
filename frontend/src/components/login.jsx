import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/login.css';
import axiosInstance from '../api/axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    pass_usuario: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axiosInstance.post(
        '/api/usuarios/login',
        formData
      );

      const data = res.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.usuario.rol_id || '');
      localStorage.setItem('nombre_usuario', data.usuario.nombre_usuario || '');

      navigate('/inicio');

    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data.message || 'Credenciales incorrectas');
      } else {
        setError('No se pudo conectar con el servidor');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card">
        <img src={require('../images/logo.png')} alt="Logo" className="imgLogo2" />

        <h2 className="title">
          Sistema de Gestión Cajas Nap y diagramas de empalme
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="inputBox">
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              required
            />
            <span className="user">
              <i className="bi bi-person-badge-fill"></i> Usuario
            </span>
          </div>

          <div className="inputBox">
            <input
              type="password"
              name="pass_usuario"
              value={formData.pass_usuario}
              onChange={handleChange}
              required
            />
            <span className="password">
              <i className="bi bi-person-badge-fill"></i> Password
            </span>
          </div>

          <div className="d-flex justify-content-center">
            <button className="enter" type="submit">
              INGRESAR
            </button>
          </div>

        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

      </div>
    </div>
  );
};

export default Login;
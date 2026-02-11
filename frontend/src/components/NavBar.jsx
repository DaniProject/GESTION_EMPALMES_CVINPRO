import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();

    const handleLogout = () => {
    // Eliminar el token de autenticación
    localStorage.removeItem('token');
    // Redirigir al login
    navigate('/');
  };

  const isAdmin = localStorage.getItem('rol') === '1';
  const user = localStorage.getItem('nombre_usuario');

  return (
    <>
    <nav className="navbar navbar-expand-lg bg position-sticky top-0">
      <div className="container-fluid">
        <img src={require('../images/logo.png')} alt="Logo" className="imgLogo" />
        <button className="navbar-toggler border-0" style={{ filter: 'brightness(100)' }} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav text-uppercase d-flex ms-auto" style={{ fontSize: 'small', color: 'black', fontWeight: 'bold' }}>
            <li className="nav-item">
              <span className="nav-link" >Bienvenido: {user}</span>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout}>CERRAR SESION</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </>
  );
};

export default Navbar;
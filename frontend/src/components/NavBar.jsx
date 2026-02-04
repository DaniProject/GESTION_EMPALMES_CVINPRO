import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empresaId, setEmpresaId] = useState('');
  const [rolId, setRolId] = useState('');

  const handleLogout = () => {
    // Eliminar el token de autenticación
    localStorage.removeItem('token');
    // Redirigir al login
    navigate('/');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/registerUser', {
        nombre,
        email,
        password,
        empresa_id: empresaId,
        rol_id: rolId
      });
      console.log('Usuario registrado:', response.data);
      setShowModal(false);
    } catch (error) {
      console.error('Error registrando el usuario:', error);
    }
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
            {isAdmin && (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => setShowModal(true)}>REGISTRO DE USUARIO</button>
              </li>
            )}
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout}>CERRAR SESION</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    {showModal && (
      <div className="modal" style={{ display: 'block', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '9999' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">REGISTRAR USUARIO</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Empresa ID</label>
                  <input type="text" className="form-control" value={empresaId} onChange={(e) => setEmpresaId(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Rol ID</label>
                  <input type="text" className="form-control" value={rolId} onChange={(e) => setRolId(e.target.value)} required />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    onClick={() => {
                    window.location.reload()
                    }}>REGISTRAR
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Navbar;
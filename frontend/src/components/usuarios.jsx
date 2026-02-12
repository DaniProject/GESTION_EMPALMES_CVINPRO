import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/inicio.css';
import '../css/responsive-content.css';
import axios from '../api/axiosConfig';

const Usuarios = () => {   
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('/api/usuarios/register', {
            rol_usuario: rol,
            nombre_usuario: nombre,
            user_usuario: user,
            pass_usuario: password,
          });
          console.log('Usuario registrado:', response.data);
          setError(null);
          setNombre('');
          setUser('');
          setPassword('');
          setRol('');
          setShowModal(false);
          // Recargar la lista de usuarios
          const usuariosResponse = await axios.get('/api/usuarios');
          setUsuarios(usuariosResponse.data);
          alert('Usuario registrado exitosamente');
        } catch (error) {
          console.error('Error registrando el usuario:', error);
          const mensajeError = error.response?.data?.message || 'Error al registrar el usuario';
          setError(mensajeError);
        }
      };
    const rol1 =localStorage.getItem('rol'); // Obtener el rol del usuario desde localStorage
    const rolDep = rol1 === '1';// Verificar si el rol es "Root"  

    useEffect(() => {
        
        // Llamar a la API para obtener los datos de usuarios
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('/api/usuarios'); // Ajusta la URL según tu configuración
                
                setUsuarios(response.data); // Guardar los datos en el estado
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos de usuarios');
            }
        };
        fetchUsuarios();
        }, [navigate]);

    return (
    
        <>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>USUARIOS</h1>
                {rolDep && (
                    <button
                    type="button" 
                    className="btn btn-success"  
                    onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i>
                      REGISTRO DE USUARIO
                    </button>
                )}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
        </div>
            {usuarios.length === 0 && !error ? (
                <p>No hay usuarios para mostrar.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Usuario</th>
                                <th>Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => (
                                <tr key={u.id_usuario || u.id || u.user_usuario}>
                                    <td>{u.id_usuario}</td>
                                    <td>{u.nombre_usuario}</td>
                                    <td>{u.user_usuario}</td>
                                    <td>{u.rol_usuario}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        
          
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
                  <label>ROL</label>
                  <select className="form-control" value={rol} onChange={(e) => setRol(e.target.value)} required>
                    <option value="">Seleccionar rol</option>
                    <option value="1">Root</option>
                    <option value="2">Técnico</option>
                    <option value="3">Directivo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>NOMBRE COMPLETO</label>
                  <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>USUARIO</label>
                  <input type="text" className="form-control" value={user} onChange={(e) => setUser(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>CONTRASEÑA</label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    >REGISTRAR
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}
        </>
    );
}

export default Usuarios;
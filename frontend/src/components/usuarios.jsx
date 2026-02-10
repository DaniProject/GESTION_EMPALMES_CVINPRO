import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/inicio.css';
import axiosInstance from '../api/axiosConfig';

const Usuarios = () => {   
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        // Llamar a la API para obtener los datos de usuarios
        const fetchUsuarios = async () => {
            try {
                const response = await axiosInstance.get('/api/usuarios'); // Ajusta la URL según tu configuración
                
                setUsuarios(response.data); // Guardar los datos en el estado
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos de usuarios');
            }
        };
        fetchUsuarios();
        }, [navigate]);

    return (
    
        <div className="container mt-4">
            <h2>Usuarios</h2>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

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
        </div>    
    
 
    );
}

export default Usuarios;
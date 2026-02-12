import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/inicio.css';
import '../css/responsive-content.css';
import axiosInstance from '../api/axiosConfig';

const Abonados = () => {   
    const navigate = useNavigate();
    const [error, setError] = useState(null); // Estado para manejar errores
    const [abonados, setAbonados] = React.useState([]); // Estado para almacenar los empalmes
    const [trackingData, setTrackingData] = useState(null); // Estado para almacenar los datos de tracking
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
    const [showFormModal, setShowFormModal] = useState(false); // Estado para controlar el modal de registro
    const [newAbonado, setNewAbonado] = useState({
        nombre_abonado: '',
        codigo_abonado: '',
        servicio: '',
        fecha_alta: '',
        estado: 'Activo'
    });
    const filteredAbonados = abonados.filter(abonados => abonados.id_abonado !== null); // Filtrar los empalmes que tienen id_nap
    const rol =localStorage.getItem('rol'); // Obtener el rol del usuario desde localStorage
    const rolDep = rol === '1';// Verificar si el rol es "Root"

    useEffect(() => {
        // Verificar si el token de autenticación está presente
        const token = localStorage.getItem('token');
        if (!token) {
            // Si no hay token, redirigir al login
            navigate('/');
        }
        // Llamar a la API para obtener los datos de naps
        const fetchAbonados = async () => {
            try {
                const response = await axiosInstance.get('/api/abonados'); // Ajusta la URL según tu configuración
                
                setAbonados(response.data); // Guardar los datos en el estado
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos de abonados');
            }
        };
        fetchAbonados();
        }, [navigate]);

        const fetchTrackingData = async (id_abonado) => {
            try {   
                const response = await axiosInstance.get(`/api/abonados/tracking/${id_abonado}`);
                const data = response.data; // Aquí obtienes los datos de tracking
                console.log(data); // Aquí puedes manejar los datos de tracking como desees
                setTrackingData(data); // Guardar los datos de tracking en el estado
                setShowModal(true); // Mostrar el modal con los datos de tracking
            } catch (err) {
                console.error('Error al obtener los datos de tracking:', err);
            }
        };
        
        const closeModal = () => {
            setShowModal(false); // Cerrar el modal
            setTrackingData(null); // Limpiar los datos del tracking
        };

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setNewAbonado({ ...newAbonado, [name]: value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const response = await axiosInstance.post('/api/abonados', newAbonado);
                const data = response.data;
                console.log('Abonado registrado:', data);
                setNewAbonado({
                    nombre_abonado: '',
                    codigo_abonado: '',
                    servicio: '',
                    fecha_alta: '',
                    estado: 'Activo'
                });
                setShowFormModal(false);
                // Recargar la lista de abonados
                // fetchAbonados(); // Si tienes esta función
            } catch (err) {
                setError(err.message);
            }
        };
    
        const closeFormModal = () => {
            setShowFormModal(false);
            setNewAbonado({
                nombre_abonado: '',
                codigo_abonado: '',
                servicio: '',
                fecha_alta: '',
                estado: 'Activo'
            });
        };

    return (
    <div className="content-container">
        <div className="content-header">
            <h1>ABONADOS</h1>
            {rolDep && (
            <button 
                type="button" 
                className="btn btn-success" 
                onClick={() => setShowFormModal(true)}
            >
                <i className="bi bi-plus-lg"></i> Registrar Abonado
            </button>
            )}
        </div>

        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead className="table-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Codigo</th>
                        <th>Servicio</th>
                        <th>Fecha de Inicio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAbonados.map((abonados) => (
                        <tr key={abonados.id_abonado}>
                            <td>{abonados.nombre_abonado}</td>
                            <td>{abonados.codigo_abonado}</td>
                            <td>{abonados.servicio}</td>
                            <td>{abonados.fecha_alta}</td>
                            <td>{abonados.estado}</td>    
                            <td>
                                <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => fetchTrackingData(abonados.id_abonado)}>
                                    TRACKING
                                </button>
                               
                            </td>                        
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Modal para mostrar los datos de tracking */}
        {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Datos de Tracking</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {trackingData ? (
                                    <div>
                                        <h5 className="mb-3">Información del Abonado</h5>
                                        <ul className="list-group">
                                            <li className="list-group-item">
                                                <i className="fas fa-user"></i> <strong>Nombre:</strong> {trackingData[0].nombre_abonado}
                                            </li>
                                            <li className="list-group-item">
                                                <i className="fas fa-id-card"></i> <strong>Código:</strong> {trackingData[0].codigo_abonado}
                                            </li>
                                            
                                            <li className="list-group-item">
                                                <i className="fas fa-network-wired"></i> <strong>Código NAP:</strong> {trackingData[0].codigo_nap}
                                            </li>
                                            <li className="list-group-item">
                                            <i className="fas fa-network-wired"></i> <strong>Ubicación NAP:</strong> 
                                                <a 
                                                    href={`https://www.google.com/maps?q=${trackingData[0].gps_lat},${trackingData[0].gps_lng}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    {trackingData[0].gps_lat}, {trackingData[0].gps_lng}
                                                </a>
                                            </li>
                                            <li className="list-group-item">
                                                <i className="fas fa-map-marker-alt"></i> <strong>Puerto NAP:</strong> {trackingData[0].puerto}
                                            </li>
                                            <li className="list-group-item">
                                                <i className="fas fa-map-marker-alt"></i> <strong>Troncal:</strong> {trackingData[0].cable}
                                            </li>
                                            <li className="list-group-item">
                                                <i className="fas fa-map-marker-alt"></i> <strong>Buffer:</strong> {trackingData[0].buffer}
                                            </li>
                                            <li className="list-group-item">
                                                <i className="fas fa-map-marker-alt"></i> <strong>Mufa:</strong> {trackingData[0].codigo_mufa}
                                            </li>
                                            <li className="list-group-item">
                                                <i className="fas fa-map-marker-alt"></i> <strong>Hilo:</strong> {trackingData[0].hilo}
                                            </li>
                                            <li className="list-group-item">
                                                <i className="fas fa-bolt"></i> <strong>Potencia NAP:</strong> {trackingData[0].potencia_nap}
                                            </li>
                                            <li className="list-group-item">
                                                <i className="fas fa-signal"></i> <strong>Potencia Abonado:</strong> {trackingData[0].potencia_abn}
                                            </li>
                                            <li className="list-group-item">
                                                <i className="fas fa-signal"></i> <strong>Pre Spliter:</strong> {trackingData[0].pre_spliter}
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <p>Cargando datos...</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        )}

        {/* Modal de Registro de Abonado */}
        {showFormModal && (
            <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Registrar Nuevo Abonado</h5>
                            <button type="button" className="btn-close" onClick={closeFormModal}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Nombre del Abonado</label>
                                        <input
                                            type="text"
                                            name="nombre_abonado"
                                            className="form-control"
                                            value={newAbonado.nombre_abonado}
                                            onChange={handleInputChange}
                                            placeholder="Ej: Juan Pérez"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Código del Abonado</label>
                                        <input
                                            type="text"
                                            name="codigo_abonado"
                                            className="form-control"
                                            value={newAbonado.codigo_abonado}
                                            onChange={handleInputChange}
                                            placeholder="Ej: ABN-001"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Tipo de Servicio</label>
                                        <select
                                            name="servicio"
                                            className="form-control"
                                            value={newAbonado.servicio}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Selecciona un servicio</option>
                                            <option value="Internet">Internet</option>
                                            <option value="TV">TV FTTH</option>
                                            <option value="Internet + TV">Internet + TV FTTH</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            name="fecha_alta"
                                            className="form-control"
                                            value={newAbonado.fecha_alta}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Estado</label>
                                        <select
                                            name="estado"
                                            className="form-control"
                                            value={newAbonado.estado}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                            <option value="Suspendido">Suspendido</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="modal-footer mt-4">
                                    <button type="button" className="btn btn-secondary" onClick={closeFormModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        <i className="fas fa-save"></i> Guardar Abonado
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}

export default Abonados;
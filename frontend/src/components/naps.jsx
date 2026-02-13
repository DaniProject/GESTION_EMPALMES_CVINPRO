import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/inicio.css';
import '../css/responsive-content.css';
import axiosInstance from '../api/axiosConfig';

const Naps = () => {
    const navigate = useNavigate();
    const [naps, setNaps] = useState([]); // Estado para almacenar los datos de la tabla naps
    const [error, setError] = useState(null); // Estado para manejar errores
    // const [showForm, setShowForm] = useState(false); // Estado para manejar la visibilidad del formulario
    const [searchTerm, setSearchTerm] = useState(''); // Estado para manejar el término de búsqueda
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [diagramData, setDiagramData] = useState([]); // Estado para almacenar los datos del diagrama
    const [selectedNap, setSelectedNap] = useState(null); // Estado para almacenar el NAP seleccionado
    const [newNap, setNewNap] = useState({
        codigo_nap: '', 
        gps_lat: '', 
        gps_lng: '',
        cable: '', 
        mufa: '',
        buffer: '',
        hilo: '',
        pre_spliter: '',
        spliter_type: '',
        potencia_nap: ''
    });

    const rol =localStorage.getItem('rol'); // Obtener el rol del usuario desde localStorage

    useEffect(() => {
        // Verificar si el token de autenticación está presente
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
        }

        // Llamar a la API para obtener los datos de naps
        const fetchNaps = async () => {
            try {
                const response = await axiosInstance.get('/api/naps'); // Ajusta la URL según tu configuración
                setNaps(response.data); // Guardar los datos en el estado
            } catch (err) {
                console.error(err);
                setError('Error al cargar el diagrama de empalme');
            }
        };
        fetchNaps();
        }, [navigate]);

        // Manejar el cambio de los campos del formulario
        const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNap({ ...newNap, [name]: value });
        };

        // Manejar el envío del formulario
        const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/naps', newNap);

            const savedNap = response.data;
            setNaps([...naps, savedNap]); // Agregar el nuevo NAP a la lista
            setNewNap({ // Reiniciar el formulario
                codigo_nap: '',
                gps_lat: '',
                gps_lng: '',
                cable: '',
                mufa: '',
                buffer: '',
                hilo: '',
                pre_spliter: '',
                spliter_type: '',
                potencia_nap: ''
            });
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al guardar la caja NAP');
        }
        };

        // Filtrar los datos según el término de búsqueda
        const filteredNaps = naps.filter((nap) =>
            Object.values(nap).some((value) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        // Estado para manejar el diagrama de empalme
        const fetchDiagramData = async (id_nap) => {
            console.log('NAP ID:', id_nap);
            try {
                const response = await axiosInstance.get(`/api/naps/diagrama/${id_nap}`);
                const data = response.data;
                setDiagramData(data);
                setSelectedNap(id_nap);
                setShowModal(true);
            } catch (err) {
                console.error(err);
                setError('NAP SIN EMPALMES, DISPONIBLE TODOS LOS PUERTOS');
            }
        };
    
        const closeModal = () => {
            setShowModal(false);
            setDiagramData([]);
            setSelectedNap(null);
        };

  return (
    <div className="content-container">
        <div className="content-header">
            <h1>Cajas NAP</h1>
            {rol === '1' && (
                    <button
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#napModal"
                    >
                        <i className="bi bi-plus-lg"></i> <span className="btn-text">Agregar Caja NAP</span>
                    </button>
                )}
        </div>

        {/* Modal para agregar NAP */}
        <div 
            className="modal fade" 
            id="napModal" 
            tabIndex="-1" 
            aria-labelledby="napModalLabel" 
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="napModalLabel">Agregar Caja NAP</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            data-bs-dismiss="modal" 
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Código NAP</label>
                                        <input
                                            type="text"
                                            name="codigo_nap"
                                            placeholder="Código NAP"
                                            value={newNap.codigo_nap}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Latitud</label>
                                        <input
                                            type="text"
                                            name="gps_lat"
                                            placeholder="Latitud"
                                            value={newNap.gps_lat}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Longitud</label>
                                        <input
                                            type="text"
                                            name="gps_lng"
                                            placeholder="Longitud"
                                            value={newNap.gps_lng}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Troncal</label>
                                        <input
                                            type="text"
                                            name="cable"
                                            placeholder="Troncal"
                                            value={newNap.cable}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Mufa</label>
                                        <input
                                            type="text"
                                            name="mufa"
                                            placeholder="Mufa"
                                            value={newNap.mufa}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Buffer</label>
                                        <input
                                            type="text"
                                            name="buffer"
                                            placeholder="Buffer"
                                            value={newNap.buffer}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Hilo</label>
                                        <input
                                            type="text"
                                            name="hilo"
                                            placeholder="Hilo"
                                            value={newNap.hilo}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Pre-Spliter</label>
                                        <select
                                            name="pre_spliter"
                                            value={newNap.pre_spliter}
                                            onChange={handleInputChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Selecciona Pre-Spliter</option>
                                            <option value="80/20">80/20</option>
                                            <option value="75/25">75/25</option>
                                            <option value="50/50">50/50</option>
                                            <option value="FINAL">FINAL</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Tipo Spliter</label>
                                        <input
                                            type="text"
                                            name="spliter_type"
                                            placeholder="Tipo Spliter"
                                            value={newNap.spliter_type}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="form-label">Potencia</label>
                                        <input
                                            type="text"
                                            name="potencia_nap"
                                            placeholder="Potencia"
                                            value={newNap.potencia_nap}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            data-bs-dismiss="modal"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-success" 
                            onClick={handleSubmit}
                            data-bs-dismiss="modal"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>

            <input
                type="text"
                placeholder="Buscar..."
                className="form-control form-control.search-input my-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Error alerts shown as dismissible modal instead of static div */}
            {error && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Aviso</h5>
                                <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-danger m-0">{error}</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setError(null)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="table-responsive-wrapper">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>NAP Name</th>
                        <th>Ubicación</th>
                        <th>Troncal</th>
                        <th>Mufa</th>
                        <th>Buffer</th>
                        <th>Hilo</th>
                        <th>Pre-Spliter</th>
                        <th>Tipo Spliter</th>
                        <th>Potencia</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredNaps.map((nap) => (
                        <tr key={nap.id_nap}>
                            <td>{nap.codigo_nap}</td>
                            <td>
                                <a 
                                href={`https://www.google.com/maps?q=${nap.gps_lat},${nap.gps_lng}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                >
                                    {nap.gps_lat + ', ' + nap.gps_lng}
                                </a>
                            </td>
                            <td>{nap.cable}</td>
                            <td>{nap.mufa}</td>
                            <td>{nap.buffer}</td>
                            <td>{nap.hilo}</td>
                            <td>{nap.pre_spliter}</td>
                            <td>{nap.spliter_type}</td>
                            <td>{nap.potencia_nap}</td>
                            <td>
                                <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => fetchDiagramData(nap.id_nap)}
                                >
                                Diagrama
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Diagrama de Empalme - NAP {selectedNap}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {diagramData.length > 0 ? (
                                    <ul className="list-group">
                                        {diagramData.map((item, index) => (
                                            <li key={index} className="list-group-item">
                                                <strong>Puerto {item.puerto}:</strong> {item.nombre_abonado || 'Sin Abonado'}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No hay datos disponibles para este NAP.</p>
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
        </div>
  );
};

export default Naps; // Exporta el componente como predeterminado
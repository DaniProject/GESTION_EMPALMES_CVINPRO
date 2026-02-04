import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/inicio.css';

const Naps = () => {
    const navigate = useNavigate();
    const [naps, setNaps] = useState([]); // Estado para almacenar los datos de la tabla naps
    const [error, setError] = useState(null); // Estado para manejar errores
    const [showForm, setShowForm] = useState(false); // Estado para manejar la visibilidad del formulario
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
                const response = await fetch('http://localhost:5000/api/naps'); // Ajusta la URL según tu configuración
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de naps');
                }
                const data = await response.json();
                setNaps(data); // Guardar los datos en el estado
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos de naps');
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
            const response = await fetch('http://localhost:5000/api/naps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNap),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la caja NAP');
            }

            const savedNap = await response.json();
            setNaps([...naps, savedNap]); // Agregar el nuevo NAP a la lista
            setShowForm(false); // Ocultar el formulario
            setNewNap({ // Reiniciar el formulario
                codigo_nap: '',
                gps_lat: '',
                gps_lng: '',
                cable: '',
                mufa: '',
                buffer: '',
                hilo: '',
                spliter_type: '',
                potencia_nap: ''
            });
        } catch (err) {
            console.error(err);
            setError('Error al guardar la caja NAP');
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
                const response = await fetch(`http://localhost:5000/api/naps/diagrama/${id_nap}`);
                if (!response.ok) {
                    throw new Error('Error al obtener el diagrama de empalme');
                }
                const data = await response.json();
                setDiagramData(data);
                setSelectedNap(id_nap);
                setShowModal(true);
            } catch (err) {
                console.error(err);
                setError('Error al obtener el diagrama de empalme');
            }
        };
    
        const closeModal = () => {
            setShowModal(false);
            setDiagramData([]);
            setSelectedNap(null);
        };

  return (
    <div>
        <div className="d-flex justify-content-between align-items-center">
            <h1>Cajas NAP</h1>
            {rol === '1' && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancelar' : 'Agregar Caja NAP'}
                    </button>
                )}
        </div>
            <input
                type="text"
                placeholder="Buscar..."
                className="form-control my-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {showForm && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="row">
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="codigo_nap"
                                placeholder="Código NAP"
                                value={newNap.codigo_nap}
                                onChange={handleInputChange}
                                className="form-control mb-2"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="gps_lat"
                                placeholder="Latitud"
                                value={newNap.gps_lat}
                                onChange={handleInputChange}
                                className="form-control mb-2"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="gps_lng"
                                placeholder="Longitud"
                                value={newNap.gps_lng}
                                onChange={handleInputChange}
                                className="form-control mb-2"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="cable"
                                placeholder="Troncal"
                                value={newNap.cable}
                                onChange={handleInputChange}
                                className="form-control mb-2"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="mufa"
                                placeholder="Mufa"
                                value={newNap.mufa}
                                onChange={handleInputChange}
                                className="form-control mb-2"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="buffer"
                                placeholder="Buffer"
                                value={newNap.buffer}
                                onChange={handleInputChange}
                                className="form-control mb-2"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="hilo"
                                placeholder="Hilo"
                                value={newNap.hilo}
                                onChange={handleInputChange}
                                className="form-control mb-2"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="spliter_type"
                                placeholder="Tipo Spliter"
                                value={newNap.spliter_type}
                                onChange={handleInputChange}
                                className="form-control mb-2"
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="potencia_nap"
                                placeholder="Potencia"
                                value={newNap.potencia_nap}
                                onChange={handleInputChange}
                                className="form-control mb-2"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success">
                        Guardar
                    </button>
                </form>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="table table-striped">
                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                    <tr>
                        
                        <th>NAP Name</th>
                        <th>Ubicación</th>
                        <th>Troncal</th>
                        <th>Mufa</th>
                        <th>Buffer</th>
                        <th>Hilo</th>
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
                            <td>{nap.spliter_type}</td>
                            <td>{nap.potencia_nap}</td>
                            <td>
                                <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => fetchDiagramData(nap.id_nap)}
                                >
                                Diagrama de Empalme
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Diagrama de Empalme - NAP {selectedNap}</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
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
        <br />
    </div>
  );
};

export default Naps; // Exporta el componente como predeterminado
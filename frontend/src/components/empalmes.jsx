import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/inicio.css";
import "../css/responsive-content.css";
import axiosInstance from '../api/axiosConfig';

const Empalmes = () => {
  const rol = localStorage.getItem('rol');
  const navigate = useNavigate();
  const [abonados, setAbonados] = useState([]);
  const [naps, setNaps] = useState([]);
  const [empalmes, setEmpalmes] = useState([]);
  const [error, setError] = useState(null);
  const [newEmpalme, setNewEmpalme] = useState({
    id_nap: "",
    puerto: "",
    potencia_abn: "",
    id_abonado: "",
    observaciones: "",
  });

  const filteredEmpalmes = empalmes.filter(
    (empalme) => empalme.id_empalme !== null
  );


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    const fetchEmpalmes = async () => {
      try {
        const response = await axiosInstance.get('/api/empalmes');
        setEmpalmes(response.data);

      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos de empalmes");
      }
    };

    const fetchNaps = async () => {
      try {
        const response = await axiosInstance.get('/api/naps');
        setNaps(response.data);
      } catch (error) {
        console.error("Error cargando NAPs:", error);
      }
    };

    const fetchAbonados = async () => {
        try {
          const response = await axiosInstance.get('/api/abonados'); // 👈 ruta para abonados
          setAbonados(response.data);
        } catch (error) {
          console.error("Error cargando abonados:", error);
        }
      };

    fetchAbonados();
    fetchEmpalmes();
    fetchNaps();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmpalme({ ...newEmpalme, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate all required fields
  if (!newEmpalme.id_nap || !newEmpalme.puerto || !newEmpalme.potencia_abn || !newEmpalme.id_abonado) {
    setError("Por favor completa todos los campos requeridos");
    return;
  }

  try {
    const response = await axiosInstance.post('/api/empalmes', newEmpalme);

    const savedEmpalme = response.data;

    setEmpalmes([...empalmes, savedEmpalme]);

    setNewEmpalme({
      id_nap: "",
      puerto: "",
      potencia_abn: "",
      id_abonado: "",
      observaciones: "",
    });

    setError(null);

  } catch (err) {
    console.error(err);
    setError(err.response?.data?.error || "Error al guardar el empalme");
  }
};

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>EMPALMES</h1>
        {rol === '1' && (
        <button 
        type="button" 
        className="btn btn-primary mb-3" 
        data-bs-toggle="modal" 
        data-bs-target="#empalmeModal"
        onClick={() => setError(null)}
        >
            Agregar Empalme
        </button>
        )}
      </div>
      
      <div 
      className="modal fade" 
      id="empalmeModal" 
      tabIndex="-1" 
      aria-labelledby="empalmeModalLabel" 
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="empalmeModalLabel">Agregar Empalme</h5>
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
                  <label className="form-label">NAP</label>
                  <Select
                    options={naps.map(nap => ({ value: nap.id_nap, label: nap.codigo_nap }))}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setNewEmpalme({ ...newEmpalme, id_nap: selectedOption.value });
                      }
                    }}
                    value={newEmpalme.id_nap ? naps.map(nap => ({ value: nap.id_nap, label: nap.codigo_nap })).find(opt => opt.value === newEmpalme.id_nap) : null}
                    placeholder="Selecciona o busca NAP"
                    isSearchable
                    isClearable
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Abonado</label>
                  <Select
                    options={abonados.map(ab => ({ value: ab.id_abonado, label: ab.codigo_abonado }))}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setNewEmpalme({ ...newEmpalme, id_abonado: selectedOption.value });
                      }
                    }}
                    value={newEmpalme.id_abonado ? abonados.map(ab => ({ value: ab.id_abonado, label: ab.codigo_abonado })).find(opt => opt.value === newEmpalme.id_abonado) : null}
                    placeholder="Selecciona o busca abonado"
                    isSearchable
                    isClearable
                  />
                </div>
              </div>

              {/* otros campos */}
              <input
                type="text"
                name="puerto"
                className="form-control mt-2"
                placeholder="Puerto"
                value={newEmpalme.puerto}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="potencia_abn"
                className="form-control mt-2"
                placeholder="Potencia del Puerto"
                value={newEmpalme.potencia_abn}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="observaciones"
                className="form-control mt-2"
                placeholder="Observaciones"
                value={newEmpalme.observaciones}
                onChange={handleInputChange}
              />

              <button type="submit" className="btn btn-success mt-3">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <table className="table table-striped">
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <tr>
              <th>ID NAP</th>
              <th>Puerto</th>
              <th>Potencia del puerto</th>
              <th>ID Abonado</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmpalmes.map((empalme) => (
              <tr key={empalme.id_empalme}>
                <td>{empalme.id_nap}</td>
                <td>{empalme.puerto}</td>
                <td>{empalme.potencia_abn}</td>
                <td>{empalme.codigo_abonado}</td>
                <td>{empalme.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Empalmes;
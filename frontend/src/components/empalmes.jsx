import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/inicio.css";

const Empalmes = () => {
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
        const response = await fetch("http://localhost:5000/api/empalmes");
        if (!response.ok) {
          throw new Error("Error al obtener los datos de empalmes");
        }
        const data = await response.json();
        setEmpalmes(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos de empalmes");
      }
    };

    const fetchNaps = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/naps");
        const data = await response.json();
        setNaps(data);
      } catch (error) {
        console.error("Error cargando NAPs:", error);
      }
    };

    const fetchAbonados = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/abonados"); // 👈 ruta para abonados
          const data = await response.json();
          setAbonados(data);
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
    try {
      const response = await fetch("http://localhost:5000/api/empalmes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmpalme),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el empalme");
      }

      const savedEmpalme = await response.json();
      setEmpalmes([...empalmes, savedEmpalme]);
      setNewEmpalme({
        id_nap: "",
        puerto: "",
        potencia_abn: "",
        id_abonado: "",
        observaciones: "",
      });
    } catch (err) {
      console.error(err);
      setError("Error al guardar el empalme");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>EMPALMES</h1>
        <button 
        type="button" 
        className="btn btn-primary mb-3" 
        data-bs-toggle="modal" 
        data-bs-target="#empalmeModal"
        >
            Agregar Empalme
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      
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
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">NAP</label>
                  <Select
                    options={naps.map(nap => ({ value: nap.id_nap, label: nap.codigo_nap }))}
                    onChange={(selectedOption) =>
                      setNewEmpalme({ ...newEmpalme, id_nap: selectedOption.value })
                    }
                    placeholder="Selecciona o busca NAP"
                    isSearchable
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Abonado</label>
                  <Select
                    options={abonados.map(ab => ({ value: ab.id_abonado, label: ab.codigo_abonado }))}
                    onChange={(selectedOption) =>
                      setNewEmpalme({ ...newEmpalme, id_abonado: selectedOption.value })
                    }
                    placeholder="Selecciona o busca abonado"
                    isSearchable
                    required
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
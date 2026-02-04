import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import Naps from './naps';
import Empalmes from './empalmes';
import Abonados from './abonados';
import LateralBarInicio from './LateralBarInicio';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/inicio.css';


const Inicio = () => {
    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState('');
    
    useEffect(() => {
        // Verificar si el token de autenticación está presente
        const token = localStorage.getItem('token');
        if (!token) {
          // Si no hay token, redirigir al login
          navigate('/');
        }
        
      
      }, [navigate]);

      // Renderiza dinámicamente el contenido basado en activeComponent
    const renderContent = () => {
      switch (activeComponent) {
          case 'Naps':
              return <Naps />;
          case 'Empalmes':
              return <Empalmes />;
          case 'Abonados':
              return <Abonados/>;
          default:
              return (
                  <div>
                      <h1>Bienvenido al sistema</h1>
                      <p>Selecciona una opción en la barra lateral para continuar.</p>
                  </div>
              );
      }
  };

  return (
    <div>
      <Navbar/>
      <div style={{ display: 'flex', height: '100vh' }}>
        <LateralBarInicio setActiveComponent={setActiveComponent} />
        <div style={{ flex: 1, padding: '20px' }}>{/* Aquí puedes agregar nuevos componentes o contenido */}
                    {renderContent()}
                    <br />
          <span className="nav-link text-center"><i className="bi bi-c-circle"></i> CABLEVISION GROUP all rigth reserved</span> 
        </div>
    </div>
    </div>
  );
};

export default Inicio;
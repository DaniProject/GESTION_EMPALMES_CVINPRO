import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import Naps from './naps';
import Empalmes from './empalmes';
import Abonados from './abonados';
import Usuarios from  './usuarios';
import LateralBarInicio from './LateralBarInicio';
import Dashboard from './Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/inicio.css';


const Inicio = () => {
    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState('Dashboard');
    
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
          case 'Usuarios':
              return <Usuarios/>;
          case 'Dashboard':
            return <Dashboard />;
          default:
            return <Dashboard />;
      }
  };

  return (
    <div className="inicio-wrapper">
      <Navbar/>
      <div className="inicio-main">
        <LateralBarInicio setActiveComponent={setActiveComponent} />
        <div className="inicio-content">
          {renderContent()}
        </div>
      </div>
      <footer className="inicio-footer">
        <span><i className="bi bi-c-circle"></i> CABLEVISION GROUP all rights reserved</span>
      </footer>
    </div>
  );
};

export default Inicio;
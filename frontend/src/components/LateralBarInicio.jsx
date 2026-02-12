import React, { useState } from 'react';
import '../css/sidebar.css';

const LateralBarInicio = ({ setActiveComponent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const rol = localStorage.getItem('rol');
    const rolDep = rol === '1';

    const handleMenuClick = (component) => {
        setActiveComponent(component);
        setIsOpen(false); // Cerrar sidebar en móvil
    };

    return (
        <>
            {/* Hamburger Button */}
            <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
                <i className={`bi ${isOpen ? 'bi-x' : 'bi-list'}`}></i>
            </button>

            {/* Overlay backdrop */}
            {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>}

            {/* Sidebar */}
            <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul className="nav flex-column">
                    {rolDep && (
                        <li className="nav-item">
                            <button 
                                type="button" 
                                className="nav-link text-white" 
                                onClick={() => handleMenuClick('Empalmes')}
                            >
                            <i className="bi bi-ethernet"></i> Empalmes
                            </button>
                        </li>
                    )}
                    <li className="nav-item">
                        <button 
                            type="button" 
                            className="nav-link text-white" 
                            onClick={() => handleMenuClick('Naps')}
                        >
                            <i className="bi bi-cpu"></i> Cajas NAP
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            type="button" 
                            className="nav-link text-white" 
                            onClick={() => handleMenuClick('Abonados')}
                        >
                            <i className="bi bi-people"></i> Abonados
                        </button>
                    </li>

                    {rolDep && (
                        <li className="nav-item">
                            <button 
                                type="button" 
                                className="nav-link text-white" 
                                onClick={() => handleMenuClick('Usuarios')}
                            >
                                <i className="bi bi-person-fill-gear"></i> Usuarios
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </>
    );
};

export default LateralBarInicio;
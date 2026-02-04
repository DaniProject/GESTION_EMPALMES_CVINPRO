import React from 'react';

const LateralBarInicio = ({ setActiveComponent }) => {
    
    const rol = localStorage.getItem('rol');
    const rolDep = rol === '1';  
    return(
        <nav className="sidebar bg-dark" style={{width: '250px', height: '105ev'}}>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <button type="button" className="nav-link text-white" onClick={() => setActiveComponent('Empalmes')}>
                        <i className="bi bi-ethernet"></i> Empalmes
                    </button>
                </li>
                <li className="nav-item">
                    <button type="button" className="nav-link text-white" onClick={() => setActiveComponent('Naps')}>
                        <i className="bi bi-cpu"></i> Cajas NAP
                    </button>
                </li>
                <li className="nav-item">
                    <button type="button" className="nav-link text-white" onClick={() => setActiveComponent('Abonados')}>
                        <i className="bi bi-people"></i> Abonados
                    </button>
                </li>

                {rolDep && (
                <>
                    <li className="nav-item">
                        <button type="button" className="nav-link text-white" onClick={() => setActiveComponent('newContrato')}>
                            <i className="bi bi-gear"></i> Settings
                        </button>
                    </li>
                </>
                )}
            </ul>    
        </nav>
    );
};

export default LateralBarInicio;
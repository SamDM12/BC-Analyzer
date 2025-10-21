import React from 'react';
import { BarChart3, FilePlus2, Table } from 'lucide-react';
import './home.css';

const Home = () => {
  return (
    <div className="menu-container">
      {/* Barra superior */}
      <div className="header">
        <nav className="nav-tabs">
          <button className="tab">Inicio</button>
          <button className="tab">Vista y filtrado de datos</button>
          <button className="tab">Métricas</button>
        </nav>
        <div className="logo">BC Analyzer</div>
      </div>

    {/* Contenido de bienvenida */} 
    <div className="welcome"> 
        <h1>Bienvenido al sistema BC Analyzer</h1> 
    </div>
      {/* Contenido principal */}
      <div className="main-content">
        {/* Lado izquierdo: botones */}
        <div className="left-panel">
          <div className="section">
            <h3>Operaciones de análisis</h3>
            <button className="menu-button">
              <Table className="icon" />
              <span>Vista y filtrado<br />de datos</span>
            </button>

            <button className="menu-button">
              <BarChart3 className="icon" />
              <span>Métricas<br />y gráficos</span>
            </button>
          </div>

          <div className="section">
            <h3>Cambiar datos de análisis</h3>
            <button className="menu-button">
              <FilePlus2 className="icon" />
              <span>Cambiar<br />de datos</span>
            </button>
          </div>
        </div>

        {/* Lado derecho: reporte */}
        <div className="report-panel">
          <h2>Reporte del análisis</h2>
          <div className="report-content">
            <p>Aquí se mostrará un resumen de los datos analizados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
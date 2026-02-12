import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import '../css/dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [abonadosData, setAbonadosData] = useState([]);
  const [puertos, setPuertos] = useState(null);
  const [napsUso, setNapsUso] = useState(null);
  const [napsPorNap, setNapsPorNap] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [aRes, pRes, nRes, perNapRes] = await Promise.all([
          axios.get('/api/stats/abonados-por-servicio'),
          axios.get('/api/stats/puertos'),
          axios.get('/api/stats/naps-uso'),
          axios.get('/api/stats/naps-por-nap'),
        ]);

        setAbonadosData(aRes.data.data || []);
        setPuertos(pRes.data || null);
        setNapsUso(nRes.data || null);
        setNapsPorNap(perNapRes.data.data || []);
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
      }
    };

    fetchStats();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12 },
          padding: 10,
        },
      },
    },
  };

  const pieData = {
    labels: abonadosData.map(d => d.servicio || 'Otros'),
    datasets: [
      {
        data: abonadosData.map(d => d.total),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#8AE234', '#9966FF'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#8AE234', '#9966FF'],
        borderWidth: 2,
      },
    ],
  };

  const puertosData = puertos
    ? {
        labels: ['Usados', 'Disponibles'],
        datasets: [
          {
            data: [puertos.used_ports, Math.max(puertos.total_ports - puertos.used_ports, 0)],
            backgroundColor: ['#FF6384', '#36A2EB'],
            borderWidth: 2,
          },
        ],
      }
    : null;

  const napsUsoData = napsPorNap.slice(0, 8).length
    ? {
        labels: napsPorNap.slice(0, 8).map(n => n.codigo_nap || `NAP ${n.id_nap}`),
        datasets: [
          {
            label: 'Puertos usados',
            data: napsPorNap.slice(0, 8).map(n => n.used_ports),
            backgroundColor: '#36A2EB',
            borderColor: '#2196F3',
            borderWidth: 1,
          },
        ],
      }
    : null;

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 16,
        ticks: { font: { size: 11 } },
      },
      y: {
        ticks: { font: { size: 11 } },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>

      {/* Top Row: 4 KPI Cards */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-title">Abonados Totales</div>
          <div className="kpi-value">{abonadosData.reduce((s, d) => s + d.total, 0)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Puertos Usados</div>
          <div className="kpi-value">{puertos?.used_ports || 0}</div>
          <div className="kpi-subtitle">de {puertos?.total_ports || 0}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">NAPs en Uso</div>
          <div className="kpi-value">{napsUso?.naps_in_use || 0}</div>
          <div className="kpi-subtitle">de {napsUso?.total_naps || 0}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">% Puertos</div>
          <div className="kpi-value">{puertos?.percent_used || 0}%</div>
          <div className="kpi-subtitle">Ocupado</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <h5>Abonados por Servicio</h5>
          <div className="chart-wrapper">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h5>Puertos Usados vs Disponibles</h5>
          <div className="chart-wrapper">
            {puertosData ? <Doughnut data={puertosData} options={chartOptions} /> : <p>Cargando...</p>}
          </div>
        </div>
      </div>

      {/* Bar Chart Row */}
      <div className="charts-row">
        <div className="chart-card full-width">
          <h5>Uso de Puertos por NAP (Top 8)</h5>
          <div className="chart-wrapper-bar">
            {napsUsoData ? (
              <Bar data={napsUsoData} options={barOptions} />
            ) : (
              <p>Cargando...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

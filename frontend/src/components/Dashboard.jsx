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

  const pieData = {
    labels: abonadosData.map(d => d.servicio || 'Otros'),
    datasets: [
      {
        data: abonadosData.map(d => d.total),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#8AE234', '#9966FF'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#8AE234', '#9966FF'],
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
          },
        ],
      }
    : null;

  const napsUsoData = napsPorNap.length
    ? {
        labels: napsPorNap.map(n => n.codigo_nap || `NAP ${n.id_nap}`),
        datasets: [
          {
            label: 'Puertos usados',
            data: napsPorNap.map(n => n.used_ports),
            backgroundColor: '#36A2EB',
          },
        ],
      }
    : null;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h6>Abonados por servicio</h6>
            <Pie data={pieData} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h6>Puertos usados</h6>
            {puertosData ? <Doughnut data={puertosData} /> : <p>Cargando...</p>}
            {puertos && (
              <p className="mt-2">{`Usados: ${puertos.used_ports} / ${puertos.total_ports} (${puertos.percent_used}%)`}</p>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h6>NAPs en uso</h6>
            {napsUso ? (
              <div>
                <p>{`${napsUso.naps_in_use} de ${napsUso.total_naps} (${napsUso.percent_in_use}%)`}</p>
              </div>
            ) : (
              <p>Cargando...</p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h6>Puertos por NAP (top 10)</h6>
            {napsUsoData ? (
              <Bar data={{ ...napsUsoData, datasets: [{ ...napsUsoData.datasets[0], backgroundColor: '#8e5ea2' }] }} options={{ indexAxis: 'y' }} />
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

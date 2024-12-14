// src/app/reportes-clientes/page.tsx

'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale } from 'chart.js';
import RepNavBar from '../components/RepNavBar'; // Importamos el componente RepNavBar

ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale);

const ReportesClientes: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [clientData, setClientData] = useState({
    totalCitas: 50,
    citasPorMes: [10, 20, 15, 5], // Datos de ejemplo para las citas mensuales
  });

  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(event.target.value);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    datasets: [
      {
        label: 'Citas Mensuales',
        data: clientData.citasPorMes,
        backgroundColor: 'rgb(0, 0, 0)', // Color negro sólido
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Citas por Cliente - ${selectedYear} ${['Enero', 'Febrero', 'Marzo', 'Abril'][selectedMonth]}`,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(169, 169, 169)', // Escala de grises para las etiquetas de los meses
        },
      },
      y: {
        ticks: {
          color: 'rgb(169, 169, 169)', // Escala de grises para las etiquetas del eje Y
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white h-full">
      <RepNavBar /> {/* Barra de navegación fuera del contenedor */}

      <div className="p-4" style={{ padding: '1rem' }}> {/* Padding de 1rem */}
        <h1 className="text-xl font-bold mb-4 text-black">Reporte de Clientes</h1>

        {/* Selectores de cliente, mes y año en línea */}
        <div className="flex space-x-4 mb-4">
          {/* Selector de cliente */}
          <div>
            <label htmlFor="clientSelector" className="block text-black font-medium mb-2">
              Selecciona un cliente:
            </label>
            <select
              id="clientSelector"
              value={selectedClient}
              onChange={handleClientChange}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="" disabled>Selecciona un cliente</option>
              <option value="cliente1">Cliente 1</option>
              <option value="cliente2">Cliente 2</option>
              <option value="cliente3">Cliente 3</option>
            </select>
          </div>

          {/* Selector de mes */}
          <div>
            <label htmlFor="monthSelector" className="block text-black font-medium mb-2">
              Selecciona un mes:
            </label>
            <select
              id="monthSelector"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 p-2 rounded"
            >
              {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de año */}
          <div>
            <label htmlFor="yearSelector" className="block text-black font-medium mb-2">
              Selecciona un año:
            </label>
            <select
              id="yearSelector"
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 p-2 rounded"
            >
              {[2024, 2023, 2022, 2021].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gráfico de citas mensuales */}
        <div className="mt-5 max-h-[400px] w-full h-full">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ReportesClientes;

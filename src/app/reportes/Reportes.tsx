// src/app/reportes/Reportes.tsx

'use client';

import React, { useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, LineElement, CategoryScale, LinearScale } from 'chart.js';
import { usePathname } from 'next/navigation';

// Registro de componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title, LineElement, CategoryScale, LinearScale);

const Reportes: React.FC = () => {
  const pathname = usePathname();
  const [selectedClient, setSelectedClient] = useState<string>('cliente1');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('empleado1');

  // Datos de ejemplo para las gráficas
  const clientsData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Número de Citas',
        data: [5, 8, 12, 15, 9, 13],
        borderColor: '#007BFF',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const employeesData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    datasets: [
      {
        label: 'Número de Citas',
        data: [3, 5, 6, 4, 8],
        borderColor: '#28A745',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(event.target.value);
  };

  const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEmployee(event.target.value);
  };

  const data = {
    labels: ['Servicios', 'Productos', 'Membresías'],
    datasets: [
      {
        data: [1000, 2000, 7000],
        backgroundColor: ['#FFC107', '#28A745', '#007BFF'],
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
        text: 'Ingresos por Tipo',
      },
    },
  };

  return (
    <div className="flex flex-col h-full p-5 bg-white">
      <div className="flex items-center mb-4">
        <h1 className="font-bold text-2xl mr-4 text-black">Estadísticas e Informes</h1>
      </div>
      <hr className="border-t border-gray-300" />

      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Sección Reportes */}
        <div className="flex-1 bg-white p-4 border-r border-[#CACACA]">
          <h2 className="font-semibold text-lg mb-3 text-black">Ingresos</h2>
          <div className="flex justify-between mb-3 border border-[#CACACA] p-4 rounded">
            <div className="w-full">
              <h3 className="font-medium text-black">Ingresos Totales:</h3>
              <p className="text-black">$10,000</p>
            </div>
            <div className="w-full">
              <h3 className="font-medium text-black">Total de Citas:</h3>
              <p className="text-black">50</p>
            </div>
          </div>
          <div className="my-4 max-w-[270px]">
            <Doughnut data={data} options={options} />
          </div>

          {/* Selector para Clientes */}
          <div className="mb-4">
            <label htmlFor="clientSelector" className="text-black font-medium">Seleccionar Cliente:</label>
            <select
              id="clientSelector"
              value={selectedClient}
              onChange={handleClientChange}
              className="border border-gray-300 p-2 rounded mr-2"
            >
              <option value="cliente1">Cliente 1</option>
              <option value="cliente2">Cliente 2</option>
              <option value="cliente3">Cliente 3</option>
            </select>
          </div>

          {/* Gráfica de Clientes */}
          <Line data={clientsData} options={{ responsive: true, plugins: { title: { display: true, text: 'Citas Mensuales de Clientes' } } }} />
        </div>

        {/* Sección Empleados */}
        <div className="bg-white p-4 max-w-[320px] w-full lg:ml-4 border border-[#CACACA] rounded mt-5">
          {/* Selector para Empleados */}
          <div className="mb-4">
            <label htmlFor="employeeSelector" className="text-black font-medium">Seleccionar Empleado:</label>
            <select
              id="employeeSelector"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className="border border-gray-300 p-2 rounded mr-2"
            >
              <option value="empleado1">Empleado 1</option>
              <option value="empleado2">Empleado 2</option>
              <option value="empleado3">Empleado 3</option>
            </select>
          </div>

          {/* Gráfica de Empleados */}
          <Line data={employeesData} options={{ responsive: true, plugins: { title: { display: true, text: 'Citas Semanales de Empleados' } } }} />
        </div>
      </div>
    </div>
  );
};

export default Reportes;

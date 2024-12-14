// src/app/reportes-empleados/page.tsx

'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale } from 'chart.js';
import RepNavBar from '../components/RepNavBar'; // Importamos el componente RepNavBar

ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale);

const ReportesEmpleados: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // Mes actual por defecto
  const [employeeData, setEmployeeData] = useState({
    totalCitas: 50,
    citasPorSemana: [10, 15, 12, 13, 8], // Datos de ejemplo para las citas semanales
    semanas: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'], // Nombre de las semanas
  });

  const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEmployee(event.target.value);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const data = {
    labels: employeeData.semanas.map((semana) => `${semana} de ${['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][selectedMonth]}`),
    datasets: [
      {
        label: 'Citas Semanales',
        data: employeeData.citasPorSemana,
        backgroundColor: 'rgb(0, 0, 0)', // Color completamente negro
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
        text: `Citas por Empleado - ${['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][selectedMonth]}`,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(169, 169, 169)', // Escala de grises para las etiquetas de las semanas
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
        <h1 className="text-xl font-bold mb-4 text-black">Reporte de Empleados</h1>

        {/* Selectores de empleado y mes en línea */}
        <div className="flex space-x-4 mb-4">
          {/* Selector de empleado */}
          <div>
            <label htmlFor="employeeSelector" className="block text-black font-medium mb-2">
              Selecciona un empleado:
            </label>
            <select
              id="employeeSelector"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="" disabled>Selecciona un empleado</option>
              <option value="empleado1">Empleado 1</option>
              <option value="empleado2">Empleado 2</option>
              <option value="empleado3">Empleado 3</option>
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
        </div>

        {/* Gráfico de citas semanales */}
        <div className="mt-5 max-h-[400px] w-full h-full">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ReportesEmpleados;

'use client';

import React from 'react';
import DateSelector from './DateSelector';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  registerables,
} from 'chart.js';
import chevron from '/img/chevron.svg'; // Cambia la ruta a esta

ChartJS.register(ArcElement, Tooltip, Legend, Title, ...registerables);

interface ReportesProps {
  onDateChange: (date: Date) => void;
}

const Reportess: React.FC<ReportesProps> = ({ onDateChange }) => {
  const ingresosTotales = 10000; 
  const serviciosIngresos = 1000; 
  const productosIngresos = 2000; 
  const membresiasIngresos = 7000; 

  const handleDateChange = (date: Date) => {
    console.log('Fecha seleccionada en Reportess:', date);
    onDateChange(date);
  };

  const data = {
    labels: ['Servicios', 'Productos', 'Membresías'],
    datasets: [
      {
        data: [serviciosIngresos, productosIngresos, membresiasIngresos],
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
        <DateSelector onDateChange={handleDateChange} />
      </div>
      <hr className="border-t border-gray-300" />

      <div className="flex flex-col lg:flex-row flex-grow">
        <div className="flex-1 bg-white p-4 border-r border-[#CACACA]">
          <h2 className="font-semibold text-lg mb-3 text-black">Ingresos</h2>
          
          <div className="flex justify-between mb-3 border border-[#CACACA] p-4 rounded">
            <div className="w-full">
              <h3 className="font-medium text-black">Ingresos Totales:</h3>
              <p className="text-black">${ingresosTotales}</p>
            </div>
            <div className="w-full">
              <h3 className="font-medium text-black">Total de Citas:</h3>
              <p className="text-black">50</p>
            </div>
          </div>

          <div className="flex flex-row items-center">
            <div className="my-4 max-w-[270px]">
              <Doughnut data={data} options={options} />
            </div>

            <div className="ml-4 flex flex-col">
              <div className="flex items-center mb-1 text-black">
                <span className="inline-block w-3 h-3 bg-yellow-500 mr-2"></span>
                <span>Servicios</span>
              </div>
              <div className="flex items-center mb-1 text-black">
                <span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>
                <span>Productos</span>
              </div>
              <div className="flex items-center mb-1 text-black">
                <span className="inline-block w-3 h-3 bg-blue-500 mr-2"></span>
                <span>Membresías</span>
              </div>
            </div>
          </div>

          <table className="mt-5 text-black w-full">
            <thead>
              <tr className="border-t border-[#CACACA]">
                <th className="text-left p-2">Tipo de Ingreso</th>
                <th className="text-center p-2">Precio</th>
                <th className="text-center p-2">Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#CACACA]">
                <td className="flex items-center p-2">
                  <span className="inline-block w-2 h-6 bg-yellow-500 mr-2"></span>
                  Servicios
                </td>
                <td className="text-center p-2">${serviciosIngresos}</td>
                <td className="text-center p-2">{((serviciosIngresos / ingresosTotales) * 100).toFixed(2)}%</td>
              </tr>
              <tr className="border-t border-[#CACACA]">
                <td className="flex items-center p-2">
                  <span className="inline-block w-2 h-6 bg-green-500 mr-2"></span>
                  Productos
                </td>
                <td className="text-center p-2">${productosIngresos}</td>
                <td className="text-center p-2">{((productosIngresos / ingresosTotales) * 100).toFixed(2)}%</td>
              </tr>
              <tr className="border-t border-[#CACACA]">
                <td className="flex items-center p-2">
                  <span className="inline-block w-2 h-6 bg-blue-500 mr-2"></span>
                  Membresías
                </td>
                <td className="text-center p-2">${membresiasIngresos}</td>
                <td className="text-center p-2">{((membresiasIngresos / ingresosTotales) * 100).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 max-w-[320px] w-full lg:ml-4 border border-[#CACACA] rounded mt-5">
          <div className="flex justify-between mb-4">
            <div className="flex flex-col w-full">
              <p className="font-light text-gray-500 text-[0.75rem]">Citas</p>
              <p className="font-bold text-black">50</p>
            </div>
            <div className="flex flex-col w-full">
              <p className="font-light text-gray-500 text-[0.75rem]">Tiempo Reservado</p>
              <p className="font-bold text-black">20 horas</p>
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <div className="flex justify-between mb-4">
              <div className="flex flex-col w-full">
                <p className="font-light text-gray-500 text-[0.75rem]">Confirmadas</p>
                <p className="font-bold text-black">30</p>
              </div>
              <div className="flex flex-col w-full">
                <p className="font-light text-gray-500 text-[0.75rem]">Finalizadas</p>
                <p className="font-bold text-black">25</p>
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex flex-col w-full">
                <p className="font-light text-gray-500 text-[0.75rem]">Inasistencias</p>
                <p className="font-bold text-black">5</p>
              </div>
              <div className="flex flex-col w-full">
                <p className="font-light text-gray-500 text-[0.75rem]">Canceladas</p>
                <p className="font-bold text-black">2</p>
              </div>
            </div>
          </div>

          <h2 className="font-semibold text-lg mb-3 text-black">Informes</h2>
<div className="border-t border-[#CACACA] pt-2">
  <div className="flex justify-between items-center mb-2 p-2 hover:bg-gray-200 cursor-pointer">
    <p className="font-light text-black">Resumen de Ventas</p>
    <img src="/img/chevron.svg" alt="Chevron" className="w-6 h-6" />
  </div>
  <div className="flex justify-between items-center mb-2 p-2 hover:bg-gray-200 cursor-pointer">
    <p className="font-light text-black">Ventas por Producto</p>
    <img src="/img/chevron.svg" alt="Chevron" className="w-6 h-6" />
  </div>
  <div className="flex justify-between items-center mb-2 p-2 hover:bg-gray-200 cursor-pointer">
    <p className="font-light text-black">Ventas por Servicio</p>
    <img src="/img/chevron.svg" alt="Chevron" className="w-6 h-6" />
  </div>
</div>

        
        </div>
        
      </div>
    </div>
  );
};

export default Reportess;

'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface VentasGenerales {
  diaria: number;
  semanal: number;
  mensual: number;
  anual: number;
  transacciones: number;
  promedioVenta: number;
}

interface Cliente {
  id: number;
  nombre: string;
  sucursal: string;
  ultimaVisita: string;
  frecuenciaVisitas: string;
  tipo: 'nuevo' | 'recurrente';
  activo: boolean;
}

interface Barbero {
  id: number;
  nombre: string;
  sucursal: string;
  clientesAtendidos: number;
  ingresosGenerados: number;
  serviciosRealizados: number;
}

interface Sucursal {
  id: number;
  nombre: string;
  ventas: number;
  citas: number;
  membresiasActivas: number;
}

interface Servicio {
  tipo: string;
  ventas: number;
}

const NuevosReportes: React.FC = () => {
  // Datos dummy para Ventas Generales
  const ventasGenerales: VentasGenerales = {
    diaria: 1200,
    semanal: 8400,
    mensual: 36000,
    anual: 432000,
    transacciones: 150,
    promedioVenta: 80,
  };

  // Datos dummy para Gráfico de Ventas (últimos 30 días)
  const datosVentas30Dias = {
    labels: Array.from({ length: 30 }, (_, i) => `Día ${i + 1}`),
    datasets: [
      {
        label: 'Ventas',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 500),
        backgroundColor: '#4F46E5', // Color morado moderno
        borderColor: '#3730A3',
        borderWidth: 1,
      },
    ],
  };

  // Datos dummy para Clientes Registrados
  const clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', sucursal: 'Centro', ultimaVisita: '2023-10-01', frecuenciaVisitas: 'Semanal', tipo: 'recurrente', activo: true },
    { id: 2, nombre: 'Ana Gómez', sucursal: 'Norte', ultimaVisita: '2023-09-15', frecuenciaVisitas: 'Quincenal', tipo: 'recurrente', activo: false },
    { id: 3, nombre: 'Luis Martínez', sucursal: 'Sur', ultimaVisita: '2023-10-05', frecuenciaVisitas: 'Mensual', tipo: 'nuevo', activo: true },
    { id: 4, nombre: 'Marta Sánchez', sucursal: 'Centro', ultimaVisita: '2023-08-20', frecuenciaVisitas: 'Semanal', tipo: 'recurrente', activo: true },
  ];

 

  // Datos dummy para Barberos (ampliados)
  const barberos: Barbero[] = [
    { id: 1, nombre: 'Carlos López', sucursal: 'Centro', clientesAtendidos: 50, ingresosGenerados: 5000, serviciosRealizados: 60 },
    { id: 2, nombre: 'Pedro Ramírez', sucursal: 'Norte', clientesAtendidos: 45, ingresosGenerados: 4500, serviciosRealizados: 55 },
    { id: 3, nombre: 'Miguel Torres', sucursal: 'Sur', clientesAtendidos: 40, ingresosGenerados: 4000, serviciosRealizados: 50 },
    { id: 4, nombre: 'Jorge Díaz', sucursal: 'Centro', clientesAtendidos: 35, ingresosGenerados: 3500, serviciosRealizados: 45 },
    { id: 5, nombre: 'Alejandro Ruiz', sucursal: 'Norte', clientesAtendidos: 30, ingresosGenerados: 3000, serviciosRealizados: 40 },
    { id: 6, nombre: 'Fernando Gómez', sucursal: 'Sur', clientesAtendidos: 25, ingresosGenerados: 2500, serviciosRealizados: 35 },
  ];

  // Datos dummy para Sucursales
  const sucursales: Sucursal[] = [
    { id: 1, nombre: 'Sucursal Centro', ventas: 10000, citas: 120, membresiasActivas: 50 },
    { id: 2, nombre: 'Sucursal Norte', ventas: 8000, citas: 100, membresiasActivas: 40 },
    { id: 3, nombre: 'Sucursal Sur', ventas: 9000, citas: 110, membresiasActivas: 45 },
  ];

  // Datos dummy para Servicios
  const servicios: Servicio[] = [
    { tipo: 'Corte Regular', ventas: 5000 },
    { tipo: 'Corte con Barba', ventas: 3000 },
    { tipo: 'Delineado', ventas: 2000 },
  ];

  // Datos dummy para No Shows
  const noShows = 10; // Tasa de no shows en porcentaje

  // Sucursal seleccionada
  const sucursalSeleccionada = sucursales[0]; // Ejemplo: Sucursal Centro

  

  return (
    <div className="flex flex-col space-y-8 p-6 bg-gray-50">
      {/* Sección General */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ventas Generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <p className="text-sm font-medium">Ventas Diarias</p>
            <p className="text-2xl font-bold">${ventasGenerales.diaria}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <p className="text-sm font-medium">Ventas Semanales</p>
            <p className="text-2xl font-bold">${ventasGenerales.semanal}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <p className="text-sm font-medium">Ventas Mensuales</p>
            <p className="text-2xl font-bold">${ventasGenerales.mensual}</p>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-4 text-white">
            <p className="text-sm font-medium">Ventas Anuales</p>
            <p className="text-2xl font-bold">${ventasGenerales.anual}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Número de Transacciones</h3>
            <p className="text-2xl font-bold text-gray-800">{ventasGenerales.transacciones}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Promedio de Venta</h3>
            <p className="text-2xl font-bold text-gray-800">${ventasGenerales.promedioVenta}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Ventas de los Últimos 30 Días</h3>
        <div className="bg-white p-4 rounded-lg shadow-inner">
          <Bar
            data={datosVentas30Dias}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
              scales: {
                y: { beginAtZero: true, grid: { color: '#E5E7EB' } },
                x: { grid: { display: false } },
              },
            }}
          />
        </div>
      </div>

     {/* Tabla de Clientes Registrados */}
<div className="bg-white rounded-lg shadow-md p-6">
  {/* Título y filtro */}
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold text-gray-800">
      Clientes Registrados <span className="text-gray-600 text-lg">({clientes.length})</span>
    </h2>
    <select className="border border-gray-300 rounded-md p-2 text-gray-700">
      <option value="todas">Todas las Sucursales</option>
      <option value="sucursal1">Sucursal 1</option>
      <option value="sucursal2">Sucursal 2</option>
      <option value="sucursal3">Sucursal 3</option>
      <option value="sucursal4">Sucursal 4</option>
    </select>
  </div>

  {/* Tabla */}
  <div className="overflow-x-auto">
    <table className="w-full text-left text-gray-700">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Nombre</th>
          <th className="p-3">Sucursal</th>
          <th className="p-3">Última Visita</th>
          <th className="p-3">Frecuencia</th>
          <th className="p-3">Tipo</th>
          <th className="p-3">Estado</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id} className="border-b hover:bg-gray-50">
            <td className="p-3">{cliente.nombre}</td>
            <td className="p-3">{cliente.sucursal}</td>
            <td className="p-3">{cliente.ultimaVisita}</td>
            <td className="p-3">{cliente.frecuenciaVisitas}</td>
            <td className="p-3">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  cliente.tipo === 'nuevo'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {cliente.tipo}
              </span>
            </td>
            <td className="p-3">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  cliente.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {cliente.activo ? 'Activo' : 'Inactivo'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        {/* Tabla de Barberos */}
        <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Desempeño de Barberos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Sucursal</th>
                <th className="p-3">Clientes Atendidos</th>
                <th className="p-3">Ingresos Generados</th>
                <th className="p-3">Servicios Realizados</th>
              </tr>
            </thead>
            <tbody>
              {barberos.map((barbero) => (
                <tr key={barbero.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{barbero.nombre}</td>
                  <td className="p-3">{barbero.sucursal}</td>
                  <td className="p-3">{barbero.clientesAtendidos}</td>
                  <td className="p-3">${barbero.ingresosGenerados}</td>
                  <td className="p-3">{barbero.serviciosRealizados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Análisis por Sucursal */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Análisis por Sucursal</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Sucursal</th>
                <th className="p-3">Ventas</th>
                <th className="p-3">Citas</th>
              </tr>
            </thead>
            <tbody>
              {sucursales.map((sucursal) => (
                <tr key={sucursal.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{sucursal.nombre}</td>
                  <td className="p-3">${sucursal.ventas}</td>
                  <td className="p-3">{sucursal.citas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección Específica de la Sucursal Seleccionada */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Servicios y promociones
        </h2>
        <p className="text-gray-600 mb-6">
         
        </p>

        {/* Tabla de Servicios y Promociones */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Servicios y Promociones</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Tipo de Servicio</th>
                  <th className="p-3">Ventas</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((servicio) => (
                  <tr key={servicio.tipo} className="border-b hover:bg-gray-50">
                    <td className="p-3">{servicio.tipo}</td>
                    <td className="p-3">${servicio.ventas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Tabla de Membresías Activas por Sucursal */}
<div className="mb-8">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Membresías Activas por Sucursal</h3>
  <div className="overflow-x-auto">
    <table className="w-full text-left text-gray-700">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Sucursal</th>
          <th className="p-3">Membresías Activas</th>
        </tr>
      </thead>
      <tbody>
        {sucursales.map((sucursal) => (
          <tr key={sucursal.id} className="border-b hover:bg-gray-50">
            <td className="p-3">{sucursal.nombre}</td>
            <td className="p-3">{sucursal.membresiasActivas}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        {/* Indicadores de Mercado y Operación */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Indicadores de Mercado y Operación</h3>
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <p className="text-black">Tasa de No Shows: {noShows}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevosReportes;
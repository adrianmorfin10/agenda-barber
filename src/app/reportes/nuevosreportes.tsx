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
import LocalService from '../services/LocalService';
const localesObejct = new LocalService();
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface VentasGenerales {
  diaria: number;
  semanal: number;
  mensual: number;
  anual: number;
  transacciones?: number;
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

const NuevosReportes = ({ data }:{ data?: any }) => {
  // Datos dummy para Ventas Generales
  const [ ventasGenerales, setVentasGenerales ] = React.useState<VentasGenerales>({
    diaria: 1200,
    semanal: 8400,
    mensual: 36000,
    anual: 432000,
    transacciones: 150,
    promedioVenta: 80,
  })
  const [ sucursales, setSucursales ] = React.useState<any[]>([])
  const [ selectedSucursalId, setSelectedSucursalId ] = React.useState<string>("")
  const [ ventasBarbero, setVentasBarbero ] = React.useState([]);
  const [ ventasClientes, setVentasClientes ] = React.useState([]);
  React.useEffect(()=>{
    localesObejct.getLocales().then((locales:any[])=>{
      setSucursales(locales);
    });
  },[])
  React.useEffect(()=>{
    if(!data)
      return;
    setVentasBarbero(data.ventasPorBarbero)
    setVentasClientes(data.ventasPorCliente)
    setVentasGenerales({
      ...ventasGenerales,
      diaria: data.ventasDiarias,
      semanal: data.ventasSemanales,
      mensual: data.ventasMensuales,
      anual: data.ventasAnuales
    })
  },[data])
  // Datos dummy para Gráfico de Ventas (últimos 30 días)
  const ventasDiariasUltimos30Ordenadas = (data?.ventasDiariasUltimos30 || []).sort((a:any, b:any) => a.day - b.day);
  const datosVentas30Dias = {
    labels:  ventasDiariasUltimos30Ordenadas.map((item:any) => `Día ${item.day}`),
    datasets: [
      {
        label: 'Ventas',
        data: ventasDiariasUltimos30Ordenadas.map((item:any)=>item.total_ventas),
        backgroundColor: '#4F46E5', // Color morado moderno
        borderColor: '#3730A3',
        borderWidth: 1,
      },
    ],
  };

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

        {
          /**
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
           */
        }
        

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
    
      {/* Título y filtro */}
      {
        /*
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Clientes Registrados <span className="text-gray-600 text-lg">({clientes.length})</span>
          </h2>
          
        </div>

        
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
      */}
    
      {/* Tabla de Clientes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Clientes</h2>
        <div className="overflow-x-auto">
          <select 
            className="border border-gray-300 rounded-md p-2 text-gray-700 mb-2" 
            name="sucursal"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { 
              setSelectedSucursalId(e.target.value);
              const newsVentaClientes = data.ventasPorCliente.filter((item:any)=>(e.target.value === "" || item.local_id === e.target.value))
             
              setVentasClientes(newsVentaClientes)
            }} 
            value={selectedSucursalId || ''}
          >
            <option value={''}>Todos los locales</option>
            {
              sucursales.map((item: any) => (
                <option key={`local-key-${item.id}`} value={item.id}>{item.nombre}</option>
              ))
            }
          </select>
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Nombre</th>
                { /*<th className="p-3">{barbero.clientesAtendidos}</th> */ }
                <th className="p-3">Cantidad de compras</th>
                <th className="p-3">Total gastado</th>
                
              </tr>
            </thead>
            <tbody>
            {
              ventasClientes.map((item: any, i) => (
                <tr key={`venta-cliente-${i}`} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.nombre_cliente}</td>
                  <td className="p-3">{item.cantidad}</td>
                  <td className="p-3">${item.total_ventas}</td>
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
          <select 
            className="border border-gray-300 rounded-md p-2 text-gray-700 mb-2" 
            name="sucursal"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { 
              setSelectedSucursalId(e.target.value);
              const newsVentaBarberos = data.ventasPorBarbero.filter((item:any)=>(e.target.value === "" ||item.local_id === e.target.value))
              
              setVentasBarbero(newsVentaBarberos)
            }} 
            value={selectedSucursalId || ''}
          >
            <option value={''}>Todos los locales</option>
            {
              sucursales.map((item: any) => (
                <option key={`local-key-${item.id}`} value={item.id}>{item.nombre}</option>
              ))
            }
          </select>
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Sucursal</th>
                { /*<th className="p-3">{barbero.clientesAtendidos}</th> */ }
                <th className="p-3">Ingresos Generados</th>
                <th className="p-3">Cantidad de ventas</th>
              </tr>
            </thead>
            <tbody>
            {
              ventasBarbero.map((item: any, i) => (
                <tr key={`venta-barbero-${i}`} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.nombre_barbero}</td>
                  <td className="p-3">{item.nombre_local}</td>
                  <td className="p-3">${item.total_ventas}</td>
                  <td className="p-3">{item.cantidad}</td>
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
                <th className="p-3">Cantidad</th>
                
              </tr>
            </thead>
            <tbody>
              {(data?.ventasPorSucursal || []).map((sucursal:any, i:any) => (
                <tr key={`row-branch-${i}`} className="border-b hover:bg-gray-50">
                  <td className="p-3">{sucursal.nombre_local}</td>
                  <td className="p-3">${sucursal.total_ventas}</td>
                  <td className="p-3">{sucursal.cantidad}</td>
                  {/** <td className="p-3">{sucursal.citas}</td>*/}
                  
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Tipo de Servicio</th>
                  <th className="p-3">Ventas</th>
                  <th className="p-3">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {(data?.ventasByReservaciones || []).map((servicio:any) => (
                  <tr key={servicio.tipo} className="border-b hover:bg-gray-50">
                    <td className="p-3">{servicio.nombre}</td>
                    <td className="p-3">${servicio.total_ventas}</td>
                    <td className="p-3">{servicio.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* 
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
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Indicadores de Mercado y Operación</h3>
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <p className="text-black">Tasa de No Shows: {noShows}%</p>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default NuevosReportes;
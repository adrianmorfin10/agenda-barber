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
import moment from 'moment';
import ReporteService, { EstadoCliente } from '../services/ReporteService';
import FiltrosCompletos from './FiltrosCompletos';
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

interface NuevosReportesProps{
  sucursales:any[], 
  data?: any, 
  setOrderByAndFilter: (filter:any,order:any)=>void ,
}
const NuevosReportes = ({ data, sucursales, setOrderByAndFilter }:NuevosReportesProps) => {
  // Estados para datos
  const [ventasGenerales, setVentasGenerales] = React.useState<VentasGenerales>({
    diaria: 1200,
    semanal: 8400,
    mensual: 36000,
    anual: 432000,
    transacciones: 150,
    promedioVenta: 80,
  });
  
  const [ventasBarbero, setVentasBarbero] = React.useState<any[]>([]);
  const [ventasClientes, setVentasClientes] = React.useState<any[]>([]);
  const [ventasServicios, setVentasServicios] = React.useState<any[]>([]);
  const [ventasSucursales, setVentasSucursales] = React.useState<any[]>([]);
  const [mesSeleccionado, setMesSeleccionado] = React.useState<number>(moment().month());
  const [anoSeleccionado, setAnoSeleccionado] = React.useState<number>(moment().year());

  const [order, setOrder] = React.useState({})
  const [ filters, setFilters ] = React.useState({})
  

  React.useEffect(()=>{
    setOrderByAndFilter(filters, order);
  }, [order, filters]);

  React.useEffect(() => {
    if (!data) return;
    
    setVentasBarbero(data.ventasPorBarbero);
    setVentasClientes(data.ventasPorCliente);
    // Ordenar servicios por ventas de mayor a menor por defecto
    setVentasServicios(data.ventasByReservaciones);
    setVentasSucursales(data.ventasPorSucursal || []);
    
    setVentasGenerales({
      ...ventasGenerales,
      diaria: data.ventasDiarias,
      semanal: data.ventasSemanales,
      mensual: data.ventasMensuales,
      anual: data.ventasAnuales
    });
  }, [data]);

 
  // Función para aplicar filtros comunes
  const aplicarFiltros = (filter:any) => {
    setFilters(filter)
  }



 
 
  

  // Función para obtener los días del mes seleccionado
  const obtenerDiasDelMes = () => {
    const fecha = moment().month(mesSeleccionado).year(anoSeleccionado);
    const diasEnMes = fecha.daysInMonth();
    return Array.from({length: diasEnMes}, (_, i) => i + 1);
  };

  // Función para formatear la fecha completa
  const formatearFechaCompleta = (dia: number) => {
    return moment()
      .month(mesSeleccionado)
      .year(anoSeleccionado)
      .date(dia)
      .format('DD/MM/YYYY');
  };

  // Datos para gráfico
  const ventasDiariasUltimos30Ordenadas = (data?.ventasDiariasUltimos30 || []).sort((a: any, b: any) => a.day - b.day);
  const diasDelMes = obtenerDiasDelMes();
  
  // Crear datos para el mes seleccionado
  const datosVentasMes = {
    labels: diasDelMes.map(dia => formatearFechaCompleta(dia)),
    datasets: [
      {
        label: 'Ventas',
        data: diasDelMes.map(dia => {
          const ventaDia = ventasDiariasUltimos30Ordenadas.find((v: any) => 
            moment(v.fecha).date() === dia && 
            moment(v.fecha).month() === mesSeleccionado && 
            moment(v.fecha).year() === anoSeleccionado
          );
          return ventaDia ? ventaDia.total_ventas : 0;
        }),
        backgroundColor: '#4F46E5',
        borderColor: '#3730A3',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col space-y-8 p-4 md:p-6 bg-gray-50">
      
      {/* Sección General */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ventas Generales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            <p className="text-2xl font-bold text-gray-800">{data?.ventasNumeroPromedios?.length ? data.ventasNumeroPromedios[0].cantidad : ""}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Promedio de Venta</h3>
            <p className="text-2xl font-bold text-gray-800">${data?.ventasNumeroPromedios?.length ? Number(data.ventasNumeroPromedios[0].promedio_ventas).toFixed(2) : ""}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Ventas del mes</h3>
        <div className="bg-white p-4 rounded-lg shadow-inner">
          <Bar
            data={datosVentasMes}
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

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Filtros generales</h2>
        <FiltrosCompletos
          sucursales={sucursales}
          onFiltrar={aplicarFiltros}
        />
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Clientes</h2>
        <div className="h-[500px] overflow-y-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3 cursor-pointer" onClick={()=>{
                  setOrder((prev:any)=>({ ...prev, cliente: { field: 'cantidad', criteria: prev.cliente?.field === "cantidad" ? (prev.cliente?.criteria === "ASC" ? "DESC" : "ASC") : "ASC" } }))
                }} >Compras</th>
                <th className="p-3 cursor-pointer" onClick={()=>{
                  setOrder((prev:any)=>({ ...prev, cliente: { field: 'total_ventas', criteria: prev.cliente?.field === "total_ventas" ? (prev.cliente?.criteria === "ASC" ? "DESC" : "ASC") : "ASC" } }))
                }} >Total gastado</th>
                <th className="p-3">Última visita</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventasClientes.map((item, i) => {
                const estado = ReporteService.getEstadoCliente(moment(item.ultima_venta).local().toDate())
                  return (
                  <tr key={`venta-cliente-${i}`} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.nombre_cliente}</td>
                    <td className="p-3">{item.cantidad}</td>
                    <td className="p-3">${item.total_ventas}</td>
                    <td className="p-3">{moment(item.ultima_venta).local().format('DD-MMM-YYYY, HH:mm')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        estado === EstadoCliente.ACTIVO
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800' 
                      }`}>
                        {estado}
                      </span>
                    </td>
                  </tr>
                )}
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Barberos */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Desempeño de Barberos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Sucursal</th>
                <th className="p-3 cursor-pointer" onClick={()=>{
                  setOrder((prev:any)=>({ ...prev, barbero: { field: 'total_ventas', criteria: prev.barbero?.field === "total_ventas" ? (prev.barbero?.criteria === "ASC" ? "DESC" : "ASC") : "ASC" } }))
                }}>Ingresos</th>
                <th className="p-3 cursor-pointer" onClick={()=>{
                  setOrder((prev:any)=>({ ...prev, barbero: { field: 'cantidad', criteria: prev.barbero?.field === "cantidad" ? (prev.barbero?.criteria === "ASC" ? "DESC" : "ASC") : "ASC" } }))
                }}>Ventas</th>
              </tr>
            </thead>
            <tbody>
              {ventasBarbero.map((item, i) => (
                <tr key={`venta-barbero-${i}`} className="border-b hover:bg-white">
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
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Análisis por Sucursal</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Sucursal</th>
                <th className="p-3 cursor-pointer" onClick={()=>{
                    setOrder((prev:any)=>({ ...prev, sucursal: { field: 'total_ventas', criteria: prev.sucursal?.field === "total_ventas" ? (prev.sucursal?.criteria === "ASC" ? "DESC" : "ASC") : "ASC" } }))
                  }}>Ventas</th>
                <th className="p-3 cursor-pointer" onClick={()=>{
                    setOrder((prev:any)=>({ ...prev, sucursal: { field: 'cantidad', criteria: prev.sucursal?.field === "cantidad" ? (prev.sucursal?.criteria === "ASC" ? "DESC" : "ASC") : "ASC" } }))
                  }}>Transacciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasSucursales.map((sucursal, i) => (
                <tr key={`row-branch-${i}`} className="border-b hover:bg-gray-50">
                  <td className="p-3" >{sucursal.nombre_local}</td>
                  <td className="p-3" >${sucursal.total_ventas}</td>
                  <td className="p-3" >{sucursal.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Servicios */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Servicios</h2>
        <div className="h-[500px] overflow-y-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Servicio</th>
                <th className="p-3">Sucursal</th>
                <th className="p-3 cursor-pointer" onClick={()=>{
                    setOrder((prev:any)=>({ ...prev, servicio: { field: 'total_ventas', criteria: prev.servicio?.field === "total_ventas" ? (prev.servicio?.criteria === "ASC" ? "DESC" : "ASC") : "ASC" } }))
                  }}>Ventas</th>
                <th className="p-3 cursor-pointer" onClick={()=>{
                    setOrder((prev:any)=>({ ...prev, servicio: { field: 'cantidad_ventas', criteria: prev.servicio?.field === "cantidad_ventas" ? (prev.servicio?.criteria === "ASC" ? "DESC" : "ASC") : "ASC" } }))
                  }}>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {ventasServicios.map((servicio, i) => (
                <tr key={`servicio-${i}`} className="border-b hover:bg-gray-50">
                  <td className="p-3">{servicio.nombre}</td>
                  <td className="p-3">{servicio.local_nombre}</td>
                  <td className="p-3">
                    ${(Number(servicio.total_ventas_servicios || 0) + Number(servicio.total_ventas_reservaciones || 0))}
                  </td>
                  <td className="p-3">
                    {(Number(servicio.cantidad_ventas_servicios || 0) + Number(servicio.cantidad_ventas_reservaciones_servicios || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NuevosReportes;
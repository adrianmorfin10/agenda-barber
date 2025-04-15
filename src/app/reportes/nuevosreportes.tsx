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

interface NuevosReportesProps {
  sucursales: any[];
  data?: any;
  setOrderByAndFilter: (filter: any, order: any) => void;
}

const NuevosReportes = ({ data, sucursales, setOrderByAndFilter }: NuevosReportesProps) => {
  // Estados para datos
  const [ventasGenerales, setVentasGenerales] = React.useState<VentasGenerales>({
    diaria: 0,
    semanal: 0,
    mensual: 0,
    anual: 0,
    transacciones: 0,
    promedioVenta: 0,
  });
  
  const [ventasBarbero, setVentasBarbero] = React.useState<any[]>([]);
  const [ventasClientes, setVentasClientes] = React.useState<any[]>([]);
  const [ventasServicios, setVentasServicios] = React.useState<any[]>([]);
  const [ventasSucursales, setVentasSucursales] = React.useState<any[]>([]);
  const [mesSeleccionado, setMesSeleccionado] = React.useState<number>(moment().month());
  const [anoSeleccionado, setAnoSeleccionado] = React.useState<number>(moment().year());
  const [datosVentasMes, setDatosVentasMes] = React.useState<any>(null);
  const [sucursalSeleccionada, setSucursalSeleccionada] = React.useState<string>('todas');

  const [order, setOrder] = React.useState<any>({});
  const [filters, setFilters] = React.useState<any>({});

  React.useEffect(() => {
    setOrderByAndFilter(filters, order);
  }, [order, filters]);

  React.useEffect(() => {
    if (!data) return;
    
    setVentasBarbero(data.ventasPorBarbero || []);
    setVentasClientes(data.ventasPorCliente || []);
    setVentasServicios(data.ventasByReservaciones || []);
    setVentasSucursales(data.ventasPorSucursal || []);
    proccesSaleMonth(data.ventasDiariasUltimos30)
    setVentasGenerales({
      diaria: data.ventasDiarias || 0,
      semanal: data.ventasSemanales || 0,
      mensual: data.ventasMensuales || 0,
      anual: data.ventasAnuales || 0,
      transacciones: data.ventasNumeroPromedios?.length ? data.ventasNumeroPromedios[0].cantidad : 0,
      promedioVenta: data.ventasNumeroPromedios?.length ? Number(data.ventasNumeroPromedios[0].promedio_ventas) : 0,
    });
  }, [data]);

  // Función para aplicar filtros comunes
  const aplicarFiltros = (filter: any) => {
    setFilters(filter);
  };

  // Función para manejar el cambio de mes
  const handleMesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMesSeleccionado(Number(e.target.value));
    setFilters({
      ...filters,
      mes: Number(e.target.value) + 1, // Ajustar porque los meses en moment van de 0-11
      ano: anoSeleccionado
    });
  };

  // Función para manejar el cambio de año
  const handleAnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnoSeleccionado(Number(e.target.value));
    setFilters({
      ...filters,
      mes: mesSeleccionado + 1,
      ano: Number(e.target.value)
    });
  };

  // Función para manejar el cambio de sucursal
  const handleSucursalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSucursalSeleccionada(e.target.value);
    setFilters({
      ...filters,
      sucursal: e.target.value === 'todas' ? null : e.target.value
    });
  };

  // Función para ordenar datos
  const toggleSortOrder = (table: string, field: string) => {
    setOrder((prev: any) => ({
      ...prev,
      [table]: {
        field,
        criteria: prev[table]?.field === field 
          ? prev[table]?.criteria === "ASC" ? "DESC" : "ASC"
          : "DESC"
      }
    }));
  };

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

  const proccesSaleMonth = (ventasDiariasUltimos30:any[] = [])=>{
    // Datos para gráfico
    const ventasDiariasUltimos30Ordenadas = (ventasDiariasUltimos30 || []).sort((a: any, b: any) => a.day - b.day);
    const diasDelMes = obtenerDiasDelMes();
    
    // Crear datos para el mes seleccionado
    const datosVentasMes = {
      labels: ventasDiariasUltimos30Ordenadas.map(item => item.day),
      datasets: [
        {
          label: 'Ventas',
          data: ventasDiariasUltimos30Ordenadas.map(item => item.total_ventas),
          backgroundColor: '#4F46E5',
          borderColor: '#3730A3',
          borderWidth: 1,
        },
      ],
    };
    setDatosVentasMes(datosVentasMes);
  }
  

  // Generar opciones de años (últimos 5 años)
  const anosOptions = Array.from({length: 5}, (_, i) => moment().year() - i);

  // Función para mostrar nombre de cliente o "Venta sin cliente"
  const mostrarNombreCliente = (nombre: string | null) => {
    return nombre || "Venta sin cliente";
  };

  return (
    <div className="flex flex-col space-y-8 p-4 md:p-6 bg-gray-50">
      {/* Sección General */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ventas Generales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <p className="text-sm font-medium">Ventas Diarias</p>
            <p className="text-2xl font-bold">${ventasGenerales.diaria.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <p className="text-sm font-medium">Ventas Semanales</p>
            <p className="text-2xl font-bold">${ventasGenerales.semanal.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <p className="text-sm font-medium">Ventas Mensuales</p>
            <p className="text-2xl font-bold">${ventasGenerales.mensual.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-4 text-white">
            <p className="text-sm font-medium">Ventas Anuales</p>
            <p className="text-2xl font-bold">${ventasGenerales.anual.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Número de Transacciones</h3>
            <p className="text-2xl font-bold text-gray-800">{ventasGenerales.transacciones}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Promedio de Venta</h3>
            <p className="text-2xl font-bold text-gray-800">${ventasGenerales.promedioVenta.toFixed(2)}</p>
          </div>
        </div>
      </div>
  
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Filtros generales</h2>
        <FiltrosCompletos
          sucursales={sucursales}
          onFiltrar={aplicarFiltros}
        />
      </div>
      
      {/* Sección General */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Grafica de ventas agrupada por dia</h3>
        <div className="bg-white p-4 rounded-lg shadow-inner">
          {
            datosVentasMes &&
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
          }
        </div>
      </div>

      

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Ordenar por:</span>
            <button 
              onClick={() => toggleSortOrder('cliente', 'cantidad')}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
            >
              Compras {order.cliente?.field === 'cantidad' ? 
                (order.cliente?.criteria === 'ASC' ? '↑' : '↓') : ''}
            </button>
            <button 
              onClick={() => toggleSortOrder('cliente', 'total_ventas')}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
            >
              Total gastado {order.cliente?.field === 'total_ventas' ? 
                (order.cliente?.criteria === 'ASC' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
        <div className="h-[500px] overflow-y-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Compras</th>
                <th className="p-3">Total gastado</th>
                <th className="p-3">Última visita</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventasClientes.map((item, i) => {
                const estado = item.ultima_venta 
                  ? ReporteService.getEstadoCliente(moment(item.ultima_venta).local().toDate())
                  : "Sin visitas";
                return (
                  <tr key={`venta-cliente-${i}`} className="border-b hover:bg-gray-50">
                    <td className="p-3">{mostrarNombreCliente(item.nombre_cliente)}</td>
                    <td className="p-3">{item.cantidad}</td>
                    <td className="p-3">${item.total_ventas?.toLocaleString() || '0'}</td>
                    <td className="p-3">
                      {item.ultima_venta 
                        ? moment(item.ultima_venta).local().format('DD-MMM-YYYY, HH:mm') 
                        : 'N/A'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        estado === EstadoCliente.ACTIVO
                        ? 'bg-green-100 text-green-800'
                        : estado === "Sin visitas"
                        ? 'bg-gray-100 text-gray-800'
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Desempeño de Barberos</h2>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Ordenar por:</span>
            <button 
              onClick={() => toggleSortOrder('barbero', 'total_ventas')}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
            >
              Ingresos {order.barbero?.field === 'total_ventas' ? 
                (order.barbero?.criteria === 'ASC' ? '↑' : '↓') : ''}
            </button>
            <button 
              onClick={() => toggleSortOrder('barbero', 'cantidad')}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
            >
              Ventas {order.barbero?.field === 'cantidad' ? 
                (order.barbero?.criteria === 'ASC' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Sucursal</th>
                <th className="p-3">Ingresos</th>
                <th className="p-3">Ventas</th>
              </tr>
            </thead>
            <tbody>
              {ventasBarbero.map((item, i) => (
                <tr key={`venta-barbero-${i}`} className="border-b hover:bg-white">
                  <td className="p-3">{item.nombre_barbero}</td>
                  <td className="p-3">{item.nombre_local}</td>
                  <td className="p-3">${item.total_ventas?.toLocaleString() || '0'}</td>
                  <td className="p-3">{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Análisis por Sucursal */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Análisis por Sucursal</h2>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Ordenar por:</span>
            <button 
              onClick={() => toggleSortOrder('sucursal', 'total_ventas')}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
            >
              Ventas {order.sucursal?.field === 'total_ventas' ? 
                (order.sucursal?.criteria === 'ASC' ? '↑' : '↓') : ''}
            </button>
            <button 
              onClick={() => toggleSortOrder('sucursal', 'cantidad')}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
            >
              Transacciones {order.sucursal?.field === 'cantidad' ? 
                (order.sucursal?.criteria === 'ASC' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Sucursal</th>
                <th className="p-3">Ventas</th>
                <th className="p-3">Transacciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasSucursales.map((sucursal, i) => (
                <tr key={`row-branch-${i}`} className="border-b hover:bg-gray-50">
                  <td className="p-3">{sucursal.nombre_local}</td>
                  <td className="p-3">${sucursal.total_ventas?.toLocaleString() || '0'}</td>
                  <td className="p-3">{sucursal.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Servicios */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Servicios</h2>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Ordenar por:</span>
            <button 
              onClick={() => toggleSortOrder('servicio', 'total_ventas')}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
            >
              Ventas {order.servicio?.field === 'total_ventas' ? 
                (order.servicio?.criteria === 'ASC' ? '↑' : '↓') : ''}
            </button>
            <button 
              onClick={() => toggleSortOrder('servicio', 'cantidad_ventas')}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
            >
              Cantidad {order.servicio?.field === 'cantidad_ventas' ? 
                (order.servicio?.criteria === 'ASC' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
        <div className="h-[500px] overflow-y-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Servicio</th>
                <th className="p-3">Sucursal</th>
                <th className="p-3">Ventas</th>
                <th className="p-3">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {ventasServicios.map((servicio, i) => (
                <tr key={`servicio-${i}`} className="border-b hover:bg-gray-50">
                  <td className="p-3">{servicio.nombre}</td>
                  <td className="p-3">{servicio.local_nombre}</td>
                  <td className="p-3">
                    ${(Number(servicio.total_ventas_servicios || 0) + Number(servicio.total_ventas_reservaciones || 0)).toLocaleString()}
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
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
import ReporteService from '../services/ReporteService';

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

const NuevosReportes = ({ data }:{ data?: any }) => {
  // Estados para datos
  const [ventasGenerales, setVentasGenerales] = React.useState<VentasGenerales>({
    diaria: 1200,
    semanal: 8400,
    mensual: 36000,
    anual: 432000,
    transacciones: 150,
    promedioVenta: 80,
  });
  
  const [sucursales, setSucursales] = React.useState<any[]>([]);
  const [ventasBarbero, setVentasBarbero] = React.useState<any[]>([]);
  const [ventasClientes, setVentasClientes] = React.useState<any[]>([]);
  const [ventasServicios, setVentasServicios] = React.useState<any[]>([]);
  const [ventasSucursales, setVentasSucursales] = React.useState<any[]>([]);

  // Estados para filtros
  const [selectedSucursalId, setSelectedSucursalId] = React.useState<string>("");
  const [fechaInicio, setFechaInicio] = React.useState<string>('');
  const [fechaFin, setFechaFin] = React.useState<string>('');
  const [ordenClientes, setOrdenClientes] = React.useState<string>('');
  const [ordenBarberos, setOrdenBarberos] = React.useState<string>('');

  React.useEffect(() => {
    localesObejct.getLocales().then((locales: any[]) => {
      setSucursales(locales);
    });
  }, []);

  React.useEffect(() => {
    if (!data) return;
    
    setVentasBarbero(data.ventasPorBarbero);
    setVentasClientes(data.ventasPorCliente);
    // Ordenar servicios por ventas de mayor a menor por defecto
    setVentasServicios([...data.ventasByReservaciones].sort((a, b) => {
      const totalA = (Number(a.total_ventas_servicios || 0) + Number(a.total_ventas_reservaciones || 0));
      const totalB = (Number(b.total_ventas_servicios || 0) + Number(b.total_ventas_reservaciones || 0));
      return totalB - totalA;
    }));
    setVentasSucursales(data.ventasPorSucursal || []);
    
    setVentasGenerales({
      ...ventasGenerales,
      diaria: data.ventasDiarias,
      semanal: data.ventasSemanales,
      mensual: data.ventasMensuales,
      anual: data.ventasAnuales
    });
  }, [data]);

  // Función para limpiar todos los filtros
  const limpiarFiltros = () => {
    setSelectedSucursalId("");
    setFechaInicio('');
    setFechaFin('');
    setOrdenClientes('');
    setOrdenBarberos('');
    
    if (data) {
      setVentasBarbero(data.ventasPorBarbero);
      setVentasClientes(data.ventasPorCliente);
      setVentasServicios([...data.ventasByReservaciones].sort((a, b) => {
        const totalA = (Number(a.total_ventas_servicios || 0) + Number(a.total_ventas_reservaciones || 0));
        const totalB = (Number(b.total_ventas_servicios || 0) + Number(b.total_ventas_reservaciones || 0));
        return totalB - totalA;
      }));
      setVentasSucursales(data.ventasPorSucursal || []);
    }
  };

  // Función para aplicar filtros comunes
  const aplicarFiltros = (datos: any[], campoFecha: string) => {
    let filtered = [...datos];
    
    // Filtro por sucursal
    if (selectedSucursalId) {
      filtered = filtered.filter(item => item.local_id === selectedSucursalId);
    }
    
    // Filtro por fecha
    if (fechaInicio || fechaFin) {
      filtered = filtered.filter(item => {
        const fechaItem = moment(item[campoFecha]).local();
        const cumpleInicio = !fechaInicio || fechaItem.isSameOrAfter(moment(fechaInicio), 'day');
        const cumpleFin = !fechaFin || fechaItem.isSameOrBefore(moment(fechaFin), 'day');
        return cumpleInicio && cumpleFin;
      });
    }
    
    return filtered;
  }

  // Funciones específicas para cada tabla
  const aplicarFiltrosClientes = () => {
    let filtered = aplicarFiltros(data.ventasPorCliente, 'ultima_venta');
    
    if (ordenClientes) {
      filtered.sort((a, b) => ordenClientes === 'asc' ? a.cantidad - b.cantidad : b.cantidad - a.cantidad);
    }
    
    setVentasClientes(filtered);
  }

  const aplicarFiltrosBarberos = () => {
    let filtered = aplicarFiltros(data.ventasPorBarbero, 'fecha_venta');
    
    if (ordenBarberos) {
      filtered.sort((a, b) => ordenBarberos === 'asc' ? a.total_ventas - b.total_ventas : b.total_ventas - a.total_ventas);
    }
    
    setVentasBarbero(filtered);
  }

  const aplicarFiltrosServicios = () => {
    let filtered = data.ventasByReservaciones;
    
    if (selectedSucursalId) {
      filtered = filtered.filter((item: any) => item.local_id === selectedSucursalId);
    }
    
    if (fechaInicio || fechaFin) {
      filtered = filtered.filter((item: any) => {
        const fechaVenta = moment(item.fecha_venta).local();
        const cumpleInicio = !fechaInicio || fechaVenta.isSameOrAfter(moment(fechaInicio), 'day');
        const cumpleFin = !fechaFin || fechaVenta.isSameOrBefore(moment(fechaFin), 'day');
        return cumpleInicio && cumpleFin;
      });
    }
    
    // Ordenar siempre por ventas de mayor a menor
    setVentasServicios([...filtered].sort((a, b) => {
      const totalA = (Number(a.total_ventas_servicios || 0) + Number(a.total_ventas_reservaciones || 0));
      const totalB = (Number(b.total_ventas_servicios || 0) + Number(b.total_ventas_reservaciones || 0));
      return totalB - totalA;
    }));
  }

  const aplicarFiltrosSucursales = () => {
    let filtered = data.ventasPorSucursal;
    
    if (fechaInicio || fechaFin) {
      filtered = filtered.filter((item: any) => {
        const fechaItem = moment(item.fecha).local();
        const cumpleInicio = !fechaInicio || fechaItem.isSameOrAfter(moment(fechaInicio), 'day');
        const cumpleFin = !fechaFin || fechaItem.isSameOrBefore(moment(fechaFin), 'day');
        return cumpleInicio && cumpleFin;
      });
    }
    
    setVentasSucursales(filtered);
  }

  // Componente de filtros para clientes y barberos
  const FiltrosCompletos = ({ 
    onOrdenChange, 
    ordenValue,
    opcionesOrden,
    tipoDatos,
    onFiltrar
  }: {
    onOrdenChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    ordenValue: string,
    opcionesOrden: {value: string, label: string}[],
    tipoDatos: string,
    onFiltrar: () => void
  }) => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      <h3 className="font-medium text-gray-700 mb-3">Filtrar {tipoDatos}</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
          <select 
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            onChange={(e) => setSelectedSucursalId(e.target.value)}
            value={selectedSucursalId}
          >
            <option value="">Todas las sucursales</option>
            {sucursales.map((item) => (
              <option key={`local-${item.id}`} value={item.id}>{item.nombre}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            onChange={(e) => setFechaInicio(e.target.value)}
            value={fechaInicio}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            onChange={(e) => setFechaFin(e.target.value)}
            value={fechaFin}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select 
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            onChange={onOrdenChange}
            value={ordenValue}
          >
            {opcionesOrden.map(opcion => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-3 flex justify-end gap-2">
        <button
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
          onClick={limpiarFiltros}
        >
          Limpiar Filtros
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
          onClick={onFiltrar}
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );

  // Componente de filtros solo fechas (para sucursales)
  const FiltrosSoloFechas = ({ 
    tipoDatos,
    onFiltrar
  }: {
    tipoDatos: string,
    onFiltrar: () => void
  }) => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      <h3 className="font-medium text-gray-700 mb-3">Filtrar {tipoDatos}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            onChange={(e) => setFechaInicio(e.target.value)}
            value={fechaInicio}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            onChange={(e) => setFechaFin(e.target.value)}
            value={fechaFin}
          />
        </div>
      </div>
      
      <div className="mt-3 flex justify-end gap-2">
        <button
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
          onClick={limpiarFiltros}
        >
          Limpiar Filtros
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
          onClick={onFiltrar}
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );

  // Componente de filtros para servicios (sucursal y fechas)
  const FiltrosServicios = ({ 
    onFiltrar
  }: {
    onFiltrar: () => void
  }) => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      <h3 className="font-medium text-gray-700 mb-3">Filtrar servicios</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
          <select 
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            onChange={(e) => setSelectedSucursalId(e.target.value)}
            value={selectedSucursalId}
          >
            <option value="">Todas las sucursales</option>
            {sucursales.map((item) => (
              <option key={`local-${item.id}`} value={item.id}>{item.nombre}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            onChange={(e) => setFechaInicio(e.target.value)}
            value={fechaInicio}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
            onChange={(e) => setFechaFin(e.target.value)}
            value={fechaFin}
          />
        </div>
      </div>
      
      <div className="mt-3 flex justify-end gap-2">
        <button
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
          onClick={limpiarFiltros}
        >
          Limpiar Filtros
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
          onClick={onFiltrar}
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );

  // Datos para gráfico
  const ventasDiariasUltimos30Ordenadas = (data?.ventasDiariasUltimos30 || []).sort((a: any, b: any) => a.day - b.day);
  const datosVentas30Dias = {
    labels: ventasDiariasUltimos30Ordenadas.map((item: any) => `Día ${item.day}`),
    datasets: [
      {
        label: 'Ventas',
        data: ventasDiariasUltimos30Ordenadas.map((item: any) => item.total_ventas),
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

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Clientes</h2>
        
        <FiltrosCompletos
          onOrdenChange={(e) => setOrdenClientes(e.target.value)}
          ordenValue={ordenClientes}
          opcionesOrden={[
            {value: '', label: 'Orden predeterminado'},
            {value: 'desc', label: 'Mayor cantidad de compras'},
            {value: 'asc', label: 'Menor cantidad de compras'}
          ]}
          tipoDatos="clientes"
          onFiltrar={aplicarFiltrosClientes}
        />
        
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
              {ventasClientes.map((item, i) => (
                <tr key={`venta-cliente-${i}`} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.nombre_cliente}</td>
                  <td className="p-3">{item.cantidad}</td>
                  <td className="p-3">${item.total_ventas}</td>
                  <td className="p-3">{moment(item.ultima_venta).local().format('DD-MMM-YYYY, HH:mm')}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ReporteService.getEstadoCliente(moment(item.ultima_venta).local().toDate()) === 'Activo' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                    }`}>
                      {ReporteService.getEstadoCliente(moment(item.ultima_venta).local().toDate())}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Barberos */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Desempeño de Barberos</h2>
        
        <FiltrosCompletos
          onOrdenChange={(e) => setOrdenBarberos(e.target.value)}
          ordenValue={ordenBarberos}
          opcionesOrden={[
            {value: '', label: 'Orden predeterminado'},
            {value: 'desc', label: 'Mayores ingresos primero'},
            {value: 'asc', label: 'Menores ingresos primero'}
          ]}
          tipoDatos="barberos"
          onFiltrar={aplicarFiltrosBarberos}
        />
        
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
        
        <FiltrosSoloFechas
          tipoDatos="sucursales"
          onFiltrar={aplicarFiltrosSucursales}
        />
        
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
                  <td className="p-3">${sucursal.total_ventas}</td>
                  <td className="p-3">{sucursal.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Servicios */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Servicios</h2>
        
        <FiltrosServicios
          onFiltrar={aplicarFiltrosServicios}
        />
        
        <div className="overflow-x-auto">
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
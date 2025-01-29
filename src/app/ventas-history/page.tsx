"use client";

import React, { useState } from "react";
import SidebarVentas from "../components/SidebarVentas";
import { AppContext } from "../components/AppContext";
import VentaService from "../services/VentaService";
import moment from "moment";
const ventasObject = new VentaService();

// Define el tipo de las secciones
type SectionType = "Venta Rápida" | "Por Cobrar" | "Productos" | "Membresías" | "Ventas Realizadas";

const getName = (venta:any)=>{
  if(venta.venta_producto)
    return venta.venta_producto.producto.nombre;
  if(venta.venta_membresia)
    return venta.venta_membresia.membresia.nombre;
  if(venta.venta_servicio)
    return venta.venta_servicio.servicio.nombre;
  return `cita`
}
const VentasHistory: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>("Ventas Realizadas");
  const [filterType, setFilterType] = useState<'dia' | 'semana' | 'mes' | 'year'>('dia');
  const [sales, setSales] = useState<{id:number, hora: string; fecha: string, empleado: string, producto: string, precio: string, cliente: string}[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [state, dispatchState] = React.useContext(AppContext);
  React.useEffect(() => {
    
    if(!state.sucursal)
      return;
    
    ventasObject.getAll(state.sucursal.id, filterType).then((data:any)=>{
      console.log('mpara length', data.length)
      const salesHsitory = data.map((item:any)=>{
        const ventaDate = moment(item.fecha).add(-6, "hours");
      
        return{
          id: item.id,
          fecha: ventaDate.format("YYYY-MM-DD"),
          hora: ventaDate.format("HH:mm"),
          empleado: item.barbero.usuario.nombre,
          producto: getName(item),
          precio: `$${item.total}`,
          cliente: item.carrito_compra.cliente?.usuario?.nombre || "Cliente no encontrado"
        }
        
      });
      console.log('mpara length', salesHsitory.length)
      setSales(salesHsitory);
      
    }).catch((e:any)=>{
      
    })
  }, [state.sucursal, filterType]);
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (filterType === 'dia') newDate.setDate(newDate.getDate() - 1);
    if (filterType === 'semana') newDate.setDate(newDate.getDate() - 7);
    if (filterType === 'mes') newDate.setMonth(newDate.getMonth() - 1);
    if (filterType === 'year') newDate.setFullYear(newDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (filterType === 'dia') newDate.setDate(newDate.getDate() + 1);
    if (filterType === 'semana') newDate.setDate(newDate.getDate() + 7);
    if (filterType === 'mes') newDate.setMonth(newDate.getMonth() + 1);
    if (filterType === 'year') newDate.setFullYear(newDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  const formatDate = () => {
    if (filterType === 'dia') return currentDate.toLocaleDateString();
    if (filterType === 'semana') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    }
    if (filterType === 'mes') return currentDate.toLocaleDateString('default', { year: 'numeric', month: 'long' });
    if (filterType === 'year') return currentDate.getFullYear();
  };

  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.fecha);

    if (filterType === 'dia') return saleDate.toDateString() === currentDate.toDateString();
    if (filterType === 'semana') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return saleDate >= startOfWeek && saleDate <= endOfWeek;
    }
    if (filterType === 'mes') {
      return (
        saleDate.getFullYear() === currentDate.getFullYear() &&
        saleDate.getMonth() === currentDate.getMonth()
      );
    }
    if (filterType === 'year') {
      return saleDate.getFullYear() === currentDate.getFullYear();
    }

    return true;
  });
  console.log("sales", sales);
  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <SidebarVentas selectedSection={selectedSection} setSelectedSection={setSelectedSection} />

      {/* Contenido principal */}
      <div className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>

        {/* Filtro */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {['dia', 'semana', 'mes', 'year'].map((type) => (
              <button
                key={type}
                className={`p-2 rounded text-sm font-light ${
                  filterType === type ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
                onClick={() => setFilterType(type as 'dia' | 'semana' | 'mes' | 'year')}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          {
            // <div className="flex items-center justify-between mb-4">
            //   <button className="p-2 bg-black rounded text-white hover:bg-gray-400" onClick={handlePrev}>
            //     Anterior
            //   </button>
            //   <span className="text-xs font-bold text-black">{formatDate()}</span>
            //   <button className="p-2 bg-black rounded text-white hover:bg-gray-400" onClick={handleNext}>
            //     Siguiente
            //   </button>
            // </div>
          }
          
        </div>

        {/* Lista de ventas */}
        <div className="space-y-4">
          {sales.map((sale:any) => (
            <div
              key={`sale-${sale.id}`}
              className="p-4 border rounded bg-gray-50 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{sale.producto}</p>
                <p className="text-xs text-gray-600">
                  {sale.fecha} - {sale.hora} por {sale.empleado} a {sale.cliente}
                </p>
              </div>
              <span className="font-bold text-black">{sale.precio}</span>
            </div>
          ))}
          {sales.length === 0 && (
            <p className="text-gray-500 text-center">No hay ventas para este período.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VentasHistory;

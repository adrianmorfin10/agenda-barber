"use client";

import React, { useState } from "react";
import SidebarVentas from "../components/SidebarVentas";

// Define el tipo de las secciones
type SectionType = "Venta Rápida" | "Por Cobrar" | "Productos" | "Membresías" | "Ventas Realizadas";

// Datos de ejemplo para el historial de ventas
const salesHistory = [
  { id: 1, fecha: "2025-01-24", hora: "14:30", empleado: "Juan Pérez", producto: "Corte de cabello", precio: "$150.00" },
  { id: 2, fecha: "2025-01-23", hora: "10:00", empleado: "Ana Gómez", producto: "Tratamiento facial", precio: "$200.00" },
  { id: 3, fecha: "2025-01-22", hora: "16:15", empleado: "Carlos López", producto: "Manicure", precio: "$50.00" },
  { id: 4, fecha: "2025-01-21", hora: "12:00", empleado: "Marta Sánchez", producto: "Spa completo", precio: "$100.00" },
];

const VentasHistory: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>("Ventas Realizadas");
  const [filterType, setFilterType] = useState<'día' | 'semana' | 'mes' | 'año'>('día');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (filterType === 'día') newDate.setDate(newDate.getDate() - 1);
    if (filterType === 'semana') newDate.setDate(newDate.getDate() - 7);
    if (filterType === 'mes') newDate.setMonth(newDate.getMonth() - 1);
    if (filterType === 'año') newDate.setFullYear(newDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (filterType === 'día') newDate.setDate(newDate.getDate() + 1);
    if (filterType === 'semana') newDate.setDate(newDate.getDate() + 7);
    if (filterType === 'mes') newDate.setMonth(newDate.getMonth() + 1);
    if (filterType === 'año') newDate.setFullYear(newDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  const formatDate = () => {
    if (filterType === 'día') return currentDate.toLocaleDateString();
    if (filterType === 'semana') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    }
    if (filterType === 'mes') return currentDate.toLocaleDateString('default', { year: 'numeric', month: 'long' });
    if (filterType === 'año') return currentDate.getFullYear();
  };

  const filteredSales = salesHistory.filter((sale) => {
    const saleDate = new Date(sale.fecha);

    if (filterType === 'día') return saleDate.toDateString() === currentDate.toDateString();
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
    if (filterType === 'año') {
      return saleDate.getFullYear() === currentDate.getFullYear();
    }

    return true;
  });

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
            {['día', 'semana', 'mes', 'año'].map((type) => (
              <button
                key={type}
                className={`p-2 rounded text-sm font-light ${
                  filterType === type ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
                onClick={() => setFilterType(type as 'día' | 'semana' | 'mes' | 'año')}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 bg-black rounded text-white hover:bg-gray-400" onClick={handlePrev}>
              Anterior
            </button>
            <span className="text-xs font-bold text-black">{formatDate()}</span>
            <button className="p-2 bg-black rounded text-white hover:bg-gray-400" onClick={handleNext}>
              Siguiente
            </button>
          </div>
        </div>

        {/* Lista de ventas */}
        <div className="space-y-4">
          {filteredSales.map((sale) => (
            <div
              key={sale.id}
              className="p-4 border rounded bg-gray-50 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{sale.producto}</p>
                <p className="text-xs text-gray-600">
                  {sale.fecha} - {sale.hora} por {sale.empleado}
                </p>
              </div>
              <span className="font-bold text-black">{sale.precio}</span>
            </div>
          ))}
          {filteredSales.length === 0 && (
            <p className="text-gray-500 text-center">No hay ventas para este período.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VentasHistory;

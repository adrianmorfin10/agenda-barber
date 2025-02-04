import React, { useState } from 'react';

const TablaFiltrosEmpleados = ({ data, onChangePeriodo }:{ data:any, onChangePeriodo:(periodo:string)=>void }) => {
  const [filterType, setFilterType] = useState<'dia' | 'semana' | 'mes' | 'year'>('dia');
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="p-4 bg-white border border-gray-300 rounded-md max-w-[400px] mx-auto">
      {/* Botones de filtro */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['dia', 'semana', 'mes', 'year'].map((type) => (
          <button
            key={type}
            className={`p-2 rounded text-sm font-light ${
              filterType === type ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
            onClick={() =>{ 
              setFilterType(type as 'dia' | 'semana' | 'mes' | 'year');
              onChangePeriodo(type)
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center justify-between mb-4">
        {
          // <button className="p-2 bg-black rounded  hover:bg-gray-400 text-white" onClick={handlePrev}>
          //   Anterior
          // </button>
          // <span className="text-xs font-bold text-black">{formatDate()}</span>
          // <button className="p-2 bg-black rounded  hover:bg-gray-400 text-white" onClick={handleNext}>
          //   Siguiente
          // </button>
        }
      </div>

      {/* Diseño estilo app */}
      <div className="flex flex-wrap gap-4">
        {[
          { titulo: 'Ingresos Generados', valor: data.total_ventas },
          { titulo: 'Comisiones Ganadas', valor: data.total_comision },
          { titulo: 'Citas\nAgendadas', valor: data.total_citas },
          { titulo: 'Membresías Vendidas', valor: data.membresias_vendidas },
          { titulo: 'Productos Vendidos', valor: data.productos_vendidos },
        ].map((dato, index) => (
          <div
            key={index}
            className="flex-1 min-w-[120px] bg-white border border-gray-300 rounded-md p-3 text-center shadow-sm"
          >
            <p className="text-gray-600 text-sm font-light">{dato.titulo}</p>
            <p className="text-black font-bold text-lg">{dato.valor}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaFiltrosEmpleados;

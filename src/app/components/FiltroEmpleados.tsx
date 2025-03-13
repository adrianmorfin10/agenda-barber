import moment from 'moment';
import React, { useState } from 'react';

const TablaFiltrosEmpleados = ({ data, onChangePeriodo }:{ data:any, onChangePeriodo:(periodo:string, currentDate: Date, startDate?:any, endDate?:any)=>void }) => {
  const [filterType, setFilterType] = useState<'dia' | 'semana' | 'mes' | 'year'>('dia');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [ startDate, setStartDate ] = useState<any>(null);
  const [ endDate, setEndDate ] = useState<any>(null);

  const changeDate = (_filterType:string, operation: 'add' | 'less'): Date=>{
    const newDate = moment(currentDate);
    const value = operation === 'add' ? 1 : -1 ;
    switch (filterType) {
      case 'dia':
        newDate.add(value, 'day')
        break;
      case 'semana':
        newDate.add(value, 'week')
        break;
      case 'mes':
        newDate.add(value, 'month')
        break;
      case 'year':
        newDate.add(value, 'year')
        break;
    }
    return newDate.toDate()
  }
  const handlePrev = () => {
    const _date = changeDate(filterType, "less");
    if(filterType === "semana"){
      
      const { startOfWeek, endOfWeek } = getStartAndEndDate(_date);
      setStartDate(moment(startOfWeek).format("YYYY-MM-DD hh:mm"));
      setEndDate(moment(endOfWeek).format("YYYY-MM-DD hh:mm"));
      setCurrentDate(_date);
      onChangePeriodo(filterType, _date, moment(startOfWeek).format("YYYY-MM-DD hh:mm"), moment(endOfWeek).format("YYYY-MM-DD hh:mm") );
    }else{
      setCurrentDate(_date);
      onChangePeriodo(filterType, _date, startDate, endDate);
    }
    
  };

  const handleNext = () => {
    const _date = changeDate(filterType, 'add');
    if(filterType === "semana"){
      
      const { startOfWeek, endOfWeek } = getStartAndEndDate(_date);
      setStartDate(moment(startOfWeek).format("YYYY-MM-DD hh:mm"));
      setEndDate(moment(endOfWeek).format("YYYY-MM-DD hh:mm"));
      setCurrentDate(_date);
      onChangePeriodo(filterType, _date, moment(startOfWeek).format("YYYY-MM-DD hh:mm"), moment(endOfWeek).format("YYYY-MM-DD hh:mm") );
    }else{
      setCurrentDate(_date);
      onChangePeriodo(filterType, _date, startDate, endDate);
    }
  };

  const getStartAndEndDate =( _date:any = null)=>{
    const datoToProccess = _date || currentDate
    const startOfWeek = new Date(datoToProccess);
    startOfWeek.setDate(datoToProccess.getDate() - (datoToProccess.getDay() === 0 ? 6 : datoToProccess.getDay() - 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek }
  }

  const formatDate = () => {
    if (filterType === 'dia') return currentDate.toLocaleDateString();
    if (filterType === 'semana') {
      const { startOfWeek, endOfWeek } = getStartAndEndDate();
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
              setCurrentDate(new Date())
              if(type === "semana"){
                const { startOfWeek, endOfWeek } = getStartAndEndDate();
                setStartDate(moment(startOfWeek).format("YYYY-MM-DD hh:mm"));
                setEndDate(moment(endOfWeek).format("YYYY-MM-DD hh:mm"));
                onChangePeriodo(type, new Date(), moment(startOfWeek).format("YYYY-MM-DD hh:mm"), moment(endOfWeek).format("YYYY-MM-DD hh:mm"))
              }else{
                onChangePeriodo(type, new Date())
              }
              
              setFilterType(type as 'dia' | 'semana' | 'mes' | 'year');
              
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center justify-between mb-4">
        
          <button className="p-2 bg-black rounded  hover:bg-gray-400 text-white" onClick={handlePrev}>
            Anterior
          </button>
          <span className="text-xs font-bold text-black">{formatDate()}</span>
          <button className="p-2 bg-black rounded  hover:bg-gray-400 text-white" onClick={handleNext}>
            Siguiente
          </button>
      
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

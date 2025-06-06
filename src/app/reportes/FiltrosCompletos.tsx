import React from 'react';
// Componente de filtros para clientes y barberos
const FiltrosCompletos = ({ 

    sucursales = [],
    onFiltrar,
  }: {
   
    sucursales: any[],
    onFiltrar: (filtros?:any) => void,
  }) => {
    const [ filter, setFilter] = React.useState<any>({});
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
              onChange={(e) => setFilter({ ...filter, local_id:e.target.value })}
              value={filter?.local_id || ''}
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
              onChange={(e) => setFilter({ ...filter, start_date: e.target.value })}
              value={filter?.start_date || ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
              onChange={(e) => setFilter({ ...filter, end_date: e.target.value })}
              value={filter?.end_date || ''}
            />
          </div>
        </div>
        
        <div className="mt-3 flex justify-end gap-2">
          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
            onClick={()=>{ 
              setFilter({})
              onFiltrar({});
            }}
          >
            Limpiar Filtros
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center"
            onClick={()=>{ onFiltrar(filter)}}
          >
            Aplicar
          </button>
        </div>
      </div>
    )
  };

  export default FiltrosCompletos;
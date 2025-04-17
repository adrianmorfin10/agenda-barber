import React, { useState } from 'react';
import { AppContext } from '../components/AppContext';

interface Servicio {
  id: number;
  nombre: string;
  tiempo: string;
  precio: number;
}

interface ServiceListProps {
  services: Servicio[];
  onSelectService: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, onSelectService, onEdit, onDelete }) => {
  const [tooltipServiceId, setTooltipServiceId] = useState<number | null>(null);
  const [state, dispatchState] = React.useContext(AppContext);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 'desc' para mayor a menor por defecto

  // Función para ordenar los servicios
  const sortedServices = [...services].sort((a, b) => {
    return sortOrder === 'desc' ? b.precio - a.precio : a.precio - b.precio;
  });

  const handleEditClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onEdit(id);
    setTooltipServiceId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onDelete(id);
    setTooltipServiceId(null);
  };

  const toggleTooltip = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setTooltipServiceId(tooltipServiceId === id ? null : id);
  };

  // Función para cambiar el orden de clasificación
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="bg-white text-black p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lista de servicios</h2>
        <button 
          onClick={toggleSortOrder}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
        >
          Ordenar por precio: {sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-300 p-2 text-left">Servicio</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Tiempo</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Precio</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedServices.map((service) => (
            <tr
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className="hover:bg-gray-100 cursor-pointer relative"
            >
              <td className="border-b border-gray-200 p-2">{service.nombre}</td>
              <td className="border-b border-gray-200 p-2">{service.tiempo}</td>
              <td className="border-b border-gray-200 p-2">${service.precio}</td>
              <td className="border-b border-gray-200 p-2 flex flex-row">
                {state.user?.rol === "admin" && (
                  <>
                    <button
                      onClick={(e) => handleEditClick(e, service.id)}
                      className="text-gray-600 px-3 py-1 rounded text-sm"
                    >
                      <img src="img/edit.png" alt="Editar" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, service.id)}
                      className="border border-red-400 text-red-400 px-4 py-2 rounded text-sm md:text-base"
                    >
                      Borrar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;
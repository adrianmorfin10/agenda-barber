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

  const handleEditClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    console.log(`Clic en editar servicio con ID: ${id}`);
    onEdit(id);
    setTooltipServiceId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    console.log(`Clic en eliminar servicio con ID: ${id}`);
    onDelete(id);
    setTooltipServiceId(null);
  };

  const toggleTooltip = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    console.log(`Clic en icono de edición para servicio ID: ${id}`);
    setTooltipServiceId(tooltipServiceId === id ? null : id);
  };

  return (
    <div className="bg-white text-black p-4">
      <h2 className="text-xl font-bold mb-4">Lista de servicios</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-300 p-2 text-left">Servicio</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Tiempo</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Precio</th>
            <th className="border-b-2 border-gray-300 p-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className="hover:bg-gray-100 cursor-pointer relative"
            >
              <td className="border-b border-gray-200 p-2">{service.nombre}</td>
              <td className="border-b border-gray-200 p-2">{service.tiempo}</td>
              <td className="border-b border-gray-200 p-2">${service.precio}</td>
              <td className="border-b border-gray-200 p-2 relative">
                {/* Botón de edición con ícono */}
                <button
                  onClick={(e) => toggleTooltip(e, service.id)}
                  className="border border-gray-400 text-gray-600 px-3 py-1 rounded text-sm"
                >
                  <img src="img/edit.png" alt="Editar" className="w-5 h-5" />
                </button>

                {/* Tooltip con Editar y Eliminar */}
                {state.user?.rol === "admin" && tooltipServiceId === service.id &&  (
                  <div
                    className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-md rounded-md w-32 z-50"
                    onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
                  >
                    <button
                      onClick={(e) => handleEditClick(e, service.id)}
                      className="block px-4 py-2 text-left hover:bg-gray-100 w-full text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, service.id)}
                      className="block px-4 py-2 text-left hover:bg-gray-100 w-full text-sm text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
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

// src/app/servicios/ServiceList.tsx

import React from 'react';

interface Servicio {
  id: number; // Asegúrate de que el tipo sea número
  nombre: string;
  tiempo: string; // Cambiado de "marca" a "tiempo"
  precio: number;
}

interface ServiceListProps {
  services: Servicio[];
  onSelectService: (id: number) => void; // Propiedad para manejar la selección del servicio
}

const ServiceList: React.FC<ServiceListProps> = ({ services, onSelectService }) => {
  return (
    <div className="bg-white text-black p-4">
      <h2 className="text-xl font-bold mb-4">Lista de servicios</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-300 p-2 text-left">Servicio</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Tiempo</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Precio</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr
              key={service.id}
              onClick={() => onSelectService(service.id)} // Usar la función pasada como propiedad
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="border-b border-gray-200 p-2">{service.nombre}</td>
              <td className="border-b border-gray-200 p-2">{service.tiempo}</td>
              <td className="border-b border-gray-200 p-2">${service.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;

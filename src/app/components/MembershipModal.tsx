"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React, { useState } from 'react';
import Image from 'next/image'; // Para usar el icono SVG

interface MembershipModalProps {
  isOpen: boolean;
  services: any[];
  onClose: () => void;
  onCreateMembership: (name: string, price: number, services: { servicio_id: number, cantidad_reservaciones: number }[]) => void;
}
interface Service {
  servicio_id: number;
  cantidad_reservaciones: number;
}

const MembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose, onCreateMembership, services }) => {
  const [membershipName, setMembershipName] = useState('');
  const [membershipPrice, setMembershipPrice ] = useState(0);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);


  const handleServiceToggle = (serviceId: number) => {
    const _services = selectedServices.some((item) => item.servicio_id === serviceId)
    ? selectedServices.filter((item) => item.servicio_id !== serviceId)
    : [...selectedServices, { servicio_id: serviceId, cantidad_reservaciones: 1 }]
    
    setSelectedServices(_services);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onCreateMembership(membershipName, membershipPrice, selectedServices);

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg min-w-[300px] relative">
        {/* Botón de cierre y título */}
        <div className="flex items-center mb-4">
          <button onClick={onClose} className="mr-2">
            <Image src="/img/closemodal.svg" alt="Cerrar" width={24} height={24} />
          </button>
          <h2 className="text-xl font-bold">Agregar Membresía</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="membershipName" className="block text-sm font-medium">Nombre de la Membresía</label>
            <input
              type="text"
              id="membershipName"
              value={membershipName}
              onChange={(e) => setMembershipName(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
            <label htmlFor="precio" className="block text-sm font-medium">Precio de la Membresía</label>
            <input
              type="number"
              id="precio"
              value={membershipPrice}
              onChange={(e) => setMembershipPrice(parseInt(e.target.value))}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-medium">Selecciona Servicios</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={`membresia-modal-${service.id}`} className='flex'>
                  <label className="flex items-center border border-cacaca p-2 rounded-md">
                    <div
                      className="w-2 h-full mr-2"
                      style={{ backgroundColor: service.color }}
                    />
                    <input
                      type="checkbox"
                      checked={selectedServices.some(item=>item.servicio_id === service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="mr-2"
                    />
                    {service.nombre}
                    {
                      selectedServices.some(item=>item.servicio_id === service.id) && (
                        <input
                          type="number"
                          id="cantidad_reservaciones"
                          value={selectedServices.find(item=>item.servicio_id === service.id)?.cantidad_reservaciones}
                          onChange={(e) => {
                            setSelectedServices((prev) =>
                              prev.map((item) =>
                                item.servicio_id === service.id ? { servicio_id: service.id, cantidad_reservaciones: parseInt(e.target.value) } : item
                              )
                            );
                          }}
                          className="mt-1 p-2"
                        />
                      )
                    }
                  </label>
                  
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-5"> {/* Espacio de 20px entre los botones */}
            <button type="submit" className="bg-black text-white py-2 px-4 rounded-md">
              Crear Membresía
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-black text-black py-2 px-4 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipModal;

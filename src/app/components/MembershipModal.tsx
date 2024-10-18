"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React, { useState } from 'react';
import Image from 'next/image'; // Para usar el icono SVG

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMembership: (name: string, services: string[]) => void;
}

const MembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose, onCreateMembership }) => {
  const [membershipName, setMembershipName] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const services = [
    { id: '1', nombre: 'Corte de Cabello', color: '#FF5733' }, // Color asociado al servicio
    { id: '2', nombre: 'Afeitado', color: '#33FF57' }, 
    { id: '3', nombre: 'Colorimetría', color: '#3357FF' },
    // Añadir más servicios según sea necesario
  ];

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedServiceNames = services
      .filter(service => selectedServices.includes(service.id))
      .map(service => service.nombre);
    onCreateMembership(membershipName, selectedServiceNames);
    onClose();
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
          </div>

          <div>
            <h3 className="text-lg font-medium">Selecciona Servicios</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id}>
                  <label className="flex items-center border border-cacaca p-2 rounded-md">
                    <div
                      className="w-2 h-full mr-2"
                      style={{ backgroundColor: service.color }}
                    />
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="mr-2"
                    />
                    {service.nombre}
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

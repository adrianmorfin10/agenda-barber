"use client";

import React, { useState, useEffect } from 'react';

interface Servicio {
  id: number;
  nombre: string;
  tiempo: string;
  precio: number;
}

interface EditServiceModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  service: Servicio | undefined;
  onSave: (updatedService: Servicio) => void;
  onCancel: () => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  service,
  onSave,
  onCancel,
}) => {
  const [nombre, setNombre] = useState(service?.nombre || '');
  const [tiempo, setTiempo] = useState(service?.tiempo || '');
  const [precio, setPrecio] = useState(service?.precio || 0);

  // Actualiza los estados cuando el servicio cambia
  useEffect(() => {
    if (service) {
      setNombre(service.nombre);
      setTiempo(service.tiempo);
      setPrecio(service.precio);
    }
  }, [service]);

  const handleSave = () => {
    if (service) {
      const updatedService: Servicio = {
        ...service,
        nombre,
        tiempo,
        precio,
      };
      onSave(updatedService); // Llama a la función onSave con el servicio actualizado
    }
  };

  if (!isModalOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Servicio</h2>

        {/* Campo para el nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Campo para el tiempo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tiempo</label>
          <input
            type="text"
            value={tiempo}
            onChange={(e) => setTiempo(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Campo para el precio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Botones de Guardar y Cancelar */}
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-white text-black border border-black py-2 px-4 rounded-md mr-2 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;

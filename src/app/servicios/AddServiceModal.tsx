"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface AddserviceModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onAddservice: (newservice: {
    id: number;
    nombre: string;
    tiempo: string; // Cambiado de "marca" a "tiempo"
    precio: number;
  }) => void;
}

const AddserviceModal: React.FC<AddserviceModalProps> = ({ isModalOpen, setIsModalOpen, onAddservice }) => {
  const [nuevoserviceo, setNuevoserviceo] = useState({
    nombre: '',
    tiempo: '', // Añadido campo de tiempo
    precio: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoserviceo({ ...nuevoserviceo, [name]: value });
  };

  const handleAddservice = () => {
    const newservice = {
      id: Date.now(),
      nombre: nuevoserviceo.nombre,
      tiempo: nuevoserviceo.tiempo, // Añadido aquí
      precio: nuevoserviceo.precio,
    };
    onAddservice(newservice);
    setNuevoserviceo({
      nombre: '',
      tiempo: '', // Restablecer campo de tiempo
      precio: 0,
    });
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-[10px] max-w-[450px] w-full">
        <div className="flex items-center mb-4">
          <Image
            src="/img/closemodal.svg"
            alt="Cerrar"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          />
          <h2 className="text-lg font-semibold ml-2 text-[#0C101E]">Agregar servicio</h2>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray mb-1">Nombre del servicio</label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del servicio"
            value={nuevoserviceo.nombre}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
            maxLength={50}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray mb-1">Tiempo del servicio</label>
          <input
            type="text"
            name="tiempo"
            placeholder="Tiempo"
            value={nuevoserviceo.tiempo}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray mb-1">Precio</label>
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={nuevoserviceo.precio}
            onChange={(e) => setNuevoserviceo({ ...nuevoserviceo, precio: Number(e.target.value) })}
            className="border p-2 mb-4 w-full rounded-[5px] text-black placeholder-gray"
            required
          />
        </div>
        
        <button
          onClick={handleAddservice}
          className="bg-black text-white py-2 px-4 rounded-[5px] w-full"
        >
          Añadir servicio
        </button>
      </div>
    </div>
  );
};

export default AddserviceModal;

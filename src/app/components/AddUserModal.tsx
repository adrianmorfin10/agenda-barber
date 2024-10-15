"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface AddUserModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    instagram: '',
    descuento: 0,
    membresia: false,
    foto: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoCliente({ ...nuevoCliente, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNuevoCliente({ ...nuevoCliente, foto: file });
  };

  const handleAddCliente = () => {
    console.log('Añadiendo cliente:', nuevoCliente);
    setNuevoCliente({
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      instagram: '',
      descuento: 0,
      membresia: false,
      foto: null,
    });
    setIsModalOpen(false);
  };

  const handleDescuentoChange = (increment: boolean) => {
    setNuevoCliente((prev) => ({
      ...prev,
      descuento: increment
        ? Math.min(prev.descuento + 5, 100)
        : Math.max(prev.descuento - 5, 0),
    }));
  };

  return (
    <>
      {isModalOpen && (
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
              <h2 className="text-lg font-semibold ml-2 text-[#0C101E]">Añadir Nuevo Usuario</h2>
            </div>

            {/* Campo para cargar foto */}
            <div className="flex items-center mb-4">
              <Image
                src="/img/photo.svg" // Cambiar el ícono a photo.svg
                alt="Cargar Foto"
                width={24}
                height={24}
                className="mr-2 cursor-pointer"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 mb-4 w-full rounded-[5px] text-black placeholder-gray"
              />
            </div>

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoCliente.nombre}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={nuevoCliente.apellido}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Número de Teléfono"
              value={nuevoCliente.telefono}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Solo números
                setNuevoCliente({ ...nuevoCliente, telefono: value });
              }}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={nuevoCliente.email}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="text"
              name="instagram"
              placeholder="Usuario de Instagram (opcional)"
              value={nuevoCliente.instagram}
              onChange={handleInputChange}
              className="border p-2 mb-4 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
            />
            <div className="flex items-center mb-4">
              <button
                className="bg-[#0C101E] text-white py-2 px-4 rounded-l-[5px] w-1/3"
                onClick={() => handleDescuentoChange(false)}
              >
                -
              </button>
              <input
                type="number"
                value={nuevoCliente.descuento}
                readOnly
                className="border p-2 w-1/3 text-center text-black placeholder-gray"
              />
              <button
                className="bg-[#0C101E] text-white py-2 px-4 rounded-r-[5px] w-1/3"
                onClick={() => handleDescuentoChange(true)}
              >
                +
              </button>
            </div>
            <div className="flex items-center mb-4">
              <label className="mr-2">Membresía:</label>
              <input
                type="checkbox"
                checked={nuevoCliente.membresia}
                onChange={() => setNuevoCliente({ ...nuevoCliente, membresia: !nuevoCliente.membresia })}
              />
            </div>
            <button
              onClick={handleAddCliente}
              className="bg-[#0C101E] text-white py-2 px-4 rounded-[5px] w-full"
            >
              Añadir Usuario
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUserModal;

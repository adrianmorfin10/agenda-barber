"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface AddUserModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    instagram: '',
    descuento: 0,
    membresia: false,
    foto: null as File | null, // Cambiamos el tipo a File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoEmpleado({ ...nuevoEmpleado, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Obtener el archivo seleccionado
    setNuevoEmpleado({ ...nuevoEmpleado, foto: file });
  };

  const handleAddEmpleado = () => {
    // Aquí puedes añadir la lógica para añadir el Empleado.
    console.log('Añadiendo Empleado:', nuevoEmpleado);
    // Restablece el formulario después de añadir
    setNuevoEmpleado({
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      instagram: '',
      descuento: 0,
      membresia: false,
      foto: null, // Restablece la foto también
    });
    setIsModalOpen(false);
  };

  const handleDescuentoChange = (increment: boolean) => {
    setNuevoEmpleado((prev) => ({
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
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2 mb-4 w-full rounded-[5px] text-black placeholder-gray"
            />

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoEmpleado.nombre}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={nuevoEmpleado.apellido}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Número de Teléfono"
              value={nuevoEmpleado.telefono}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Solo números
                setNuevoEmpleado({ ...nuevoEmpleado, telefono: value });
              }}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={nuevoEmpleado.email}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="text"
              name="instagram"
              placeholder="Usuario de Instagram (opcional)"
              value={nuevoEmpleado.instagram}
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
                value={nuevoEmpleado.descuento}
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
                checked={nuevoEmpleado.membresia}
                onChange={() => setNuevoEmpleado({ ...nuevoEmpleado, membresia: !nuevoEmpleado.membresia })}
              />
            </div>
            <button
              onClick={handleAddEmpleado}
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

"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ClientService from '../services/ClientService';

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
    const clientService = new ClientService();
    clientService.createClient(nuevoCliente).then((response) => {
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
    }).catch((error) => {
      console.error('Error al añadir cliente:', error);
    });
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

            {/* Campos de Nombre y Apellido */}
            <div className="flex mb-4">
              <div className="flex flex-col mr-2" style={{ height: '136px' }}>
                <label className="block mb-1 text-[#858585] text-[12px] font-light">Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={nuevoCliente.nombre}
                  onChange={handleInputChange}
                  className="border p-2 mb-2 rounded-[5px] text-black placeholder-gray"
                  maxLength={50}
                  required
                />
                <label className="block mb-1 text-[#858585] text-[12px] font-light">Apellido:</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={nuevoCliente.apellido}
                  onChange={handleInputChange}
                  className="border p-2 rounded-[5px] text-black placeholder-gray"
                  maxLength={50}
                  required
                />
              </div>
              {/* Campo para cargar foto */}
              <div className="flex flex-col items-center justify-center border border-dashed border-[#CACACA] p-2 rounded-[5px] w-full h-[136px] cursor-pointer" onClick={() => document.getElementById('file-input')?.click()}>
                {nuevoCliente.foto ? (
                  <>
                    <Image
                      src="/img/check.svg" // Cambia esta ruta a la ubicación del icono de verificación
                      alt="Subida exitosa"
                      width={24}
                      height={24}
                      className="mb-1"
                    />
                    <p className="text-xs text-green-600">Subida exitosa</p>
                    <Image
                      src={URL.createObjectURL(nuevoCliente.foto)} // Vista previa de la imagen
                      alt="Vista previa de la imagen"
                      width={50}
                      height={50}
                      className="mt-2"
                    />
                    <p className="text-xs text-blue-600 cursor-pointer mt-1" onClick={() => document.getElementById('file-input')?.click()}>
                      Reemplazar imagen
                    </p>
                  </>
                ) : (
                  <>
                    <Image
                      src="/img/foto.svg" // Cambia esta ruta a la ubicación del icono de carga
                      alt="Cargar Foto"
                      width={50}
                      height={50}
                    />
                    <p className="text-xs text-gray-600">Cargar Foto</p>
                  </>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

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

            {/* Contenedor de Descuento y Membresía */}
            <div className="flex gap-5 justify-between items-center mb-4">
              {/* Sección de Descuento */}
              <div className="w-full">
                <label className="block mb-1 text-[#858585] text-[12px] font-light">Descuento:</label>
                <div className="border rounded-[5px] flex items-center max-w-[200px]">
                  <button
                    className={`px-4 flex justify-center ${nuevoCliente.descuento === 0 ? 'opacity-50' : ''}`}
                    onClick={() => handleDescuentoChange(false)}
                    disabled={nuevoCliente.descuento === 0}
                  >
                    <Image
                      src="/img/minus.svg"
                      alt="Decrementar"
                      width={20}
                      height={20}
                      style={nuevoCliente.descuento === 0 ? { filter: 'grayscale(100%)' } : {}}
                    />
                  </button>
                  <input
                    type="number"
                    value={nuevoCliente.descuento}
                    readOnly
                    className="p-2 text-center text-black placeholder-gray w-full"
                    style={{ flex: 1 }} // Asegura que el input ocupe el espacio restante
                  />
                  <button
                    className={`px-4 flex justify-center ${nuevoCliente.descuento === 100 ? 'opacity-50' : ''}`}
                    onClick={() => handleDescuentoChange(true)}
                    disabled={nuevoCliente.descuento === 100}
                  >
                    <Image
                      src="/img/mas.svg"
                      alt="Incrementar"
                      width={20}
                      height={20}
                      style={nuevoCliente.descuento === 100 ? { filter: 'grayscale(100%)' } : {}}
                    />
                  </button>
                </div>
              </div>

              {/* Sección de Membresía */}
              <div className="w-full">
                <label className="block mb-1 text-[#858585] text-[12px] font-light">¿Agregar Membresía?</label>
                <div className="flex items-center px-2 py-2">
                  <button
                    className={`w-10 h-5 flex items-center rounded-full p-1 ${nuevoCliente.membresia ? 'bg-green-500' : 'bg-gray-300'}`}
                    onClick={() => setNuevoCliente({ ...nuevoCliente, membresia: !nuevoCliente.membresia })}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${nuevoCliente.membresia ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <button
              className="bg-[#0C101E] text-white rounded-[5px] p-2 w-full hover:bg-[#000000]"
              onClick={handleAddCliente} >
              Añadir Cliente
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUserModal;

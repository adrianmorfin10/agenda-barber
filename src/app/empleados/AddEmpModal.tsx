"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface AddEmpModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onAddEmpleado: (empleado: Empleado) => void;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  instagram?: string;
  diasTrabajo: number[];
  servicios: number[];
}

const AddEmpModal: React.FC<AddEmpModalProps> = ({ isModalOpen, setIsModalOpen, onAddEmpleado }) => {
  const [nuevoEmpleado, setNuevoEmpleado] = useState<Omit<Empleado, 'id'>>({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    instagram: '',
    diasTrabajo: [],
    servicios: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoEmpleado({ ...nuevoEmpleado, [name]: value });
  };

  const toggleDiaTrabajo = (dia: number) => {
    setNuevoEmpleado((prev) => ({
      ...prev,
      diasTrabajo: prev.diasTrabajo.includes(dia)
        ? prev.diasTrabajo.filter((d) => d !== dia)
        : [...prev.diasTrabajo, dia],
    }));
  };

  const toggleServicio = (servicioId: number) => {
    setNuevoEmpleado((prev) => ({
      ...prev,
      servicios: prev.servicios.includes(servicioId)
        ? prev.servicios.filter((id) => id !== servicioId)
        : [...prev.servicios, servicioId],
    }));
  };

  const handleAddEmpleado = () => {
    const empleadoConId: Empleado = { ...nuevoEmpleado, id: Date.now() };
    onAddEmpleado(empleadoConId);
    setIsModalOpen(false);
    setNuevoEmpleado({
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      instagram: '',
      diasTrabajo: [],
      servicios: [],
    });
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
              <h2 className="text-lg font-semibold ml-2 text-[#0C101E]">Añadir Nuevo Empleado</h2>
            </div>

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

            {/* Selección de días de trabajo en horizontal */}
            <div className="flex flex-col mb-4">
              <label className="font-semibold mb-2 text-black">Días de Trabajo</label>
              <div className="flex gap-2">
                {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((dia, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={nuevoEmpleado.diasTrabajo.includes(index + 1)}
                      onChange={() => toggleDiaTrabajo(index + 1)}
                      className="mr-1"
                    />
                    <label className="text-black">{dia}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Selección de servicios */}
            <div className="flex flex-col mb-4">
              <label className="font-semibold mb-2 text-black">Servicios que Puede Brindar</label>
              {["Corte de Cabello", "Afeitado", "Coloración"].map((servicio, servicioId) => (
                <div key={servicioId} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={nuevoEmpleado.servicios.includes(servicioId + 1)}
                    onChange={() => toggleServicio(servicioId + 1)}
                    className="mr-1"
                  />
                  <label className="text-black">{servicio}</label>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddEmpleado}
              className="bg-[#0C101E] text-white py-2 px-4 rounded-[5px] w-full"
            >
              Añadir Empleado
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmpModal;

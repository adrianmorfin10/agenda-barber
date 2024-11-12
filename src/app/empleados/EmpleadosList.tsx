"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import AddEmpModal from './AddEmpModal';
import { Empleado } from '../interfaces/empleado'; // Importa desde el archivo centralizado

interface EmpleadosListProps {
  empleados: Empleado[];
  onSelectEmpleado: (empleado: Empleado) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddEmpleado: (empleado: Empleado) => void;
}

const EmpleadosList: React.FC<EmpleadosListProps> = ({
  empleados,
  onSelectEmpleado,
  searchTerm,
  setSearchTerm,
  onAddEmpleado,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEmpleados = empleados.filter((empleado) =>
    `${empleado.nombre} ${empleado.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 w-full md:max-w-[450px] overflow-y-auto">
      <h1 className="font-semibold text-2xl poppins mb-5 text-black">Empleados</h1>

      <div className="flex items-center bg-[#F1F1F1] p-2 rounded mb-5">
        <Image src="/img/search.svg" alt="Buscar" width={20} height={20} />
        <input
          type="text"
          placeholder="Buscar empleado"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none p-2 ml-2 poppins text-sm text-black"
        />
      </div>

      <div
        className="flex items-center p-4 bg-white mb-5 cursor-pointer hover:bg-[#e0e0e0]"
        onClick={() => setIsModalOpen(true)}
      >
        <Image src="/img/plus.svg" alt="Añadir nuevo empleado" width={20} height={20} />
        <span className="ml-2 font-medium poppins text-lg text-black">Añadir nuevo empleado</span>
      </div>

      <AddEmpModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onAddEmpleado={(newEmpleado) => {
          const empleadoConId:any = { ...newEmpleado };
          onAddEmpleado(empleadoConId);
        }}
      />

      <div className="overflow-y-auto max-h-[450px]">
        {filteredEmpleados.map((empleado) => (
          <div
            key={empleado.id}
            className="flex items-center mb-4 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            onClick={() => onSelectEmpleado(empleado)}
          >
            <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px]">
              {empleado.nombre.charAt(0)}
              {empleado.apellido.charAt(0)}
            </div>
            <div className="ml-3 poppins text-black">
              <span className="block">{`${empleado.nombre} ${empleado.apellido}`}</span>
              <span className="text-sm text-gray-500">
                {empleado.diasTrabajo.map((dia) => `Día ${dia}`).join(', ')} | Servicios: {empleado.servicios.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmpleadosList;

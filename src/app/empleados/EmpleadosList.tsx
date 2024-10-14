"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import AddUserModal from './AddEmpModal'; // Asegúrate de que la ruta es correcta

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  instagram: string;
  citas: number;
  inasistencias: number;
  cancelaciones: number;
  ultimaVisita: string;
  descuento: string;
  ingresosTotales: string;
  membresia: string;
  tipo: string;
  serviciosDisponibles: number;
  proximoPago: string;
}

interface EmpleadosListProps {
  empleados: Empleado[]; // Cambiar 'Empleados' a 'empleados'
  onSelectEmpleado: (empleado: Empleado) => void; // Cambiar 'Empleado' a 'empleado'
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const EmpleadosList: React.FC<EmpleadosListProps> = ({
  empleados, // Cambiar 'Empleados' a 'empleados'
  onSelectEmpleado,
  searchTerm,
  setSearchTerm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Verificar que 'empleados' no sea undefined y filtrar
  const filteredEmpleados = empleados?.filter(empleado =>
    `${empleado.nombre} ${empleado.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []; // Asegúrate de que sea un array vacío si empleados es undefined

  return (
    <div className="p-5 w-full md:max-w-[450px] overflow-y-auto">
      <h1 className="font-semibold text-2xl poppins mb-5 text-black">Empleados</h1>

      {/* Barra de búsqueda */}
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

      {/* Botón para añadir nuevo empleado */}
      <div className="flex items-center p-4 bg-white mb-5 cursor-pointer hover:bg-[#e0e0e0]" onClick={() => setIsModalOpen(true)}>
        <Image src="/img/plus.svg" alt="Añadir nuevo empleado" width={20} height={20} />
        <span className="ml-2 font-medium poppins text-lg text-black">Añadir nuevo empleado</span>
      </div>

      {/* Modal para añadir empleado */}
      <AddUserModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      {/* Lista de empleados filtrados */}
      <div className="overflow-y-auto max-h-[450px]">
        {filteredEmpleados.map(empleado => (
          <div
            key={empleado.id}
            className="flex items-center mb-4 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            onClick={() => onSelectEmpleado(empleado)} // Cambiar 'Empleado' a 'empleado'
          >
            <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px]">
              {empleado.nombre.charAt(0)}{empleado.apellido.charAt(0)}
            </div>
            <span className="ml-3 poppins text-black">{`${empleado.nombre} ${empleado.apellido}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmpleadosList;

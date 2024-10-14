"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import AddUserModal from './AddUserModal'; // Asegúrate de que la ruta es correcta

interface Cliente {
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

interface ClientesListProps {
  clientes: Cliente[];
  onSelectCliente: (cliente: Cliente) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ClientesList: React.FC<ClientesListProps> = ({
  clientes,
  onSelectCliente,
  searchTerm,
  setSearchTerm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClientes = clientes.filter(cliente =>
    `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 w-full md:max-w-[450px] overflow-y-auto">
      <h1 className="font-semibold text-2xl poppins mb-5 text-black">Usuarios</h1>

      {/* Barra de búsqueda */}
      <div className="flex items-center bg-[#F1F1F1] p-2 rounded mb-5">
        <Image src="/img/search.svg" alt="Buscar" width={20} height={20} />
        <input
          type="text"
          placeholder="Buscar usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none p-2 ml-2 poppins text-sm text-black"
        />
      </div>

      {/* Botón para añadir nuevo usuario */}
      <div className="flex items-center p-4 bg-white mb-5 cursor-pointer hover:bg-[#e0e0e0]" onClick={() => setIsModalOpen(true)}>
        <Image src="/img/plus.svg" alt="Añadir nuevo usuario" width={20} height={20} />
        <span className="ml-2 font-medium poppins text-lg text-black">Añadir nuevo usuario</span>
      </div>

      {/* Modal para añadir usuario */}
      <AddUserModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      {/* Lista de usuarios filtrados */}
      <div className="overflow-y-auto max-h-[450px]">
        {filteredClientes.map(cliente => (
          <div
            key={cliente.id}
            className="flex items-center mb-4 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            onClick={() => onSelectCliente(cliente)}
          >
            <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px]">
              {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
            </div>
            <span className="ml-3 poppins text-black">{`${cliente.nombre} ${cliente.apellido}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientesList;

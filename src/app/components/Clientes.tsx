"use client";

import React, { useState } from 'react';
import ClientesList from './Clienteslist';
import ClienteDetails from './ClienteDetails';

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

const Clientes = () => {
  const initialClientes: Cliente[] = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    nombre: `Nombre${index + 1}`,
    apellido: `Apellido${index + 1}`,
    telefono: `555-012${index}`,
    instagram: `@usuario${index}`,
    citas: Math.floor(Math.random() * 10),
    inasistencias: Math.floor(Math.random() * 5),
    cancelaciones: Math.floor(Math.random() * 3),
    ultimaVisita: 'Oct, 8, 2024',
    descuento: 'Sin descuento',
    ingresosTotales: `$${Math.floor(Math.random() * 100)}.00`,
    membresia: 'Activa',
    tipo: 'Black',
    serviciosDisponibles: Math.floor(Math.random() * 10),
    proximoPago: '23/10/2024',
  }));

  const [clientes] = useState<Cliente[]>(initialClientes);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null); // Comienza sin cliente seleccionado
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };

  return (
    <div className="flex bg-[#FFFFFF] min-h-screen">
      {/* Mostrar lista de clientes en mobile, siempre visible en desktop */}
      <div className={`${selectedCliente ? 'hidden' : 'block'} md:block w-full md:w-1/3`}>
        <ClientesList
          clientes={clientes}
          onSelectCliente={handleSelectCliente}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* Mostrar detalles de cliente seleccionado solo si hay uno en mobile, siempre visible en desktop */}
      <div className={`${selectedCliente ? 'block' : 'hidden'} md:block w-full md:w-2/3`}>
        <ClienteDetails
          cliente={selectedCliente}
          onBack={() => setSelectedCliente(null)} // Solo se usa en mobile
        />
      </div>
    </div>
  );
};

export default Clientes;

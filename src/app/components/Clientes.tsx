"use client"; // Marca este componente como un Client Component

import React, { useState } from 'react';
import Image from 'next/image';

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

  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', apellido: '', telefono: '', instagram: '',email: ''  });
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(initialClientes[0]); // Cliente preseleccionado
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoCliente({ ...nuevoCliente, [name]: value });
  };

  const handleAddCliente = () => {
    const newCliente: Cliente = {
      id: clientes.length,
      ...nuevoCliente,
      citas: 0,
      inasistencias: 0,
      cancelaciones: 0,
      ultimaVisita: 'N/A',
      descuento: 'Sin descuento',
      ingresosTotales: '$0.00',
      membresia: 'Activa',
      tipo: 'Black',
      serviciosDisponibles: 0,
      proximoPago: 'N/A',
    };
    setClientes([...clientes, newCliente]);
    setNuevoCliente({ nombre: '', apellido: '', telefono: '', instagram: '',email: ''  });
    setIsModalOpen(false);
    setSelectedCliente(newCliente); // Seleccionar el nuevo cliente añadido
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredClientes = clientes.filter(cliente =>
    `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#FFFFFF] min-h-screen">
      <div className="p-5 w-1/3 overflow-y-auto ">
        <h1 className="font-semibold text-2xl poppins mb-5 text-black">Usuarios</h1>

        <div className="flex items-center bg-[#F1F1F1] p-2 rounded mb-5">
          <Image src="/img/search.svg" alt="Buscar" width={20} height={20} />
          <input
            type="text"
            placeholder="Buscar usuario"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-transparent border-none outline-none p-2 ml-2 poppins text-sm text-black"
          />
        </div>

        <div 
          className="flex items-center p-4 bg-white mb-5 cursor-pointer hover:bg-[#e0e0e0]"
          onClick={() => setIsModalOpen(true)}
        >
          <Image src="/img/plus.svg" alt="Añadir nuevo usuario" width={20} height={20} />
          <span className="ml-2 font-medium poppins text-lg text-black">Añadir nuevo usuario</span>
        </div>

        {/* Modal para añadir usuario */}
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
      <button 
        onClick={handleAddCliente}
        className="bg-[#0C101E] text-white py-2 px-4 rounded-[5px] w-full"
      >
        Añadir Usuario
      </button>
    </div>
  </div>
)}




        <div className="overflow-y-auto max-h-[450px]">
          {filteredClientes.map(cliente => (
            <div
              key={cliente.id}
              className={`flex items-center mb-4 cursor-pointer p-2 rounded-lg transition-all duration-200 
                ${selectedCliente?.id === cliente.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => handleSelectCliente(cliente)}
            >
              <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px]">
                {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
              </div>
              <span className="ml-3 poppins text-black">{`${cliente.nombre} ${cliente.apellido}`}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contenedor de detalles de contacto */}
      {selectedCliente && (
        <div className="flex flex-col justify-center p-5 w-2/3 bg-[#F8F8F8] shadow-lg">
          <div className="flex justify-between items-center bg-white p-5 rounded-[5px] mb-4">
            <div className="flex items-center">
              <Image src="/img/edit.svg" alt="Editar" width={20} height={20} />
              <span className="ml-2 poppins text-black">Editar</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px]">
                {selectedCliente.nombre.charAt(0)}{selectedCliente.apellido.charAt(0)}
              </div>
              <span className="text-black">{selectedCliente.nombre}</span>
              <span className="text-black">{selectedCliente.telefono}</span>
              <span className="text-black">{selectedCliente.instagram}</span>
            </div>
            <div className="flex items-center">
              <Image src="/img/calendara.svg" alt="Agendar" width={20} height={20} />
              <span className="ml-2 poppins text-black">Agendar</span>
            </div>
          </div>

{/* Contenedor de estadísticas */}
<div className="bg-white p-4 rounded mb-4">
  <div className="grid grid-cols-3 gap-4">
    <div className="text-black poppins">Citas</div>
    <div className="text-black poppins">Inasistencias</div>
    <div className="text-black poppins">Cancelaciones</div>
  </div>
  <div className="grid grid-cols-3 gap-4 font-bold mb-4"> {/* Espacio entre secciones */}
    <div className="text-black">{selectedCliente.citas}</div>
    <div className="text-black">{selectedCliente.inasistencias}</div>
    <div className="text-black">{selectedCliente.cancelaciones}</div>
  </div>
  <div className="grid grid-cols-3 gap-4">
    <div className="text-black poppins">Última Visita</div>
    <div className="text-black poppins">Descuento</div>
    <div className="text-black poppins">Ingresos Totales</div>
  </div>
  <div className="grid grid-cols-3 gap-4 font-bold mb-4"> {/* Espacio entre secciones */}
    <div className="text-black">{selectedCliente.ultimaVisita}</div>
    <div className="text-black">{selectedCliente.descuento}</div>
    <div className="text-black">{selectedCliente.ingresosTotales}</div>
  </div>
</div>



          {/* Contenedor de membresía y servicios */}
          <div className="bg-white p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-black poppins">Membresía</div>
              <div className="text-black poppins">Tipo</div>
            </div>
            <div className="grid grid-cols-2 gap-4 font-bold">
              <div className="text-black">{selectedCliente.membresia}</div>
              <div className="text-black">{selectedCliente.tipo}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-black poppins">Servicios Disponibles del Periodo</div>
              <div className="text-black poppins">Próximo Pago</div>
            </div>
            <div className="grid grid-cols-2 gap-4 font-bold">
              <div className="text-black">{selectedCliente.serviciosDisponibles}</div>
              <div className="text-black">{selectedCliente.proximoPago}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;

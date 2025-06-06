"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import AddUserModal from './AddUserModal'; // Asegúrate de que la ruta es correcta
import { hasMemberActive } from '../Utils';


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
  descuento: string | number;
  ingresosTotales: string;
  isMember?: boolean;
  membresia?: object;
  membresia_id?: number;
  tipo: string;
  serviciosDisponibles: number;
  proximoPago: string;
  avatar: string | null;
}

interface ClientesListProps {
  clientes: Cliente[];
  onSelectCliente: (cliente: Cliente) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  reloadClients?: () => void;
  title?: string;
  createUser?:boolean;
}
let idTime:any = false;
const ClientesList: React.FC<ClientesListProps> = ({
  clientes =[],
  onSelectCliente,
  searchTerm,
  setSearchTerm,
  reloadClients,
  title = "Usuarios",
  createUser = true
}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToList, setClientsToList ] = useState<Cliente[]>(clientes || []);
  const [search, setSearch] = useState('');
  React.useEffect(() => {
    if(!search || search.length < 3){
      setClientsToList(clientes);
      return;
    };
   
   
    if(!idTime){
      idTime = setTimeout(() => {
        clearTimeout(idTime);
        idTime = false;
      }, 500);
      setClientsToList(clientToList.filter(cliente => {
        return `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(search.toLowerCase())
      }));
    }
      
  }, [search, clientes]);
  // .filter(cliente =>
  //   `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  // );
 
  return (
    <div className="p-5 w-full md:max-w-[450px] overflow-y-auto">
      <h1 className="font-semibold text-2xl poppins mb-5 text-black">{title}</h1>

      {/* Barra de búsqueda */}
      <div className="flex items-center bg-[#F1F1F1] p-2 rounded mb-5">
        <Image src="/img/search.svg" alt="Buscar" width={20} height={20} />
        <input
          type="text"
          placeholder="Buscar usuario"
          value={searchTerm}
          onChange={(e) => { 
            setSearchTerm(e.target.value);
            setSearch(e.target.value);
          }}
          className="bg-transparent border-none outline-none p-2 ml-2 poppins text-sm text-black"
        />
      </div>

      {/* Botón para añadir nuevo usuario */}
      { 
        createUser &&
        <div className="flex items-center p-4 bg-white mb-5 cursor-pointer hover:bg-[#e0e0e0]" onClick={() => setIsModalOpen(true)}>
          <Image src="/img/plus.svg" alt="Añadir nuevo usuario" width={20} height={20} />
          <span className="ml-2 font-medium poppins text-lg text-black">Añadir nuevo usuario</span>
        </div>
      }
      

      {/* Modal para añadir usuario */}
      <AddUserModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onCreateSuccess={reloadClients} />

     
  {/* Lista de usuarios filtrados */}
  <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
    {clientToList.map(cliente => (
      <div
        key={cliente.id}
        className="flex justify-between items-center mb-4 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
        onClick={() => onSelectCliente(cliente)}
      >
        <div className='flex'>
          <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px]">
            {cliente.nombre.charAt(0)}{( cliente.apellido ).charAt(0)}
          </div>
          <span className="ml-3 poppins text-black">{`${cliente.nombre} ${cliente.apellido}`}</span>
        </div>
        {
          cliente.membresia &&
          <svg width="10" height="10" viewBox="0 0 50 50" className={hasMemberActive(cliente) ? 'fill-green-500' : 'fill-gray-300'} xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="25" />
          </svg>
        }
        
        
      </div>
    ))}
  </div>
</div>
  );
};

export default ClientesList;

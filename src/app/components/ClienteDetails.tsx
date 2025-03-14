"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ClientService from '../services/ClientService';
import Link from 'next/link';
import WarningModal from './WarningModal';
import HttpService from '../services/HttpService';
import MembresiaService from '../services/MembresiaService';
import { AppContext } from './AppContext';
import { hasMemberActive } from '../Utils';
const membresiaServiceObject = new MembresiaService();

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
  is_member?: boolean;
  membresia?: boolean;
  email?: string;
  tipo: string;
  serviciosDisponibles: number;
  proximoPago: string;
  avatar: string | null;
}

interface ClienteDetailsProps {
  cliente: Cliente | null;
  onBack: () => void;
  onUpdate: (updatedCliente: Cliente|null) => void; // Callback para actualizar la información del cliente
}

const httpService = new HttpService();
const ClienteDetails: React.FC<ClienteDetailsProps> = ({ cliente, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNombre, setEditedNombre] = useState(cliente?.nombre || '');
  const [editedApellido, setEditedApellido] = useState(cliente?.apellido || '');
  const [editedTelefono, setEditedTelefono] = useState(cliente?.telefono || '');
  const [descuento, setDescuento] = useState(cliente?.descuento || 0);
  const [membresia, setMembresia ] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [membresias, setMembresias] = useState([]);
  const [membresiaId, setMembresiaId] = useState<number>(0);
  const [state, dispatchState] = React.useContext(AppContext);
  useEffect(() => {
    if (cliente) {
      console.log('Cliente seleccionado:', cliente);
      setEditedNombre(cliente.nombre);
      setEditedApellido(cliente.apellido);
      setEditedTelefono(cliente.telefono);
      setDescuento(cliente.descuento);
      setMembresia(cliente.membresia || false);
    }
  }, [cliente]);
  React.useEffect(()=>{
    if(!state.sucursal) return;
    getMembresias();
  }, [state.sucursal])
  const getMembresias = ()=>{
    membresiaServiceObject.getMembresias(state.sucursal ? { local_id: state.sucursal.id } : false).then(response=>{
      setMembresias(response);
    }).catch(e=>{})
  }
  if (!cliente) return null;

  const clientService = new ClientService();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const updatedCliente = {
        ...cliente,
        nombre: editedNombre,
        apellido: editedApellido,
        telefono: editedTelefono,
        descuento: descuento
      };
      
      const response = await clientService.updateClient(cliente.id.toString(), {
        nombre: editedNombre,
        apellido: editedApellido,
        telefono: editedTelefono,
        is_member: membresia,
        descuento: descuento
      });
      onUpdate(updatedCliente); // Actualizar los datos en el componente padre
      setIsEditing(false); // Salir del modo de edición
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
    }
  };

  const handleDelete = async ()=>{
    try {
      const response = await clientService.deleteClient(cliente.id.toString());
      onUpdate(null);
      setOpenWarning(false);
      setIsEditing(false); // Salir del modo de edición
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
    }
  }

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedNombre(cliente.nombre);
    setEditedApellido(cliente.apellido);
    setEditedTelefono(cliente.telefono);
  };

  return (
    <div className="flex flex-col justify-center p-4 md:p-5 w-full h-full bg-[#F8F8F8]">
      
      <div className="md:hidden flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-black">← Volver</button>
        <h1 className="font-semibold text-xl md:text-2xl poppins text-black">Detalle de cliente</h1>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 md:p-5 rounded-[5px] mb-4">
        
        {/* Botón Editar con cambio de texto en modo de edición */}
        <div className="flex flex-col items-center mb-4 md:mb-0">
          <div className="flex items-center border border-gray-400 bg-white rounded px-4 py-2 cursor-pointer">
            {isEditing ? (
              <span className="text-black text-sm md:text-base">Editando</span>
            ) : (
              <div onClick={handleEditClick} className="flex items-center">
                <Image src="/img/edit.svg" alt="Editar" width={20} height={20} />
                <span className="ml-2 poppins text-black text-sm md:text-base">Editar</span>
              </div>
            )}
          </div>
          <span className="mt-1 text-xs md:text-sm text-gray-500 invisible">Espacio para simetría</span>
        </div>

        <div className="flex flex-col items-center mb-4 md:mb-0">
          {
            !cliente.avatar ?
            <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px] text-sm md:text-base">
              {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
            </div> :
            <img src={`${httpService.baseUrl}/file/${cliente.avatar}`} className='rounded-full ' />
          }
          
          {isEditing ? (
            <>
              <label className="block text-sm text-gray-500 mt-2">Nombre:</label>
              <input
                type="text"
                value={editedNombre}
                onChange={(e) => setEditedNombre(e.target.value)}
                className="border p-1 rounded mt-1 mb-2 text-black w-full text-sm md:text-base"
              />

              <label className="block text-sm text-gray-500">Apellido:</label>
              <input
                type="text"
                value={editedApellido}
                onChange={(e) => setEditedApellido(e.target.value)}
                className="border p-1 rounded mt-1 mb-2 text-black w-full text-sm md:text-base"
              />

              <label className="block text-sm text-gray-500">Teléfono:</label>
              <input
                type="text"
                value={editedTelefono}
                onChange={(e) => setEditedTelefono(e.target.value)}
                className="border p-1 rounded mt-1 mb-2 text-black w-full text-sm md:text-base"
              />
              {
                state.user.rol === "admin" &&
                <>
                  <label className="block text-sm text-gray-500">Descuento:</label>
                  <input
                    type="text"
                    value={descuento}
                    onChange={(e) => setDescuento(Number(e.target.value))}
                    className="border p-1 rounded mt-1 mb-2 text-black w-full text-sm md:text-base"
                  />
                </>
              }
              
              {/* Sección de Membresía */}
             
              <div className="w-full flex flex-col">
                <label className="block mb-1 text-[#858585] text-sm md:text-[12px] font-light">Membresía</label>
                <div className="flex items-center px-2 py-2">
                  <button
                    className={`w-10 h-5 flex items-center rounded-full p-1 ${hasMemberActive(cliente) ? 'bg-green-500' : 'bg-gray-300'} `}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${hasMemberActive(cliente) ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="text-black text-sm md:text-base">{cliente.email}</span>
              <span className="text-black text-sm md:text-base">{cliente.nombre} {cliente.apellido}</span>
              <span className="text-black text-sm md:text-base">{cliente.telefono}</span>
              <span className="text-black text-sm md:text-base">{cliente.instagram}</span>
              <div className="text-black text-xs md:text-sm">Descuento: {descuento}</div>
            </>
          )}
        </div>

        {/* Botón de Agendar (deshabilitado) */}
        <div className="flex flex-col items-center">
          <Link key={"agendar-link"} href={`/citas?u=${cliente.id}`} className="flex items-center border border-gray-400 bg-white rounded px-4 py-2 cursor-pointer" >
            
              <Image src="/img/calendara.svg" alt="Agendar" width={20} height={20} />
              <span className="ml-2 poppins text-black">Agendar</span>
           
          </Link>
        </div>

      </div>

      {/* Botones Guardar y Cancelar en modo de edición */}
      {isEditing && (
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSaveClick}
            className="bg-black text-white px-4 py-2 rounded text-sm md:text-base w-full"
          >
            Guardar
          </button>
          <button
            onClick={()=>{ setOpenWarning(true) }}
            className="border border-red-400 text-red-400 px-4 py-2 rounded text-sm md:text-base w-full"
          >
            Borrar
          </button>
          <button
            onClick={handleCancelClick}
            className="border border-gray-400 text-black px-4 py-2 rounded text-sm md:text-base w-full"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Contenedor de estadísticas 
      
      <div className="bg-white p-4 md:p-5 rounded mb-4 mt-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-black poppins text-xs md:text-sm">Citas</div>
          <div className="text-black poppins text-xs md:text-sm">Inasistencias</div>
          <div className="text-black poppins text-xs md:text-sm">Cancelaciones</div>
        </div>
        <div className="grid grid-cols-3 gap-4 font-bold mb-4">
          <div className="text-black text-xs md:text-sm">{cliente.citas}</div>
          <div className="text-black text-xs md:text-sm">{cliente.inasistencias}</div>
          <div className="text-black text-xs md:text-sm">{cliente.cancelaciones}</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-black poppins text-xs md:text-sm">Última Visita</div>
          <div className="text-black poppins text-xs md:text-sm">Descuento</div>
          <div className="text-black poppins text-xs md:text-sm">Ingresos Totales</div>
        </div>
        <div className="grid grid-cols-3 gap-4 font-bold mb-4">
          <div className="text-black text-xs md:text-sm">{cliente.ultimaVisita}</div>
          <div className="text-black text-xs md:text-sm">{descuento}</div>
          <div className="text-black text-xs md:text-sm">{cliente.ingresosTotales}</div>
        </div>
      </div>
      */}
      
      {/* Contenedor de membresía y servicios */}
      {/*
      <div className="bg-white p-4 md:p-5 rounded">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-black poppins text-xs md:text-sm">Membresía</div>
          <div className="text-black poppins text-xs md:text-sm">Tipo</div>
        </div>
        <div className="grid grid-cols-2 gap-4 font-bold">
          <div className="text-black text-xs md:text-sm">{cliente.membresia}</div>
          <div className="text-black text-xs md:text-sm">{cliente.tipo}</div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-black poppins text-xs md:text-sm">Servicios Disponibles del Periodo</div>
          <div className="text-black poppins text-xs md:text-sm">Próximo Pago</div>
        </div>
        <div className="grid grid-cols-2 gap-4 font-bold">
          <div className="text-black text-xs md:text-sm">{cliente.serviciosDisponibles}</div>
          <div className="text-black text-xs md:text-sm">{cliente.proximoPago}</div>
        </div>
      </div>
      */}
      <WarningModal
        isOpen={openWarning}
        onConfirm={()=>{ handleDelete(); }}
        onClose={()=>{ setOpenWarning(false) }}
        title='Warning'
        content='Al confirmar esta accion no podra revertir los cambios.'
      />
    </div>
  );
};

export default ClienteDetails;

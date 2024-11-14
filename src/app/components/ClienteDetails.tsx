"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ClientService from '../services/ClientService';

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

interface ClienteDetailsProps {
  cliente: Cliente | null;
  onBack: () => void;
  onUpdate: (updatedCliente: Cliente) => void; // Callback para actualizar la información del cliente
}

const ClienteDetails: React.FC<ClienteDetailsProps> = ({ cliente, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNombre, setEditedNombre] = useState(cliente?.nombre || '');
  const [editedApellido, setEditedApellido] = useState(cliente?.apellido || '');
  const [editedTelefono, setEditedTelefono] = useState(cliente?.telefono || '');

  useEffect(() => {
    if (cliente) {
      setEditedNombre(cliente.nombre);
      setEditedApellido(cliente.apellido);
      setEditedTelefono(cliente.telefono);
    }
  }, [cliente]);

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
      };
      const response = await clientService.updateClient(cliente.id.toString(), {
        nombre: editedNombre,
        apellido: editedApellido,
        telefono: editedTelefono,
      });
      console.log('Respuesta de la API:', response); // Verificar la respuesta de la API
      onUpdate(updatedCliente); // Actualizar los datos en el componente padre
      setIsEditing(false); // Salir del modo de edición
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
    }
  };

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
          <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px] text-sm md:text-base">
            {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
          </div>
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
            </>
          ) : (
            <>
              <span className="text-black text-sm md:text-base">{cliente.nombre} {cliente.apellido}</span>
              <span className="text-black text-sm md:text-base">{cliente.telefono}</span>
              <span className="text-black text-sm md:text-base">{cliente.instagram}</span>
            </>
          )}
        </div>

        {/* Botón de Agendar (deshabilitado) */}
        <div className="flex flex-col items-center">
          <button
            className="flex items-center bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed text-sm md:text-base"
            disabled
          >
            <Image src="/img/calendara.svg" alt="Agendar" width={20} height={20} />
            <span className="ml-2 poppins text-black">Agendar</span>
          </button>
          <span className="mt-1 text-xs md:text-sm text-gray-500">(Próximamente)</span>
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
            onClick={handleCancelClick}
            className="border border-gray-400 text-black px-4 py-2 rounded text-sm md:text-base w-full"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Contenedor de estadísticas */}
      
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
          <div className="text-black text-xs md:text-sm">{cliente.descuento}</div>
          <div className="text-black text-xs md:text-sm">{cliente.ingresosTotales}</div>
        </div>
      </div>
      
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
    </div>
  );
};

export default ClienteDetails;

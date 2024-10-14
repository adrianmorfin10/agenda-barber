"use client";

import React from 'react';
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

interface ClienteDetailsProps {
  cliente: Cliente | null;
  onBack: () => void;
}

const ClienteDetails: React.FC<ClienteDetailsProps> = ({ cliente, onBack }) => {
  if (!cliente) return null;

  return (
    <div className="flex flex-col justify-center p-5 w-full md:w-2/3 bg-[#F8F8F8] shadow-lg">
      
      {/* Encabezado para móviles */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-black">← Volver</button>
        <h1 className="font-semibold text-2xl poppins text-black">Detalle de cliente</h1>
      </div>
      
{/* Contenedor de detalles del cliente y botones */}
<div className="flex justify-between items-center bg-white p-5 rounded-[5px] mb-4">
  
  {/* Botón de Editar a la izquierda */}
  <div className="flex items-center">
    <Image src="/img/edit.svg" alt="Editar" width={20} height={20} />
    <span className="ml-2 poppins text-black">Editar</span>
  </div>

  {/* Información del cliente centrada */}
  <div className="flex flex-col items-center">
    <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px]">
      {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
    </div>
    <span className="text-black">{cliente.nombre}</span>
    <span className="text-black">{cliente.telefono}</span>
    <span className="text-black">{cliente.instagram}</span>
  </div>

  {/* Botón de Agendar a la derecha */}
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
        <div className="grid grid-cols-3 gap-4 font-bold mb-4">
          <div className="text-black">{cliente.citas}</div>
          <div className="text-black">{cliente.inasistencias}</div>
          <div className="text-black">{cliente.cancelaciones}</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-black poppins">Última Visita</div>
          <div className="text-black poppins">Descuento</div>
          <div className="text-black poppins">Ingresos Totales</div>
        </div>
        <div className="grid grid-cols-3 gap-4 font-bold mb-4">
          <div className="text-black">{cliente.ultimaVisita}</div>
          <div className="text-black">{cliente.descuento}</div>
          <div className="text-black">{cliente.ingresosTotales}</div>
        </div>
      </div>

      {/* Contenedor de membresía y servicios */}
      <div className="bg-white p-4 rounded">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-black poppins">Membresía</div>
          <div className="text-black poppins">Tipo</div>
        </div>
        <div className="grid grid-cols-2 gap-4 font-bold">
          <div className="text-black">{cliente.membresia}</div>
          <div className="text-black">{cliente.tipo}</div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-black poppins">Servicios Disponibles del Periodo</div>
          <div className="text-black poppins">Próximo Pago</div>
        </div>
        <div className="grid grid-cols-2 gap-4 font-bold">
          <div className="text-black">{cliente.serviciosDisponibles}</div>
          <div className="text-black">{cliente.proximoPago}</div>
        </div>
      </div>
    </div>
  );
};

export default ClienteDetails;

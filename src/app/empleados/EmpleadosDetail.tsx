"use client";

import React from 'react';
import Image from 'next/image';

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  instagram?: string;
  citas: number;
  inasistencias: number;
  ingresosTotales: string;
  diasTrabajo: number[];
  servicios: number[]; // IDs de servicios que el barbero puede brindar
}

interface EmpleadoDetailsProps {
  empleado: Empleado | null;
  onBack: () => void;
}

// Diccionario para mapear IDs a nombres de servicios
const servicioNombres: { [key: number]: string } = {
  1: "Corte de Cabello",
  2: "Afeitado",
  3: "Coloración",
  // Agrega otros servicios si es necesario
};

const EmpleadoDetails: React.FC<EmpleadoDetailsProps> = ({ empleado, onBack }) => {
  if (!empleado) return null;

  const diasSemana = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
  const diasTrabajo = empleado.diasTrabajo.map((dia) => diasSemana[dia - 1]).join(", ");

  return (
    <div className="flex flex-col justify-center p-5 w-full h-full bg-[#F8F8F8]">
      <div className="md:hidden flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-black">← Volver</button>
        <h1 className="font-semibold text-2xl poppins text-black">Detalle de Empleado</h1>
      </div>

      <div className="flex justify-between items-center bg-white p-5 rounded-[5px] mb-4">
        <div className="flex items-center">
          <Image src="/img/edit.svg" alt="Editar" width={20} height={20} />
          <span className="ml-2 poppins text-black">Editar</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px]">
            {empleado.nombre.charAt(0)}{empleado.apellido.charAt(0)}
          </div>
          <span className="text-black">{empleado.nombre}</span>
          <span className="text-black">{empleado.telefono}</span>
          <span className="text-black">{empleado.instagram}</span>
        </div>

        <div className="flex items-center">
          <Image src="/img/calendara.svg" alt="Agendar" width={20} height={20} />
          <span className="ml-2 poppins text-black">Agendar</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-black poppins">Citas Realizadas</div>
          <div className="text-black poppins">Inasistencias del Mes</div>
          <div className="text-black poppins">Ingresos Totales</div>
        </div>
        <div className="grid grid-cols-3 gap-4 font-bold mb-4">
          <div className="text-black">{empleado.citas}</div>
          <div className="text-black">{empleado.inasistencias}</div>
          <div className="text-black">{empleado.ingresosTotales}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded">
        <div className="mb-4">
          <h3 className="text-black poppins font-semibold">Días de Trabajo</h3>
          <p className="text-black">{diasTrabajo}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-black poppins font-semibold">Servicios que Realiza</h3>
          <div className="flex flex-wrap gap-2">
            {empleado.servicios.map((servicioId, index) => (
              <div
                key={index}
                className="px-4 py-2 border border-gray-400 rounded-[10px] text-black poppins text-sm"
              >
                {servicioNombres[servicioId] || "Servicio Desconocido"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoDetails;

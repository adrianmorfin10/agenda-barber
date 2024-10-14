"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EmpleadosList from './EmpleadosList';
import EmpleadoDetails from './EmpleadosDetail';
import SubNavBar from '../components/SubNavBar'; // Asegúrate de que la ruta sea correcta

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

const Empleados = () => {
  const initialEmpleados: Empleado[] = Array.from({ length: 10 }, (_, index) => ({
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

  const [empleados] = useState<Empleado[]>(initialEmpleados);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSelectEmpleado = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
  };

  return (
    <div className="bg-white h-screen p-5 flex flex-col">
      <SubNavBar />

      <div className="flex flex-row w-full">
        <div className={`${selectedEmpleado ? 'hidden' : 'block'} md:block w-full md:w-1/3`}>
          <EmpleadosList
            empleados={empleados}
            onSelectEmpleado={handleSelectEmpleado}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className={`${selectedEmpleado ? 'block' : 'hidden'} md:block w-full md:w-2/3`}>
          <EmpleadoDetails
            empleado={selectedEmpleado}
            onBack={() => setSelectedEmpleado(null)} // Opción para regresar a la lista
          />
        </div>
      </div>
    </div>
  );
};

export default Empleados;

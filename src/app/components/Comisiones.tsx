"use client";

import React, { useState } from 'react';
import SelectorArbol from './SelectorArbol';
import DetallesComisiones from './DetallesComisiones';
import SubNavBar from './SubNavBar';

interface Comision {
  empleadoId: number;
  comisionProducto: number;
  comisionServicio: number;
  comisionMembresia: number;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

const Comisiones: React.FC = () => {
  const [empleados] = useState<Empleado[]>([
    { id: 1, nombre: 'Juan', apellido: 'Pérez' },
    { id: 2, nombre: 'María', apellido: 'Gómez' },
  ]);

  const [comisiones, setComisiones] = useState<Comision[]>([
    { empleadoId: 1, comisionProducto: 0, comisionServicio: 0, comisionMembresia: 0 },
    { empleadoId: 2, comisionProducto: 0, comisionServicio: 0, comisionMembresia: 0 },
  ]);

  const [selectedEmpleado, setSelectedEmpleado] = useState<'todos' | Empleado>('todos');
  const [activeTree, setActiveTree] = useState<string | null>(null);

  return (
    <div className="bg-white h-screen p-5 flex flex-col">
      <SubNavBar />
      <div className="flex flex-grow">
        <SelectorArbol
          empleados={empleados}
          selectedEmpleado={selectedEmpleado}
          setSelectedEmpleado={setSelectedEmpleado}
          activeTree={activeTree}
          setActiveTree={setActiveTree}
        />
        <DetallesComisiones
          selectedEmpleado={selectedEmpleado}
          comisiones={comisiones}
          setComisiones={setComisiones}
          activeTree={activeTree}
        />
      </div>
    </div>
  );
};

export default Comisiones;

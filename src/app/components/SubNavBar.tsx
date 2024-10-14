"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

const SubNavBar = () => {
  const pathname = usePathname(); // Usa usePathname para obtener la ruta actual

  const isComisiones = pathname === '/comisiones';
  const isEmpleados = pathname === '/empleados';

  return (
    <div className="flex justify-start items-center p-4 bg-white border-b text-black">
      <div
        className={`cursor-pointer poppins font-medium text-lg mr-5 ${isEmpleados ? 'border-b-2 border-black' : ''}`}
        onClick={() => window.location.href = '/empleados'} // Navegación simple
      >
        Empleados
      </div>
      <div
        className={`cursor-pointer poppins font-medium text-lg ${isComisiones ? 'border-b-2 border-black' : ''}`}
        onClick={() => window.location.href = '/comisiones'} // Navegación simple
      >
        Comisiones
      </div>
    </div>
  );
};

export default SubNavBar;

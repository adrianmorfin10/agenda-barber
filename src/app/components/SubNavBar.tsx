"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppContext } from './AppContext';

const SubNavBar = () => {
  const [state, dispatchState] = React.useContext(AppContext);
  
  const pathname = usePathname(); // Usa usePathname para obtener la ruta actual
  const isComisiones = pathname === '/comisiones';
  const isEmpleados = pathname === '/empleados';
  if(state.user && state.user.rol === "encagado")
    return null;
  return (
    <div className="flex justify-start items-center p-4 pb-0 bg-white border-b text-black">
      <div
        className={`cursor-pointer poppins font-medium text-lg mr-5 ${isEmpleados ? 'border-b-2 border-black' : ''}`}
        onClick={() => window.location.href = '/empleados'} // Navegación simple
      >
        Empleados
      </div>
      {
        (state.user && state.user.rol !== "encargado") &&
        <div
          className={`cursor-pointer poppins font-medium text-lg ${isComisiones ? 'border-b-2 border-black' : ''}`}
          onClick={() => window.location.href = '/comisiones'} // Navegación simple
        >
          Comisiones
        </div>
      }
      
    </div>
  );
};

export default SubNavBar;

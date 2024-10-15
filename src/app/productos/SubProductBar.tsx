// src/app/productos/SubProductBar.tsx

"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

const SubProductBar = () => { // Asegúrate de que el nombre del componente sea correcto
  const pathname = usePathname(); 

  const isProductos = pathname === '/productos';
  const isServicios = pathname === '/servicios';
  const isMembresias = pathname === '/membresias';

  return (
    <div className="flex justify-start items-center p-4 pb-0 bg-white border-b text-black">
      <div
        className={`cursor-pointer poppins font-medium text-lg mr-5 ${isProductos ? 'border-b-2 border-black' : ''}`}
        onClick={() => window.location.href = '/productos'}
      >
        Productos
      </div>
      <div
        className={`cursor-pointer poppins font-medium text-lg mr-5 ${isServicios ? 'border-b-2 border-black' : ''}`}
        onClick={() => window.location.href = '/servicios'}
      >
        Servicios
      </div>
      <div
        className={`cursor-pointer poppins font-medium text-lg ${isMembresias ? 'border-b-2 border-black' : ''}`}
        onClick={() => window.location.href = '/membresias'}
      >
        Membresías
      </div>
    </div>
  );
};

export default SubProductBar; // Asegúrate de que aquí también se exporte correctamente

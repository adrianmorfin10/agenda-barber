// src/app/page.tsx

'use client';

import React, { useState } from 'react';
import RepNavBar from '../components/RepNavBar'; // Importa el componente RepNavBar
import Reportess from './Reportes'; // Asegúrate de que la ruta sea correcta

const Page: React.FC = () => {
  // Define la función onDateChange
  const handleDateChange = (date: Date) => {
    console.log('Fecha seleccionada:', date);
  };

  return (
    <main className="min-h-screen bg-white p-4">
      {/* Barra de navegación */}
      <RepNavBar /> {/* Aquí se usa el componente RepNavBar */}

      {/* Contenido de la página */}
      <Reportess onDateChange={handleDateChange} /> {/* Pasamos onDateChange a Reportess */}
    </main>
  );
};

export default Page;

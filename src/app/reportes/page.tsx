// src/app/page.tsx

'use client';

import React from 'react';
import RepNavBar from '../components/RepNavBar'; // Importa el componente RepNavBar
import Reportes from './Reportes'; // Asegúrate de que la ruta sea correcta

const Page: React.FC = () => {
  return (
    <main className="min-h-screen bg-white p-4">
      {/* Barra de navegación */}
      <RepNavBar /> {/* Aquí se usa el componente RepNavBar */}

      {/* Contenido de la página */}
      <Reportes />
    </main>
  );
};

export default Page;

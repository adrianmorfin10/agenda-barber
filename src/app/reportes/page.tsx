// page.tsx
'use client';

import React from 'react';
import DateSelector from './DateSelector';
import Reportess from './Reportes'; // Asegúrate de que la ruta sea correcta

const Page: React.FC = () => {
  const handleDateChange = (date: Date) => {
    console.log('Fecha seleccionada:', date);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Reportess onDateChange={handleDateChange} />
    </main>
  );
};

export default Page;

// page.tsx
'use client';

import React from 'react';
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

// import React from "react";
// import UnderConstruction from "../components/UnderConstruction";

// const Page = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-white">
//       <UnderConstruction />
//     </div>
//   );
// };

// export default Page;


// src/app/productos/page.tsx

"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React from 'react';
import SubProductBar from '../components/SubProductBar'; // Importa tu SubProductBar
import ProductList from './ProductList';

const ProductsPage: React.FC = () => {
  return (
    <div className="bg-white text-black p-4 min-h-screen">
      <SubProductBar />
      <h1 className="text-2xl font-bold mb-4 text-black bg-white pt-4 pl-4">Productos</h1> 
      <ProductList />
    </div>
  );
};

export default ProductsPage;
// "use client";

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


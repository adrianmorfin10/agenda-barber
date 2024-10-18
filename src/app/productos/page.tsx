// src/app/productos/page.tsx

"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React from 'react';
import SubProductBar from '../components/SubProductBar'; // Importa tu SubProductBar
import ProductList from './ProductList';

const ProductsPage: React.FC = () => {
  return (
    <div className="bg-white text-black p-4 min-h-screen">
      <SubProductBar /> {/* Agrega tu SubProductBar aquí */}
      <h1 className="text-2xl font-bold mb-4 text-black bg-white pt-4 pl-4">Productos</h1> {/* Padding superior agregado aquí */}
      <ProductList />
    </div>
  );
};

export default ProductsPage;

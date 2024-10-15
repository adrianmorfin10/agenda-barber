// src/app/productos/[idproducto]/page.tsx

import React from 'react';
import ProductDetail from './detail'; // Importa el componente de detalles

const ProductPage = () => {
  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <ProductDetail /> {/* Renderiza el componente de detalles del producto */}
    </div>
  );
};

export default ProductPage;

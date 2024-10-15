// src/app/productos/[idproducto]/page.tsx

"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Importa Link

const ProductDetail = () => {
  const { idproducto } = useParams(); // Usar useParams de next/navigation

  // Simulación de productos (esto debe ser reemplazado con datos reales)
  const products = [
    { id: '1', nombre: 'Producto 1', marca: 'Marca A', stock: 100, precio: 29.99 },
    { id: '2', nombre: 'Producto 2', marca: 'Marca B', stock: 50, precio: 49.99 },
    // Añadir más productos según sea necesario
  ];

  // Busca el producto según el ID
  const product = products.find((p) => p.id === idproducto);

  if (!product) {
    return <div>Producto no encontrado</div>; // Maneja el caso en que no se encuentre el producto
  }

  return (
    <div className="p-4">
      <Link href="/productos" className="flex items-center mb-4 text-blue-500 hover:underline">
        {/* Flecha hacia atrás */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10.293 15.293a1 1 0 010-1.414L12.586 12H4a1 1 0 110-2h8.586l-2.293-1.879a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Regresar a Productos
      </Link>

      <h1 className="text-2xl font-bold">Detalles del Producto</h1>
      <p><strong>Nombre:</strong> {product.nombre}</p>
      <p><strong>Marca:</strong> {product.marca}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Precio:</strong> ${product.precio}</p>
    </div>
  );
};

export default ProductDetail;

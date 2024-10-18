// src/app/productos/[idproducto]/page.tsx

"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Importa Link
import Image from 'next/image'; // Importa Image para manejar imágenes

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
      <Link href="/productos" className="flex items-center mb-4 text-black hover:underline">
        {/* Ícono de retroceso */}
        <Image
          src="/img/back.svg" // Ruta al archivo SVG
          alt="Regresar"
          width={20}
          height={40}
          className="mr-2" // Margen derecho para espacio entre el ícono y el texto
        />
        <span className="text-black">Regresar a Productos</span>
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

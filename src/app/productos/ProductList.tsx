// src/app/productos/ProductList.tsx

"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React, { useState } from 'react';
import AddProductModal from './AddProductModal';
import Link from 'next/link'; // Asegúrate de importar Link

interface Product {
  id: number; // o string, según lo que estés usando como identificador
  nombre: string;
  marca: string;
  stock: number;
  precio: number;
  foto: string; // La URL o la ruta de la imagen
}

const ProductList: React.FC = () => {
  // Agrega algunos productos de ejemplo
  const initialProducts: Product[] = [
    { id: 1, nombre: "Producto A", marca: "Marca A", stock: 10, precio: 100, foto: "url_a_la_imagen_A" },
    { id: 2, nombre: "Producto B", marca: "Marca B", stock: 5, precio: 200, foto: "url_a_la_imagen_B" },
    { id: 3, nombre: "Producto C", marca: "Marca C", stock: 0, precio: 150, foto: "url_a_la_imagen_C" },
  ];

  const [products, setProducts] = useState<Product[]>(initialProducts); // Estado para los productos
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]); // Agregar el nuevo producto
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Agregar Producto
      </button>
      <AddProductModal 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen} 
        onAddProduct={handleAddProduct} 
      />
      <table className="mt-4 w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nombre del Producto</th>
            <th className="px-4 py-2 text-left">Marca</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-left">Precio</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="px-4 py-2">
                <Link href={`/productos/${product.id}`} className="text-blue-500 hover:underline">
                  {product.nombre}
                </Link>
              </td>
              <td className="px-4 py-2">{product.marca}</td>
              <td className="px-4 py-2">{product.stock}</td>
              <td className="px-4 py-2">{product.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;

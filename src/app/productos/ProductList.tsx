"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React, { useState } from 'react';
import AddProductModal from './AddProductModal';
import Link from 'next/link'; // Asegúrate de importar Link
import Image from 'next/image'; // Importa el componente Image para cargar el ícono

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
      <h2 className="text-xl font-bold mb-4">Lista de productos</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-300 p-2 text-left">Nombre del Producto</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Marca</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Stock</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Precio</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-100 cursor-pointer border-b">
              <td className="border-b border-gray-200 p-2">
                <Link href={`/productos/${product.id}`} className="hover:no-underline">
                  {product.nombre}
                </Link>
              </td>
              <td className="border-b border-gray-200 p-2">{product.marca}</td>
              <td className="border-b border-gray-200 p-2">{product.stock}</td>
              <td className="border-b border-gray-200 p-2">${product.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center bg-white text-black border border-black border-dashed py-2 px-4 rounded hover:bg-gray-100 mt-4" // Cambiado a fondo blanco y borde punteado
      >
        <Image src="/img/plus.svg" alt="Agregar producto" width={16} height={16} className="mr-2" />
        Agregar Producto
      </button>
      <AddProductModal 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen} 
        onAddProduct={handleAddProduct} 
      />
    </div>
  );
};

export default ProductList;

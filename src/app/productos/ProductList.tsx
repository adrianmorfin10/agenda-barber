"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React, { useState } from 'react';
import AddProductModal from './AddProductModal';
import Link from 'next/link'; // Asegúrate de importar Link
import Image from 'next/image'; // Importa el componente Image para cargar el ícono
import ProductoService from '../services/ProductoService';
import { AppContext } from '../components/AppContext';
const productoObject = new ProductoService();
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
  const [products, setProducts] = useState<Product[]>([]); // Estado para los productos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, dispatchState] = React.useContext(AppContext);
  const getProductos = ()=>{
    productoObject.getProductos(state.sucursal ? { local_id: state.sucursal.id } : false).then(response=>{
      const productos = response.map((item: any)=>{
        const { precio_productos, id, nombre, marca, stock } = item;
        return { id, nombre, marca, stock, precio: precio_productos.length ? precio_productos[0].precio : 0  }
      });
      setProducts(productos)
    })
  }
  React.useEffect(()=>{
    if(state.sucursal?.id)
      getProductos();
  },[state.sucursal])
  const handleAddProduct = () => {
    getProductos();// Agregar el nuevo producto
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
            <th className="border-b-2 border-gray-300 p-2 text-left"></th>
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
              <td className="border-b border-gray-200 p-2">
                <button onClick={()=>{ 
                  if(confirm('Esta seguro de eliminar este producto ?'))
                    productoObject.deleteProducto(product.id).then(()=>getProductos()).catch(()=>alert('Ha ocurrido un error al eleminiar el producto'))
                }} className="border border-red-400 text-red-400 px-4 py-2 rounded text-sm md:text-base">
                  Borrar
                </button>
              </td>
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

"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface AddProductModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onAddProduct: (newProduct: {
    id: number;
    nombre: string;
    marca: string;
    stock: number;
    precio: number;
    foto: string; // Cambiado a string para la URL de la imagen
  }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isModalOpen, setIsModalOpen, onAddProduct }) => {
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    marca: '',
    stock: 0,
    precio: 0,
    foto: '', // Cambiado a string para la URL de la imagen
  });

  const [imageLoaded, setImageLoaded] = useState(false); // Estado para controlar si la imagen se cargó

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoProducto({ ...nuevoProducto, foto: reader.result as string });
        setImageLoaded(true); // Indica que la imagen se ha cargado
      };
      reader.readAsDataURL(file); // Cargar la imagen como URL
    }
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(), // O un método adecuado para asignar IDs
      nombre: nuevoProducto.nombre,
      marca: nuevoProducto.marca,
      stock: nuevoProducto.stock,
      precio: nuevoProducto.precio,
      foto: nuevoProducto.foto,
    };
    onAddProduct(newProduct);
    setNuevoProducto({
      nombre: '',
      marca: '',
      stock: 0,
      precio: 0,
      foto: '',
    });
    setIsModalOpen(false);
    setImageLoaded(false); // Reinicia el estado de carga de imagen
  };

  const handleImageUploadClick = () => {
    document.getElementById('fileInput')?.click(); // Simula un clic en el input de archivo
  };

  if (!isModalOpen) return null;

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-[10px] max-w-[450px] w-full">
            <div className="flex items-center mb-4">
              <Image
                src="/img/closemodal.svg"
                alt="Cerrar"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              />
              <h2 className="text-lg font-semibold ml-2 text-[#0C101E]">Agregar Producto</h2>
            </div>

            {/* Campo para cargar foto */}
            <div className="mb-4 flex">
              <div className="mr-4 flex-grow">
                <label className="block text-sm text-gray mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del Producto"
                  value={nuevoProducto.nombre}
                  onChange={handleInputChange}
                  className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
                  maxLength={50}
                  required
                />
                <label className="block text-sm text-gray mb-1">Marca</label>
                <input
                  type="text"
                  name="marca"
                  placeholder="Marca"
                  value={nuevoProducto.marca}
                  onChange={handleInputChange}
                  className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
                  maxLength={50}
                  required
                />
              </div>

              {/* Contenedor para la imagen cargada */}
              <div className="flex flex-col items-center justify-center border border-dashed border-[#CACACA] p-2 rounded-[5px] w-36 h-[136px]"> {/* Cambié el ancho a 9 rem (36 px) */}
                {imageLoaded ? (
                  <>
                    <Image
                      src="/img/check.svg" // Cambia esta ruta a la ubicación del icono de verificación
                      alt="Subida exitosa"
                      width={24}
                      height={24}
                      className="mb-1"
                    />
                    <p className="text-xs text-green-600">Subida exitosa</p>
                    <Image
                      src={nuevoProducto.foto}
                      alt="Vista previa de la imagen"
                      width={50}
                      height={50}
                      className="mt-2"
                    />
                    <p
                      className="text-xs text-blue-600 cursor-pointer mt-1"
                      onClick={handleImageUploadClick} // Permite volver a cargar la imagen
                    >
                      Reemplazar imagen
                    </p>
                  </>
                ) : (
                  <div
                    className="flex items-center justify-center w-full h-full cursor-pointer"
                    onClick={handleImageUploadClick}
                  >
                    <Image
                      src="/img/foto.svg" // Cambia esta ruta a la ubicación del icono de carga
                      alt="Cargar Foto"
                      width={50}
                      height={50}
                      className="cursor-pointer"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden" // Oculta el input de archivo
                  id="fileInput" // Agrega un id para referenciar el input
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={nuevoProducto.stock}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: Number(e.target.value) })}
                className="border p-2 mb-2 w-full rounded-[5px] text-[#A1A1A1] placeholder-gray"
                maxLength={50}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray mb-1">Precio</label>
              <div className="relative">
                <Image
                  src="/img/money.svg" // Cambia esta ruta a la ubicación del icono de dinero
                  alt="Icono de Precio"
                  width={20}
                  height={20}
                  className="absolute left-2"
                  style={{ top: '37%', transform: 'translateY(-50%)' }} // Ajusta el icono
                />
                <input
                  type="number"
                  name="precio"
                  placeholder="Precio"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: Number(e.target.value) })}
                  className="border p-2 pl-8 mb-4 w-full rounded-[5px] text-[#A1A1A1] placeholder-gray"
                  maxLength={50}
                  required
                />
              </div>
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-black text-white py-2 px-4 rounded-[5px] w-full"
            >
              Añadir Producto
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductModal;

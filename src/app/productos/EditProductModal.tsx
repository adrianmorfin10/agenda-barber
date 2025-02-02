"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ProductoService from '../services/ProductoService';
import { AppContext } from '../components/AppContext';
const productoObject = new ProductoService();

interface EditProductModalProps {
    product: any;
    onClose: () => void;
    onSaveSuccess: ()=>void;
    open: boolean;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ onClose, onSaveSuccess, open, product }) => {
 
  const [state, dispatchState] = React.useContext(AppContext);
  const [editProduct, setEditProduct] = React.useState(product);
  const [saving, setSaving] = React.useState(false);
  React.useEffect(()=>{
    setEditProduct(product)
  }, [product])

  const saveProduct = ()=>{
    setSaving(true);
    productoObject.saveProduct(editProduct).then(()=>{
        setSaving(false);
        onSaveSuccess()
    }).catch(()=>{
        setSaving(false)
        alert("Ha ocurrido un error al actualizar el producto")
    })
  }
  if (!open) return null;

  return (
    
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-[10px] max-w-[450px] w-full">
            <div className="flex items-center mb-4">
              <Image
                src="/img/closemodal.svg"
                alt="Cerrar"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => onClose()}
              />
              <h2 className="text-lg font-semibold ml-2 text-[#0C101E]">Editar Producto</h2>
            </div>

            {/* Campo para cargar foto */}
            <div className="mb-4 flex">
              <div className="mr-4 flex-grow">
                <label className="block text-sm text-gray mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del Producto"
                  value={editProduct.nombre}
                  onChange={(e)=>setEditProduct({ ...editProduct, nombre: e.target.value })}
                  className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
                  maxLength={50}
                  required
                />
                <label className="block text-sm text-gray mb-1">Marca</label>
                <input
                  type="text"
                  name="marca"
                  placeholder="Marca"
                  value={editProduct.marca}
                  onChange={(e)=>setEditProduct({ ...editProduct, marca: e.target.value })}
                  className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
                  maxLength={50}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={editProduct.stock}
                onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
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
                  value={editProduct.precio}
                  onChange={(e) => setEditProduct({ ...editProduct, precio: Number(e.target.value) })}
                  className="border p-2 pl-8 mb-4 w-full rounded-[5px] text-[#A1A1A1] placeholder-gray"
                  maxLength={50}
                  required
                />
              </div>
            </div>
            {
                !saving ?
                <button
                    onClick={()=>saveProduct()}
                    className="bg-black text-white py-2 px-4 rounded-[5px] w-full"
                >
                    Guardar
                </button> :
                <label className="block text-sm text-gray mb-1">Guardando ...</label>
            }
            
          </div>
        </div>
     
  );
};

export default EditProductModal;

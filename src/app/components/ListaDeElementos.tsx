"use client";

import React from 'react';
import { AppContext } from './AppContext';
import ProductoService from '../services/ProductoService';
const productoObject = new ProductoService();
type SectionType = "Por Cobrar" | "Productos" | "Membresías";

interface Item {
  id: number;
  nombre: string;
  precio: number;
}

interface ListaDeElementosProps {
  section: SectionType;
  onAddToCart: (item: Item) => void;
}

const ListaDeElementos: React.FC<ListaDeElementosProps> = ({ section, onAddToCart }) => {
  const [ items, setItems] = React.useState<Record<SectionType, Item[]>>({
    // "Venta Rápida": [
    //   { id: 1, nombre: "Corte de Cabello", precio: 100 },
    //   { id: 2, nombre: "Peinado", precio: 80 },
    // ],
    "Por Cobrar": [
      // { id: 3, nombre: "Corte de Cabello - Juan", precio: 100 },
      // { id: 4, nombre: "Coloración - María", precio: 150 },
    ],
    "Productos": [
      // { id: 5, nombre: "Producto A", precio: 50 },
      // { id: 6, nombre: "Producto B", precio: 120 },
    ],
    "Membresías": [
      // { id: 7, nombre: "Black", precio: 300 },
      // { id: 8, nombre: "White", precio: 200 },
    ],
  })
 
  const [ state, dispatchState ]= React.useContext(AppContext);

  React.useEffect(() => {
 
    
      productoObject.getProductos(state.sucursal ? { local_id: state.sucursal.id } : false).then(response=>{
        const productos = response.map((item: any)=>{
          const { precio_productos, id, nombre, } = item;
          return { id, nombre, precio: precio_productos.length ? precio_productos[0].precio : 0  }
        });
        setItems({ ...items, ["Productos"]: productos })
      })
    
  
  }, [state.sucursal]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{section}</h2>
      <ul className="space-y-2">
        {(items[section] || []).map((item) => (
          <li
            key={item.id}
            onClick={() => onAddToCart(item)}
            className="p-3 bg-white rounded cursor-pointer hover:bg-gray-100 flex justify-between shadow"
          >
            <span>{item.nombre}</span>
            <span>${item.precio}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaDeElementos;

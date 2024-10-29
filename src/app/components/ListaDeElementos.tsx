"use client";

import React from 'react';

type SectionType = "Venta Rápida" | "Por Cobrar" | "Productos" | "Membresías";

interface ListaDeElementosProps {
  section: SectionType;
  onAddToCart: (item: any) => void;
}

const ListaDeElementos: React.FC<ListaDeElementosProps> = ({ section, onAddToCart }) => {
  const items: Record<SectionType, { id: number; nombre: string; precio: number }[]> = {
    "Venta Rápida": [
      { id: 1, nombre: "Corte de Cabello", precio: 100 },
      { id: 2, nombre: "Peinado", precio: 80 },
    ],
    "Por Cobrar": [
      { id: 3, nombre: "Corte de Cabello - Juan", precio: 100 },
      { id: 4, nombre: "Coloración - María", precio: 150 },
    ],
    "Productos": [
      { id: 5, nombre: "Producto A", precio: 50 },
      { id: 6, nombre: "Producto B", precio: 120 },
    ],
    "Membresías": [
      { id: 7, nombre: "Black", precio: 300 },
      { id: 8, nombre: "White", precio: 200 },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{section}</h2>
      <ul className="space-y-2">
        {items[section].map((item) => (
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

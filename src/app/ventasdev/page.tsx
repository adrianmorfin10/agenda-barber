"use client";

import React, { useState } from 'react';
import SidebarVentas from '../components/SidebarVentas';
import ListaDeElementos from '../components/ListaDeElementos';
import Carrito from '../components/Carrito';

// Define SectionType en VentasPage para mantener compatibilidad con ListaDeElementos
type SectionType = "Venta Rápida" | "Por Cobrar" | "Productos" | "Membresías";

// Define el tipo de los elementos en el carrito
interface CartItemType {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

const VentasPage: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>("Venta Rápida"); // Selección predeterminada
  const [cartItems, setCartItems] = useState<CartItemType[]>([]); // Elementos en el carrito

  const handleAddToCart = (item: Omit<CartItemType, 'cantidad'>) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, cantidad: cartItem.cantidad + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, cantidad: 1 }];
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar con los títulos de las secciones */}
      <SidebarVentas
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />

      {/* Columna central que muestra los elementos de la sección seleccionada */}
      <div className="flex-1 p-6 bg-gray-50">
        {selectedSection ? (
          <ListaDeElementos section={selectedSection} onAddToCart={handleAddToCart} />
        ) : (
          <p className="text-lg text-gray-500">Seleccione una sección para ver los elementos.</p>
        )}
      </div>

      {/* Componente de Carrito con diseño responsive */}
      <div className="hidden lg:block w-[450px] p-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Detalle de Venta</h1>
        <Carrito items={cartItems} />
      </div>

      {/* Carrito móvil (ventana emergente en la parte inferior de la pantalla) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t p-4 shadow-lg">
        <button
          className="w-full bg-black text-white py-2 rounded-lg"
          onClick={() => console.log("Abrir carrito completo")}
        >
          Ver Carrito / Ir a Pagar
        </button>
      </div>
    </div>
  );
};

export default VentasPage;

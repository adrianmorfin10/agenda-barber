"use client";

import React, { useState, useRef } from 'react';
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
  const [selectedSection, setSelectedSection] = useState<SectionType>("Productos"); // Selección predeterminada
  const [cartItems, setCartItems] = useState<CartItemType[]>([]); // Elementos en el carrito
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // Estado para controlar la visibilidad del carrito modal
  const listaDeElementosRef = useRef<any>(null);

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

  const onCheckOutSuccess = () => {
    setCartItems([]);
    if (listaDeElementosRef.current) {
      listaDeElementosRef.current.refreshData(); // Llamar a la función interna
    }
    alert("Su venta se registro correctamente");
  }

  const openCart = () => setIsCartModalOpen(true); // Función para abrir el modal del carrito
  const closeCart = () => setIsCartModalOpen(false); // Función para cerrar el modal del carrito

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
          <ListaDeElementos ref={listaDeElementosRef} section={selectedSection} onAddToCart={handleAddToCart} />
        ) : (
          <p className="text-lg text-gray-500">Seleccione una sección para ver los elementos.</p>
        )}
      </div>

      {/* Componente de Carrito con diseño responsive */}
      <div className="hidden lg:block w-[450px] p-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Detalle de Venta</h1>
        <Carrito items={cartItems} onCheckOutSuccess={onCheckOutSuccess} />
      </div>

      {/* Contenedor con el botón de "Ver Carrito / Ir a Pagar" */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white p-4 shadow-md">
        <button
          className="w-full bg-black text-white py-3 rounded-lg"
          onClick={openCart} // Abre el carrito cuando se hace clic en el botón
        >
          Ver Carrito / Ir a Pagar
        </button>
      </div>

      {/* Modal del carrito en pantallas pequeñas */}
      {isCartModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md h-full animate-slideInFromRight relative">
            <h1 className="text-2xl font-bold mb-4">Detalle de Venta</h1>
            <Carrito items={cartItems} onCheckOutSuccess={onCheckOutSuccess} />

            {/* Ícono de cierre */}
            <button
              className="absolute top-2 right-2"
              onClick={closeCart} // Cierra el carrito cuando se hace clic en el ícono
            >
              <img src="/img/closemodal.svg" alt="Cerrar" className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentasPage;


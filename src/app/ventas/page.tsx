"use client";

import React, { useState, useRef } from "react";
import SidebarVentas from "../components/SidebarVentas";
import ListaDeElementos from "../components/ListaDeElementos";
import Carrito from "../components/Carrito";

// Define SectionType de manera consistente
type SectionType = "Venta Rápida" | "Por Cobrar" | "Productos" | "Membresías" | "Ventas Realizadas";

interface CartItemType {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  type: string;
}

const VentasPage: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>("Productos");
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const listaDeElementosRef = useRef<any>(null);

  const handleAddToCart = (item: Omit<CartItemType, "cantidad">) => {
    setCartItems((prevItems) => {
      console.log("item", item)
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id && cartItem.type === item.type);
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

  const lessCartItems = (index:number)=>{
    const tmpCarItems = [ ...cartItems ];
    if(tmpCarItems[index].cantidad > 1)
      tmpCarItems[index].cantidad--;
    else
      tmpCarItems.splice(index, 1);
    setCartItems(tmpCarItems)
  }
  const onCheckOutSuccess = () => {
    setCartItems([]);
    if (listaDeElementosRef.current) {
      listaDeElementosRef.current.refreshData();
    }
    alert("Su venta se registró correctamente");
  };

  const openCart = () => setIsCartModalOpen(true);
  const closeCart = () => setIsCartModalOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <SidebarVentas
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />

      <div className="flex-1 p-6 bg-gray-50">
        {selectedSection && selectedSection !== "Ventas Realizadas" ? (
          <ListaDeElementos ref={listaDeElementosRef} section={selectedSection} onAddToCart={handleAddToCart} />
        ) : selectedSection === "Ventas Realizadas" ? (
          <p className="text-lg text-gray-500">Redirigiendo a Ventas Realizadas...</p>
        ) : (
          <p className="text-lg text-gray-500">Seleccione una sección para ver los elementos.</p>
        )}
      </div>

      <div className="hidden lg:block w-[450px] p-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Detalle de Venta</h1>
        <Carrito items={cartItems} onCheckOutSuccess={onCheckOutSuccess} onLessItem={(index:number)=>lessCartItems(index)}/>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white p-4 shadow-md">
        <button
          className="w-full bg-black text-white py-3 rounded-lg"
          onClick={openCart}
        >
          Ver Carrito / Ir a Pagar
        </button>
      </div>

      {isCartModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md h-full animate-slideInFromRight relative">
            <h1 className="text-2xl font-bold mb-4">Detalle de Venta</h1>
            <Carrito items={cartItems} onCheckOutSuccess={onCheckOutSuccess} onLessItem={(index:number)=>lessCartItems(index)} />
            <button
              className="absolute top-2 right-2"
              onClick={closeCart}
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

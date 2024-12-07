"use client";

import React, { useState } from 'react';
import ClientesList from './Clienteslist';
import Image from 'next/image';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  instagram: string;
  citas: number;
  inasistencias: number;
  cancelaciones: number;
  ultimaVisita: string;
  descuento: string;
  ingresosTotales: string;
  membresia: string;
  tipo: string;
  serviciosDisponibles: number;
  proximoPago: string;
}

interface CarritoProps {
  items: CartItem[];
}

const Carrito: React.FC<CarritoProps> = ({ items }) => {
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState<number>(0);

  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleToggleClientList = () => {
    setIsClientListOpen((prev) => !prev);
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedClient(cliente);
    setIsClientListOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        {isClientListOpen && (
          <button onClick={() => setIsClientListOpen(false)} className="text-gray-500 flex items-center">
            <Image 
            width={24}
            height={24}
            src="/img/back.svg" 
            alt="Volver" 
            className="h-5 w-5 inline mr-2" />
            <span className="text-xl font-semibold">Selección de Cliente</span>
          </button>
        )}
        {!isClientListOpen && <h2 className="text-xl font-semibold"></h2>}
      </div>

      {!isClientListOpen && (
        <div className="mb-4 px-4">
          <div
            className="border-dashed border border-gray-400 p-4 rounded-lg cursor-pointer"
            onClick={handleToggleClientList}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-black text-white rounded-full h-[40px] w-[70px] flex items-center justify-center mr-3">
                  <Image 
                  width={20} // Set appropriate width
                  height={20} // Set appropriate height
                  src="/img/userw.svg" 
                  alt="Cliente" 
                  className="h-5 w-5" 
                  />
                </div>
                <span className="text-gray-500 font-light text-[16px]">
                  {selectedClient
                    ? `${selectedClient.nombre} ${selectedClient.apellido}`
                    : "Seleccione un cliente (opcional)"}
                </span>
              </div>
              <Image 
              width={20} // Set appropriate width
              height={20} // Set appropriate height
              src="/img/add.svg" 
              alt="Agregar cliente" 
              className="h-5 w-5 cursor-pointer" 
              />
            </div>
          </div>
        </div>
      )}

      {isClientListOpen ? (
        <ClientesList
          clientes={[ /* Clientes de ejemplo para probar */ ]}
          onSelectCliente={handleSelectCliente}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <>
          {/* Resto del código del componente */}
        </>
      )}
    </div>
  );
};

export default Carrito;

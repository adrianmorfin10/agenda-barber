"use client";

import React, { useState } from "react";
import ClientesList from "./Clienteslist";
import Image from "next/image";

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
          <button
            onClick={() => setIsClientListOpen(false)}
            className="text-gray-500 flex items-center"
          >
            <Image src="/img/back.svg" alt="Volver" width={20} height={20} className="inline mr-2" />
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
                  <Image src="/img/userw.svg" alt="Cliente" width={20} height={20} />
                </div>
                <span className="text-gray-500 font-light text-[16px]">
                  {selectedClient
                    ? `${selectedClient.nombre} ${selectedClient.apellido}`
                    : "Seleccione un cliente (opcional)"}
                </span>
              </div>
              <Image src="/img/add.svg" alt="Agregar cliente" width={20} height={20} />
            </div>
          </div>
        </div>
      )}

      {isClientListOpen ? (
        <ClientesList
          clientes={[] /* Clientes de ejemplo para probar */}
          onSelectCliente={handleSelectCliente}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <>
          {/* Títulos de columnas */}
          <div className="grid grid-cols-3 gap-4 mb-2 font-semibold text-gray-700">
            <div>Artículo</div>
            <div className="text-center">Cantidad</div>
            <div className="text-right">Subtotal</div>
          </div>

          {/* Lista de items del carrito */}
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
              >
                <span className="flex-1">{item.nombre}</span>
                <span className="text-right w-12 text-sm font-light text-gray-500">{`x${item.cantidad}`}</span>
                <span className="text-right w-20">${(item.precio * item.cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {/* Botón de agregar descuento */}
          <div className="flex justify-end mt-4">
            <div className="flex items-center">
              <label htmlFor="discount" className="text-sm font-semibold mr-2">
                Descuento:
              </label>
              <input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                className="border rounded p-1 w-24 text-right"
                placeholder="0"
                min="0"
              />
              <span className="ml-2">MXN</span>
            </div>
          </div>

          {/* Total y botón de pago */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold">Subtotal: ${subtotal.toFixed(2)}</h3>
            <h3 className="text-lg font-semibold">Total: ${(subtotal - discount).toFixed(2)}</h3>
            <button className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
              Proceder a Pago
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;

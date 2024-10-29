"use client";

import React, { useState } from 'react';
import ClientesList from './Clienteslist';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CarritoProps {
  items: CartItem[];
}

const Carrito: React.FC<CarritoProps> = ({ items }) => {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const total = Math.max(subtotal - discount, 0);

  const handleToggleClientList = () => {
    setIsClientListOpen((prev) => !prev);
  };

  const handleSelectCliente = (cliente: any) => {
    setSelectedClient(cliente);
    setIsClientListOpen(false);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discountValue = parseFloat(e.target.value);
    setDiscount(discountValue >= 0 ? discountValue : 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        {isClientListOpen && (
          <button onClick={() => setIsClientListOpen(false)} className="text-gray-500 flex items-center">
            <img src="/img/back.svg" alt="Volver" className="h-5 w-5 inline mr-2" />
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
                  <img src="/img/userw.svg" alt="Cliente" className="h-5 w-5" />
                </div>
                <span className="text-gray-500 font-light text-[16px]">
                  {selectedClient
                    ? `${selectedClient.nombre} ${selectedClient.apellido}`
                    : "Seleccione un cliente (opcional)"}
                </span>
              </div>
              <img src="/img/add.svg" alt="Agregar cliente" className="h-5 w-5 cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {isClientListOpen ? (
        <ClientesList
          clientes={[
            {
              id: 1,
              nombre: "Juan",
              apellido: "Pérez",
              telefono: "1234567890",
              instagram: "@juanperez",
              citas: 5,
              inasistencias: 1,
              cancelaciones: 0,
              ultimaVisita: "2024-10-01",
              descuento: "10%",
              ingresosTotales: "5000",
              membresia: "Black",
              tipo: "Frecuente",
              serviciosDisponibles: 3,
              proximoPago: "2024-11-01"
            },
            {
              id: 2,
              nombre: "María",
              apellido: "García",
              telefono: "0987654321",
              instagram: "@mariagarcia",
              citas: 3,
              inasistencias: 0,
              cancelaciones: 1,
              ultimaVisita: "2024-10-05",
              descuento: "5%",
              ingresosTotales: "3000",
              membresia: "White",
              tipo: "Nuevo",
              serviciosDisponibles: 2,
              proximoPago: "2024-11-15"
            }
          ]}
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
              <li key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow">
                <span className="flex-1">{item.nombre}</span>
                <span className="text-right w-12 text-sm font-light text-gray-500">{`x${item.cantidad}`}</span>
                <span className="text-right w-20">${(item.precio * item.cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {/* Botón de agregar descuento */}
          <div className="flex justify-end mt-4">
            {!showDiscountInput ? (
              <button
                onClick={() => setShowDiscountInput(true)}
                className="text-sm bg-gray-200 text-black px-3 py-1 rounded-lg hover:bg-gray-300"
              >
                + Descuento
              </button>
            ) : (
              <div className="flex items-center mt-4">
                <label className="text-sm font-semibold mr-2">Descuento:</label>
                <input
                  type="number"
                  value={discount}
                  onChange={handleDiscountChange}
                  className="border rounded p-1 w-24 text-right"
                  placeholder="0"
                  min="0"
                />
                <span className="ml-1">MXN</span>
              </div>
            )}
          </div>

          {/* Total y botón de pago */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold">Total: ${total.toFixed(2)}</h3>
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

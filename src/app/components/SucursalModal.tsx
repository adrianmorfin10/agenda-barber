"use client";

import React, { useState } from 'react';

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  encargado: string;
}

interface SucursalModalProps {
  sucursalSeleccionada: Sucursal;
  sucursales: Sucursal[];
  onSelect: (sucursal: Sucursal) => void;
  onAddSucursal: (sucursal: Sucursal) => void;
  onClose: () => void;
}

const SucursalModal: React.FC<SucursalModalProps> = ({ sucursalSeleccionada, sucursales, onSelect, onAddSucursal, onClose }) => {
  const [isAddingSucursal, setIsAddingSucursal] = useState(false); // Controla la vista de agregar sucursal
  const [nuevaSucursal, setNuevaSucursal] = useState<Sucursal>({ id: 0, nombre: "", direccion: "", encargado: "" });

  const handleAddSucursal = () => {
    if (nuevaSucursal.nombre && nuevaSucursal.direccion && nuevaSucursal.encargado) {
      onAddSucursal({ ...nuevaSucursal, id: sucursales.length + 1 });
      setNuevaSucursal({ id: 0, nombre: "", direccion: "", encargado: "" });
      setIsAddingSucursal(false); // Regresa a la vista de selección
    } else {
      alert("Todos los campos son obligatorios");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[600px] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-black mb-6 text-center">
          {isAddingSucursal ? "Agregar Nueva Sucursal" : "Selecciona una Sucursal"}
        </h2>

        {isAddingSucursal ? (
          // Vista de Agregar Nueva Sucursal
          <div className="flex flex-col space-y-4 mb-6">
            <input
              type="text"
              placeholder="Nombre de la Sucursal"
              value={nuevaSucursal.nombre}
              onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, nombre: e.target.value })}
              className="p-2 border rounded-md text-black"
            />
            <input
              type="text"
              placeholder="Dirección"
              value={nuevaSucursal.direccion}
              onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, direccion: e.target.value })}
              className="p-2 border rounded-md text-black"
            />
            <input
              type="text"
              placeholder="Encargado"
              value={nuevaSucursal.encargado}
              onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, encargado: e.target.value })}
              className="p-2 border rounded-md text-black"
            />

            <div className="flex justify-between space-x-4">
              <button
                onClick={handleAddSucursal}
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold w-full"
              >
                Agregar
              </button>
              <button
                onClick={() => setIsAddingSucursal(false)}
                className="border border-black text-black px-6 py-3 rounded-lg font-semibold w-full"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          // Vista de Selección de Sucursal
          <div>
            <div className="flex flex-col space-y-4 mb-6">
              {sucursales.map((sucursal) => (
                <button
                  key={sucursal.id}
                  onClick={() => onSelect(sucursal)}
                  className={`p-4 text-left rounded-md border ${sucursalSeleccionada.id === sucursal.id ? 'border-2 border-black bg-white text-black' : 'border border-gray-300 bg-gray-200 text-gray-700'}`}
                >
                  <div className="font-semibold text-black">{sucursal.nombre}</div>
                  <div className="text-sm text-black">{sucursal.direccion}</div>
                  <div className="text-sm text-black">Encargado: {sucursal.encargado}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between space-x-4">
              <button
                onClick={() => setIsAddingSucursal(true)}
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold w-full"
              >
                Añadir Nueva Sucursal
              </button>
              <button
                onClick={onClose}
                className="border border-black text-black px-6 py-3 rounded-lg font-semibold w-full"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SucursalModal;

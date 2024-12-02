"use client";

import React, { useState } from "react";
import SelectorArbol from "./SelectorArbol";
import SubNavBar from "./SubNavBar";

interface Comision {
  id: number;
  nombre: string;
  comision: number;
}

interface Categoria {
  general: number;
  items: Comision[];
}

interface EmpleadoComisiones {
  productos: Categoria;
  servicios: Categoria;
  membresias: Categoria;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

const Comisiones: React.FC = () => {
  const [empleados] = useState<Empleado[]>([
    { id: 1, nombre: "Juan", apellido: "Pérez" },
    { id: 2, nombre: "María", apellido: "Gómez" },
  ]);

  const [comisiones, setComisiones] = useState<Record<number, EmpleadoComisiones>>({
    1: {
      productos: {
        general: 10,
        items: [
          { id: 1, nombre: "Peine", comision: 10 },
          { id: 2, nombre: "Pomada", comision: 10 },
        ],
      },
      servicios: {
        general: 20,
        items: [
          { id: 1, nombre: "Corte Cabello", comision: 20 },
          { id: 2, nombre: "Corte Barba", comision: 20 },
        ],
      },
      membresias: {
        general: 10,
        items: [{ id: 1, nombre: "Membresía Básica", comision: 10 }],
      },
    },
    2: {
      productos: { general: 0, items: [] },
      servicios: { general: 0, items: [] },
      membresias: { general: 0, items: [] },
    },
  });

  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | "todos" | null>(null);
  const [activeTree, setActiveTree] = useState<"productos" | "servicios" | "membresias" | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGeneralComisionChange = (categoria: keyof EmpleadoComisiones, nuevaComision: number) => {
    if (!selectedEmpleado || selectedEmpleado === "todos") return;

    const empleadoId = selectedEmpleado.id;

    const updatedCategoria = {
      ...comisiones[empleadoId][categoria],
      general: nuevaComision,
      items: comisiones[empleadoId][categoria].items.map((item) => ({
        ...item,
        comision: nuevaComision,
      })),
    };

    setComisiones({
      ...comisiones,
      [empleadoId]: {
        ...comisiones[empleadoId],
        [categoria]: updatedCategoria,
      },
    });
  };

  const handleSpecificComisionChange = (
    categoria: keyof EmpleadoComisiones,
    itemId: number,
    nuevaComision: number
  ) => {
    if (!selectedEmpleado || selectedEmpleado === "todos") return;

    const empleadoId = selectedEmpleado.id;

    const updatedCategoria = {
      ...comisiones[empleadoId][categoria],
      items: comisiones[empleadoId][categoria].items.map((item) =>
        item.id === itemId ? { ...item, comision: nuevaComision } : item
      ),
    };

    setComisiones({
      ...comisiones,
      [empleadoId]: {
        ...comisiones[empleadoId],
        [categoria]: updatedCategoria,
      },
    });
  };

  const guardarComisiones = () => {
    if (!selectedEmpleado || selectedEmpleado === "todos" || !activeTree) {
      alert("Debe seleccionar un empleado y una categoría.");
      return;
    }

    setIsModalOpen(true); // Abrir modal
  };

  const cerrarModal = () => {
    setIsModalOpen(false); // Cerrar modal
  };

  return (
    <div className="bg-white h-screen p-5 flex flex-col">
      <SubNavBar />
      <div className="flex flex-grow">
        <SelectorArbol
          empleados={empleados}
          selectedEmpleado={selectedEmpleado}
          setSelectedEmpleado={setSelectedEmpleado}
          activeTree={activeTree}
          setActiveTree={setActiveTree}
        />
        <div className="flex-1 p-4 text-black">
          {selectedEmpleado && selectedEmpleado !== "todos" && activeTree && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-black">
                Comisiones de {selectedEmpleado.nombre} - {activeTree.charAt(0).toUpperCase() + activeTree.slice(1)}
              </h2>
              <div className="mb-4">
                <label className="block font-semibold mb-2 text-black">Comisión General</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={comisiones[selectedEmpleado.id][activeTree].general}
                    onChange={(e) =>
                      handleGeneralComisionChange(activeTree, Number(e.target.value))
                    }
                    className="border rounded p-2 w-24 text-black"
                  />
                  <button
                    onClick={guardarComisiones}
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Guardar
                  </button>
                </div>
              </div>
              <ul>
                {comisiones[selectedEmpleado.id][activeTree].items.map((item) => (
                  <li key={item.id} className="mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-black">{item.nombre}</span>
                      <input
                        type="number"
                        value={item.comision}
                        onChange={(e) =>
                          handleSpecificComisionChange(activeTree, item.id, Number(e.target.value))
                        }
                        className="border rounded p-2 w-24 text-black"
                      />
                      <button
                        onClick={guardarComisiones}
                        className="bg-black text-white px-4 py-2 rounded"
                      >
                        Guardar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-black">Comisiones Guardadas</h2>
            <p className="mb-4 text-black">Las comisiones se han guardado correctamente.</p>
            <button
              onClick={cerrarModal}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comisiones;

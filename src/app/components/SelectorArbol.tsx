import React from "react";

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

interface SelectorArbolProps {
  empleados: Empleado[];
  selectedEmpleado: "todos" | Empleado | null;
  setSelectedEmpleado: (empleado: "todos" | Empleado | null) => void;
  activeTree: string | null;
  setActiveTree: (tree: string | null) => void;
}

const SelectorArbol: React.FC<SelectorArbolProps> = ({
  empleados,
  selectedEmpleado,
  setSelectedEmpleado,
  activeTree,
  setActiveTree,
}) => {
  return (
    <div className="p-4 bg-gray-50 border-r border-gray-300 w-64 text-black">
      <h2 className="font-semibold text-lg mb-3">Seleccionar Empleado</h2>
      <select
        value={
          selectedEmpleado === "todos" || selectedEmpleado === null
            ? "todos"
            : selectedEmpleado.id.toString()
        }
        onChange={(e) => {
          const selectedValue = e.target.value;
          const selected =
            selectedValue === "todos"
              ? "todos"
              : empleados.find((emp) => emp.id === Number(selectedValue)) || null;
          setSelectedEmpleado(selected);
        }}
        className="w-full border border-gray-300 rounded p-2 text-black"
      >
        <option value="todos">Todos</option>
        {empleados.map((empleado) => (
          <option key={empleado.id} value={empleado.id}>
            {empleado.nombre} {empleado.apellido}
          </option>
        ))}
      </select>

      <h2 className="font-semibold text-lg mt-5 mb-3">Seleccionar Categoría</h2>
      <ul>
        {["productos", "servicios", "membresias"].map((tree) => (
          <li
            key={tree}
            className={`cursor-pointer p-2 rounded ${
              activeTree === tree ? "bg-blue-500 text-white" : "hover:bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTree(tree)}
          >
            {tree.charAt(0).toUpperCase() + tree.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectorArbol;

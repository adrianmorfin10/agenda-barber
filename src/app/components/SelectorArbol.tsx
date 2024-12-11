import React from "react";

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

interface SelectorArbolProps {
  empleados: Empleado[];
  selectedEmpleado: "Seleccionar" | Empleado | null;
  setSelectedEmpleado: (empleado: any) => void;
  activeTree: string | null;
  setActiveTree: (tree: any) => void;
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
      <h2 className="font-semibold text-lg mb-3">Empleado</h2>
      <select
        value={
          selectedEmpleado === "Seleccionar" || selectedEmpleado === null || !selectedEmpleado?.id
            ? "Seleccionar"
            : selectedEmpleado.id.toString()
        }
        onChange={(e) => {
          const selectedValue = e.target.value;
          const selected:any = empleados.find(item=>item.id.toString() === selectedValue.toString());
          setSelectedEmpleado(selected);
        }}
        className="w-full border border-gray-300 rounded p-2 text-black"
      >
        <option value="Seleccionar">Seleccionar</option>
        {empleados.map((empleado) => (
          <option key={empleado.id} value={empleado.id}>
            {empleado.nombre} {empleado.apellido}
          </option>
        ))}
      </select>

      <h2 className="font-semibold text-lg mt-5 mb-3">Seleccionar Categoría</h2>
      <ul>
        {["producto", "servicio", "membresia"].map((tree) => (
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

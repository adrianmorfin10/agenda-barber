// SelectorArbol.tsx
import React from 'react';

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

interface SelectorArbolProps {
  empleados: Empleado[];
  selectedEmpleado: 'todos' | Empleado;
  setSelectedEmpleado: React.Dispatch<React.SetStateAction<'todos' | Empleado>>;
  activeTree: string | null;
  setActiveTree: React.Dispatch<React.SetStateAction<string | null>>;
}

const SelectorArbol: React.FC<SelectorArbolProps> = ({
  empleados,
  selectedEmpleado,
  setSelectedEmpleado,
  activeTree,
  setActiveTree,
}) => {
  return (
    <div className="flex flex-col max-w-[260px] bg-white p-4 rounded shadow">
      <h2 className="font-semibold text-lg mb-3 text-black">Seleccionar Empleado</h2>
      <select
        value={selectedEmpleado === 'todos' ? 'todos' : selectedEmpleado.id.toString()}
        onChange={(e) => {
          const selected = e.target.value === 'todos' ? 'todos' : empleados.find(emp => emp.id === Number(e.target.value)) || { id: 0, nombre: '', apellido: '' };
          setSelectedEmpleado(selected);
        }}
        className="border rounded p-2 w-full"
      >
        <option value="todos">Todos los empleados</option>
        {empleados.map(empleado => (
          <option key={empleado.id} value={empleado.id}>
            {empleado.nombre} {empleado.apellido}
          </option>
        ))}
      </select>

      <h3 className="font-semibold text-lg mt-5 text-black">Árbol de Productos/Servicios</h3>
      <ul>
        <li onClick={() => setActiveTree('productos')} className={`cursor-pointer ${activeTree === 'productos' ? 'font-bold' : ''} text-black`}>
          Productos
        </li>
        <ul className={activeTree === 'productos' ? 'ml-5' : 'hidden'}>
          <li onClick={() => setActiveTree('peines')} className={`cursor-pointer ${activeTree === 'peines' ? 'font-bold' : ''} text-black`}>
            Peines
          </li>
          <li onClick={() => setActiveTree('pomadas')} className={`cursor-pointer ${activeTree === 'pomadas' ? 'font-bold' : ''} text-black`}>
            Pomadas
          </li>
        </ul>
        <li onClick={() => setActiveTree('servicios')} className={`cursor-pointer ${activeTree === 'servicios' ? 'font-bold' : ''} text-black`}>
          Servicios
        </li>
        <ul className={activeTree === 'servicios' ? 'ml-5' : 'hidden'}>
          <li onClick={() => setActiveTree('corte')} className={`cursor-pointer ${activeTree === 'corte' ? 'font-bold' : ''} text-black`}>
            Corte
          </li>
          <li onClick={() => setActiveTree('barba')} className={`cursor-pointer ${activeTree === 'barba' ? 'font-bold' : ''} text-black`}>
            Barba
          </li>
          <li onClick={() => setActiveTree('colorimetria')} className={`cursor-pointer ${activeTree === 'colorimetria' ? 'font-bold' : ''} text-black`}>
            Colorimetría
          </li>
        </ul>
        <li onClick={() => setActiveTree('membresias')} className={`cursor-pointer ${activeTree === 'membresias' ? 'font-bold' : ''} text-black`}>
          Membresías
        </li>
        <ul className={activeTree === 'membresias' ? 'ml-5' : 'hidden'}>
          <li onClick={() => setActiveTree('black')} className={`cursor-pointer ${activeTree === 'black' ? 'font-bold' : ''} text-black`}>
            Membresía Black
          </li>
          <li onClick={() => setActiveTree('white')} className={`cursor-pointer ${activeTree === 'white' ? 'font-bold' : ''} text-black`}>
            Membresía White
          </li>
        </ul>
      </ul>
    </div>
  );
};

export default SelectorArbol;

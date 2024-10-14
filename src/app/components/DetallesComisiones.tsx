import React from 'react';

interface Comision {
  empleadoId: number;
  comisionProducto: number;
  comisionServicio: number;
  comisionMembresia: number;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

interface DetallesComisionesProps {
  selectedEmpleado: 'todos' | Empleado | null;
  comisiones: Comision[];
  setComisiones: React.Dispatch<React.SetStateAction<Comision[]>>;
  activeTree: string | null;
}

const DetallesComisiones: React.FC<DetallesComisionesProps> = ({
  selectedEmpleado,
  comisiones,
  setComisiones,
  activeTree,
}) => {
  const handleComisionChange = (tipo: keyof Comision, nuevoValor: number) => {
    setComisiones(prevComisiones =>
      prevComisiones.map(comision =>
        comision.empleadoId === (selectedEmpleado === 'todos' ? -1 : selectedEmpleado?.id) 
          ? { ...comision, [tipo]: nuevoValor } 
          : comision
      )
    );
  };

  const comisionActual = comisiones.find(comision => comision.empleadoId === (selectedEmpleado === 'todos' ? -1 : selectedEmpleado?.id)) || { 
    empleadoId: -1, 
    comisionProducto: 0, 
    comisionServicio: 0, 
    comisionMembresia: 0 
  };

  return (
    <div className="mb-5 flex flex-col bg-white p-4 rounded shadow max-w-[500px] ml-5">
      <h2 className="font-semibold text-lg mb-3 text-black">Detalles de Comisiones</h2>
      <div>
        <h3 className="text-black">Comisión {activeTree}</h3>
        <div className="flex items-center">
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={
              activeTree === 'productos' 
                ? comisionActual.comisionProducto 
                : activeTree === 'servicios' 
                  ? comisionActual.comisionServicio 
                  : comisionActual.comisionMembresia
            }
            onChange={(e) => handleComisionChange(activeTree === 'productos' ? 'comisionProducto' : activeTree === 'servicios' ? 'comisionServicio' : 'comisionMembresia', Number(e.target.value))}
            placeholder={`Porcentaje de ${activeTree}`}
          />
          <span className="mx-2">%</span>
          <button onClick={() => handleComisionChange(activeTree === 'productos' ? 'comisionProducto' : activeTree === 'servicios' ? 'comisionServicio' : 'comisionMembresia', comisionActual.comisionProducto + 5)} className="border p-2">+</button>
          <button onClick={() => handleComisionChange(activeTree === 'productos' ? 'comisionProducto' : activeTree === 'servicios' ? 'comisionServicio' : 'comisionMembresia', comisionActual.comisionProducto - 5)} className="border p-2">-</button>
        </div>
      </div>
    </div>
  );
};

export default DetallesComisiones;

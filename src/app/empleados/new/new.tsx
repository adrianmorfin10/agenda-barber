"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';

const NewEmpleadoPage = () => {
  const router = useRouter();
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: '', apellido: '', telefono: '', servicios: [] });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoEmpleado({ ...nuevoEmpleado, [name]: value });
  };

  const handleAddEmpleado = () => {
    // Aquí debes implementar la lógica para agregar el empleado
    console.log('Empleado agregado:', nuevoEmpleado); // Para verificar si el objeto es correcto

    // Redirige a la lista de empleados después de añadir
    router.push('/empleados');
  };

  return (
    <div className="p-5">
      <h2 className="font-semibold text-2xl poppins mb-5 text-black">Añadir Nuevo Empleado</h2>
      <input 
        type="text" 
        name="nombre" 
        placeholder="Nombre" 
        value={nuevoEmpleado.nombre}
        onChange={handleInputChange}
        className="border p-2 mb-2 w-full rounded-[5px] text-black"
        required
      />
      <input 
        type="text" 
        name="apellido" 
        placeholder="Apellido" 
        value={nuevoEmpleado.apellido}
        onChange={handleInputChange}
        className="border p-2 mb-2 w-full rounded-[5px] text-black"
        required
      />
      <input 
        type="tel" 
        name="telefono" 
        placeholder="Número de Teléfono" 
        value={nuevoEmpleado.telefono}
        onChange={handleInputChange}
        className="border p-2 mb-2 w-full rounded-[5px] text-black"
        required
      />
      <button onClick={handleAddEmpleado} className="bg-[#0C101E] text-white py-2 px-4 rounded-[5px] w-full">
        Añadir Empleado
      </button>
    </div>
  );
};

export default NewEmpleadoPage;

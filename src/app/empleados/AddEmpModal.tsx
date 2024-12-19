"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ServicioService from '../services/ServicioService';
import EmpleadoService from '../services/EmpleadoService';
import { AppContext } from '../components/AppContext';
const serviciosObject = new ServicioService();
const empleadoObject = new EmpleadoService();
interface AddEmpModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onAddEmpleado: () => void;
}

interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  instagram: string;
  diasTrabajo: number[];
  servicios: number[];
  local_id?: number;
  foto?: any
}

const AddEmpModal: React.FC<AddEmpModalProps> = ({ isModalOpen, setIsModalOpen, onAddEmpleado }) => {
  const [ servicios, setServicios ] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState<Empleado>({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    instagram: '',
    diasTrabajo: [],
    servicios: [],
  });
  const [state, dispatchState] = React.useContext(AppContext);
  React.useEffect(()=>{
    serviciosObject.getServicios(state.sucursal ? { local_id: state.sucursal.id } : false).then(data=>{
      setServicios(data);
    }).catch(e=>{});
  },[state.sucursal])

  const onSubmitForm = (e:any)=>{
    e.preventDefault();

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoEmpleado({ ...nuevoEmpleado, [name]: value });
  };

  const toggleDiaTrabajo = (dia: number) => {
    setNuevoEmpleado((prev) => ({
      ...prev,
      diasTrabajo: prev.diasTrabajo.includes(dia)
        ? prev.diasTrabajo.filter((d) => d !== dia)
        : [...prev.diasTrabajo, dia],
    }));
  };

  const toggleServicio = (servicioId: number) => {
    setNuevoEmpleado((prev) => ({
      ...prev,
      servicios: prev.servicios.includes(servicioId)
        ? prev.servicios.filter((id) => id !== servicioId)
        : [...prev.servicios, servicioId],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Obtener el archivo seleccionado
    setNuevoEmpleado({ ...nuevoEmpleado, foto: file });
  };

  const handleAddEmpleado = () => {
  
    const formData = new FormData();
    formData.append('nombre', nuevoEmpleado.nombre);
    formData.append('apellido', nuevoEmpleado.apellido);
    formData.append('telefono', nuevoEmpleado.telefono);
    formData.append('email', nuevoEmpleado.email);
    formData.append('instagram', nuevoEmpleado.instagram);
    nuevoEmpleado.diasTrabajo.forEach((item:any)=>{
      formData.append('diasTrabajo[]', item);
    })
    nuevoEmpleado.servicios.forEach((item:any)=>{
      formData.append('servicios[]', item);
    })
    if (file) {
      formData.append('foto', file);
    }
    empleadoObject.createEmpleado({ ...nuevoEmpleado, local_id: state.sucursal.id }).then(data=>{
      setIsModalOpen(false);
      setNuevoEmpleado({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        instagram: '',
        diasTrabajo: [],
        servicios: [],
      });
      onAddEmpleado();

    }).catch(e=>{
      console.log(e)
    })
    
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form className="bg-white p-5 rounded-[10px] max-w-[450px] w-full" onSubmit={onSubmitForm}> 
            <div className="flex items-center mb-4">
              <Image
                src="/img/closemodal.svg"
                alt="Cerrar"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              />
              <h2 className="text-lg font-semibold ml-2 text-[#0C101E]">Añadir Nuevo Empleado</h2>
            </div>

            

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2 mb-4 w-full rounded-[5px] text-black placeholder-gray"
            />

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoEmpleado.nombre}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={nuevoEmpleado.apellido}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Número de Teléfono"
              value={nuevoEmpleado.telefono}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Solo números
                setNuevoEmpleado({ ...nuevoEmpleado, telefono: value });
              }}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={nuevoEmpleado.email}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
              required
            />
            <input
              type="text"
              name="instagram"
              placeholder="Usuario de Instagram (opcional)"
              value={nuevoEmpleado.instagram}
              onChange={handleInputChange}
              className="border p-2 mb-4 w-full rounded-[5px] text-black placeholder-gray"
              maxLength={50}
            />

            {/* Selección de días de trabajo en horizontal */}
            <div className="flex flex-col mb-4">
              <label className="font-semibold mb-2 text-black">Días de Trabajo</label>
              <div className="flex gap-2">
                {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((dia, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={nuevoEmpleado.diasTrabajo.includes(index + 1)}
                      onChange={() => toggleDiaTrabajo(index + 1)}
                      className="mr-1"
                    />
                    <label className="text-black">{dia}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Selección de servicios */}
            <div className="flex flex-col mb-4">
              <label className="font-semibold mb-2 text-black">Servicios que Puede Brindar</label>
              {servicios.map(({ id, nombre }) => (
                <div key={id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={nuevoEmpleado.servicios.includes(id)}
                    onChange={() => toggleServicio(id)}
                    className="mr-1"
                  />
                  <label className="text-black">{nombre}</label>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddEmpleado}
              className="bg-[#0C101E] text-white py-2 px-4 rounded-[5px] w-full"
            >
              Añadir Empleado
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddEmpModal;

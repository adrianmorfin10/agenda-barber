"use client";

import React from 'react';
import Image from 'next/image';
import SuccessModal from '../components/SuccessModal';
import EmpleadoService from '../services/EmpleadoService';
const empleadoObject = new EmpleadoService();
interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  instagram?: string;
  citas: number;
  inasistencias: number;
  ingresosTotales: string;
  diasTrabajo: number[];
  barbero_servicios: any[];
  servicios: number[]; // IDs de servicios que el barbero puede brindar
}

interface EmpleadoDetailsProps {
  empleado: Empleado | null;
  onBack: () => void;
  onSave: () => void;
}

// Diccionario para mapear IDs a nombres de servicios
const servicioNombres: { [key: number]: string } = {
  1: "Corte de Cabello",
  2: "Afeitado",
  3: "Coloración",
  // Agrega otros servicios si es necesario
};

const EmpleadoDetails: React.FC<EmpleadoDetailsProps> = ({ empleado, onBack, onSave }) => {
  const [ selectEmpleado, setSelectEmpleado ] = React.useState<any>(empleado);
  const [ successModal, setSuccessModal ] = React.useState<boolean>(false);
  const [ editEmpleado, setEditEmpleado ] = React.useState<any>(empleado);
  const [ edit, setEdit ] = React.useState(false);
  React.useEffect(()=>{
    setSelectEmpleado(empleado);
    setEditEmpleado(empleado)
  },[empleado])

  const toggleDiaTrabajo = (dia: number) => {
    setSelectEmpleado({
      ...selectEmpleado,
      diasTrabajo: selectEmpleado.diasTrabajo.includes(dia)
        ? selectEmpleado.diasTrabajo.filter((d:number) => d !== dia)
        : [...selectEmpleado.diasTrabajo, dia]
    });
  };

  if (!empleado) return null;

  const handleSave = () => {
    // Lógica para guardar los cambios en el empleado
    empleadoObject.updateEmpleado({ ...selectEmpleado, ...editEmpleado, working_days: selectEmpleado?.diasTrabajo }).then(response=>{ 
      setSelectEmpleado({ ...selectEmpleado, ...editEmpleado});
      onSave();
      setSuccessModal(true);
    }).catch(e=>{});
  }

  const diasSemana = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
  const diasTrabajo = (selectEmpleado?.diasTrabajo || []).sort((a: number, b: number) => a - b).map((dia:number) => diasSemana[dia - 1]).join(", ");
  
 
  return (
    <div className="flex flex-col justify-center p-5 w-full h-full bg-[#F8F8F8]">
      <div className="md:hidden flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-black">← Volver</button>
        <h1 className="font-semibold text-2xl poppins text-black">Detalle de Empleado</h1>
      </div>

      <div className="flex justify-between items-center bg-white p-5 rounded-[5px] mb-4">
        <div className="flex items-center">
          <Image src="/img/edit.svg" alt="Editar" width={20} height={20} />
          { !edit ? <span className="ml-2 poppins text-black" onClick={()=>{ setEdit(true) }}>Editar</span> : <span className="ml-2 poppins text-black" onClick={()=>{ setEdit(false) }}>Cancelar</span> }
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center bg-black text-white rounded-full w-[44px] h-[44px]">
            {empleado.nombre.charAt(0)}{empleado.apellido.charAt(0)}
          </div>
          <span className="text-black">{empleado.email}</span>
          { !edit ? <span className="text-black">{empleado.nombre}</span> : <input  name="editNombre" className="border p-2 mb-4 w-full rounded-[5px] text-black placeholder-gray" value={editEmpleado.nombre} onChange={(e:any)=>{ setEditEmpleado({ ...editEmpleado, nombre: e.target.value })}} /> }
          { !edit ? <span className="text-black">{empleado.telefono}</span> : <input  name="editTelefono" className="border p-2 mb-4 w-full rounded-[5px] text-black placeholder-gray" value={editEmpleado.telefono} onChange={(e:any)=>{ setEditEmpleado({ ...editEmpleado, telefono: e.target.value })}} /> }
          <span className="text-black">{empleado.instagram}</span>
          {
            edit &&
            <>
              <div className="flex flex-col mb-4">
                  <label className="font-semibold mb-2 text-black text-center">Días de Trabajo</label>
                  <div className="flex gap-2">
                    {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((dia, index) => (
                      <div key={index} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={(selectEmpleado?.diasTrabajo || []).includes(index + 1)}
                          onChange={() => toggleDiaTrabajo(index + 1)}
                          className="mr-1"
                        />
                        <label className="text-black">{dia}</label>
                      </div>
                    ))}
                  </div>
              </div>
            
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-black text-white px-4 py-2 rounded text-sm md:text-base w-full"
                >
                  Guardar
                </button>
                
              </div>
            </>
          }
          
      
        </div>

        <div className="flex items-center">
          <Image src="/img/calendara.svg" alt="Agendar" width={20} height={20} />
          <span className="ml-2 poppins text-black">Agendar</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-black poppins">Citas Realizadas</div>
          <div className="text-black poppins">Inasistencias del Mes</div>
          <div className="text-black poppins">Ingresos Totales</div>
        </div>
        <div className="grid grid-cols-3 gap-4 font-bold mb-4">
          <div className="text-black">{empleado.citas}</div>
          <div className="text-black">{empleado.inasistencias}</div>
          <div className="text-black">{empleado.ingresosTotales}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded">
        <div className="mb-4">
          <h3 className="text-black poppins font-semibold">Días de Trabajo</h3>
          <p className="text-black">{diasTrabajo}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-black poppins font-semibold">Servicios que Realiza</h3>
          <div className="flex flex-wrap gap-2">
            {(empleado.barbero_servicios || []).filter((item:any)=>item.servicio).map((item, index) => (
              <div
                key={`barber-detail-servicio-${index}`}
                className="px-4 py-2 border border-gray-400 rounded-[10px] text-black poppins text-sm"
              >
                {item.servicio.nombre}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={successModal}
        content="Empleado actualizado correctamente."
        onClose={() => setSuccessModal(false)}
        onConfirm={() => setSuccessModal(false)}
      />
    </div>
  );
};

export default EmpleadoDetails;

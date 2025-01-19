"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EmpleadosList from './EmpleadosList';
import EmpleadoDetails from './EmpleadosDetail';
import SubNavBar from '../components/SubNavBar'; // Asegúrate de que la ruta sea correcta
import {Empleado} from '../interfaces/empleado';
import EmpleadoService from '../services/EmpleadoService';
import { AppContext } from '../components/AppContext';
const empleadoServiceObject = new EmpleadoService();


const Empleados = () => {

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [state, dispatchState] = React.useContext(AppContext);
  React.useEffect(()=>{
    getEmpleados();
  }, [state.sucursal])
  const getEmpleados = ()=>{
    empleadoServiceObject.getEmpleados(state.sucursal ? { local_id: state.sucursal.id } : false).then(response=>{
      const _empleados = response.map((item:any)=>{
        const { reservacions } = item;
        const canceladas = reservacions.filter((item:any)=>item.state === "cancel");
        const insistidas = reservacions.filter((item:any)=>item.state === "inasistsida");
        return {
          id: item.id,
          nombre: item.usuario.nombre,
          apellido: item.usuario.apellido_paterno,
          telefono: item.usuario.telefono,

          email: item.usuario.email,
          instagram: '',
          citas: reservacions?.length || 0,
          inasistencias: insistidas?.length || 0,
          cancelaciones: canceladas?.length || 0,
          ultimaVisita: reservacions.length ? new Date(reservacions[0].fecha).toLocaleString() : '',
          //falta guardar el costo de la reservacion para calcular esto
          ingresosTotales: 0,
          tipo: 'Black',
          diasTrabajo: item.working_days || [],
          servicios: item.barbero_servicios,
          barbero_servicios: item.barbero_servicios,
          //Especificar q es proximo pago
          proximoPago: '',
      }
      })
      setEmpleados(_empleados);
    }).catch(e=>{})
  }
  const router = useRouter();

  const handleSelectEmpleado = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
  };

  const handleAddEmpleado = () => {
    getEmpleados();
  };

  return (
    <div className="bg-white h-screen p-5 flex flex-col w-full">
      <SubNavBar />

      <div className="flex flex-row w-full">
        <div className={`${selectedEmpleado ? 'hidden' : 'block'} md:block w-full md:w-1/3`}>
          <EmpleadosList
            empleados={empleados}
            onSelectEmpleado={handleSelectEmpleado}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddEmpleado={handleAddEmpleado}
          />
        </div>

        <div className={`${selectedEmpleado ? 'block' : 'hidden'} md:block w-full md:w-2/3`}>
          <EmpleadoDetails
            empleado={selectedEmpleado}
            onBack={() => setSelectedEmpleado(null)}
            onSave={()=>getEmpleados()}
          />
        </div>
      </div>
    </div>
  );
};

export default Empleados;

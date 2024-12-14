"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React, { useState } from 'react';
import MembershipModal from '../components/MembershipModal'; // Asegúrate de la ruta correcta
import SubProductBar from '../components/SubProductBar'; // Importar SubProductBar correctamente
import Image from 'next/image'; // Importa el componente Image
import { AppContext } from '../components/AppContext';
import MembresiaService from '../services/MembresiaService';
import ServicioService from '../services/ServicioService';
const membresíaObject = new MembresiaService();
const serviciosObject = new ServicioService();

const MembershipsPage = () => {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ services, setServices ] = useState([]);
  const [state, dispatchState] = React.useContext(AppContext);

  React.useEffect(()=>{
    if(!state.sucursal?.id)
      return
    getMembreships();
    serviciosObject.getServicios(state.sucursal ? { local_id: state.sucursal.id } : false).then(services=>{
      setServices(services);
    }).catch(e=>{});
  },[state.sucursal])

  const getMembreships = ()=>{
    membresíaObject.getMembresias(state.sucursal ? { local_id: state.sucursal.id } : false).then((membresias:any)=>{
      setMemberships(membresias);
    }).catch(e=>{})
  }
  const handleCreateMembership = (nombre: string, servicios: any) => {
    membresíaObject.createMembresia({ nombre, servicios, local_id: state.sucursal.id }).then(()=>{
      getMembreships();
      setIsModalOpen(false)
    }).catch(e=>{});
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      {/* SubProductBar */}
      <SubProductBar />

      {/* Padding entre SubProductBar y el título */}
      <div className="py-4"></div> {/* Esto crea un espacio vertical entre la barra y el título */}

      {/* Título de la página */}
      <h1 className="text-2xl font-bold mb-4">Membresías</h1>

      {/* Botón para abrir el modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-white text-black border border-black border-dashed px-4 py-2 rounded mb-4 flex items-center gap-2 hover:bg-gray-100"
      >
        <Image src="/img/plus.svg" alt="Agregar" width={16} height={16} />
        Agregar Membresía
      </button>

      {/* Tabla de membresías */}
      <table className="min-w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-300 p-2 text-left">Nombre</th>
            <th className="border-b-2 border-gray-300 p-2 text-left">Servicios</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((membership) => (
            <tr key={membership.id} className="hover:bg-gray-100 cursor-pointer border-b">
              <td className="border-b border-gray-200 p-2">{membership.nombre}</td>
              <td className="border-b border-gray-200 p-2">{membership.membresia_servicios.map((item:any)=>item.servicio.nombre).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para crear membresía */}
      <MembershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateMembership={handleCreateMembership}
        services={services}
      />
    </div>
  );
};

export default MembershipsPage;

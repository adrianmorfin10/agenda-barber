"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React, { useState } from 'react';
import SubserviceBar from '../components/SubProductBar';
import ServiceList from './ServiceList';
import AddserviceModal from './AddServiceModal';
import { useRouter } from 'next/navigation'; // Importar useRouter
import { AppContext } from '../components/AppContext';
import ServicioService from '../services/ServicioService';
const serviciosObject = new ServicioService();
interface Servicio {
  id: number; // Asegúrate de que el tipo sea número
  nombre: string;
  tiempo: string; // Cambiado de "marca" a "tiempo"
  precio: number;
}

const ServicesPage: React.FC = () => {
  const router = useRouter(); // Inicializar el router
  const [services, setServices] = useState<Servicio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, dispatchState] = React.useContext(AppContext);
  React.useEffect(()=>{
    getServices();
  },[state.sucursal])
  const getServices = ()=>{
    serviciosObject.getServicios(state.sucursal ? { local_id: state.sucursal.id } : false).then((response:any)=>{
      setServices(response.map((item:any)=>{
        const { precio_servicios } = item;
        return { id: item.id, nombre: item.nombre, tiempo: item.tiempo || 0, precio: precio_servicios?.length ? precio_servicios[0].precio : 0 }
      }));
    }).catch((e:any)=>{})
  }
  const handleAddservice = () => {
    getServices();
  };

  const handleSelectService = (id: number) => {
    console.log('Servicio seleccionado:', id);
    router.push(`/servicios/${id}`); // Navega a la página de detalle del servicio
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen"> {/* Fondo blanco y texto negro */}
      <SubserviceBar />
      <div className="p-4">
        <ServiceList 
          services={services} 
          onSelectService={handleSelectService} 
        />
        <button
          onClick={() => setIsModalOpen(true)} // Abre el modal al hacer clic
          className="bg-black text-white py-2 px-6 mt-4 rounded-md transition duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
        >
          Agregar Servicio
        </button>
      </div>

      <AddserviceModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onAddservice={handleAddservice}
      />
    </div>
  );
};

export default ServicesPage;




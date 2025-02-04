"use client";

import React, { useState } from 'react';
import SubserviceBar from '../components/SubProductBar';
import ServiceList from './ServiceList';
import AddserviceModal from './AddServiceModal';
import EditServiceModal from './EditServiceModal'; // Nuevo modal para editar
import { useRouter } from 'next/navigation';
import { AppContext } from '../components/AppContext';
import ServicioService from '../services/ServicioService';
import Image from 'next/image';

const serviciosObject = new ServicioService();

interface Servicio {
  id: number;
  nombre: string;
  tiempo: string;
  precio: number;
}

const ServicesPage: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<Servicio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null); // Cambiado a number
  const [state, dispatchState] = React.useContext(AppContext);

  React.useEffect(() => {
    if (state.sucursal?.id) getServices();
  }, [state.sucursal]);

  const getServices = () => {
    serviciosObject
      .getServicios(state.sucursal ? { local_id: state.sucursal.id } : false)
      .then((response: any) => {
        setServices(
          response.map((item: any) => {
            const { precio_servicios } = item;
            return {
              id: item.id,
              nombre: item.nombre,
              tiempo: item.tiempo || 0,
              precio: precio_servicios?.length ? precio_servicios[0].precio : 0,
            };
          })
        );
      })
      .catch((e: any) => {});
  };

  const handleAddservice = () => {
    getServices();
  };

  const handleSelectService = (id: number) => {
    router.push(`/servicios/${id}`);
  };

  const handleEditService = (id: number) => {
    setSelectedServiceId(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteService = (id: number) => {
    setSelectedServiceId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedServiceId) {
      serviciosObject
        .deleteService(selectedServiceId)
        .then(() => {
          getServices();
          setIsDeleteModalOpen(false);
        })
        .catch(() => alert('Lo siento, ha ocurrido un error al borrar el servicio'));
    }
  };

  const handleSaveEdit = (updatedService: Servicio) => {
    console.log('Servicio actualizado:', updatedService);
    setIsEditModalOpen(false);
    getServices();
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <SubserviceBar />
      <div className="p-4">
        <ServiceList
          services={services}
          onSelectService={handleSelectService}
          onEdit={handleEditService} // Ahora recibe un id (number)
          onDelete={handleDeleteService} // Ahora recibe un id (number)
        />
        <button
          onClick={() => setIsModalOpen(true)}
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

      {/* Modal de Edición */}
      <EditServiceModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        service={services.find((s) => s.id === selectedServiceId)} // Busca el servicio por id
        onSave={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
      />

      {/* Modal de Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">¿Estás seguro de eliminar este servicio?</h2>
            <p className="mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-black text-white py-2 px-4 rounded-md mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
"use client";

import React, { useState } from 'react';
import ClientesList from './Clienteslist';
import ClienteDetails from './ClienteDetails';
import ClientService from '../services/ClientService';
import Cliente from '../interfaces/cliente';
import { AppContext } from './AppContext';



const getClients = async (filter:any): Promise<Cliente[]> => {
  const clientService = new ClientService();
  console.log("filter", filter);
  const clientsData = await clientService.getClients(filter);
  const clients:Cliente[] = clientsData.map((client: any) => ({
    id: client.id,
    nombre: client.usuario.nombre,
    apellido: client.usuario.apellido_paterno + " " + client.usuario.apellido_materno,
    telefono: client.usuario.telefono,
    instagram: client.instagram,
    citas: client.citas || 0,
    inasistencias: client.inasistencias || 0,
    cancelaciones: client.cancelaciones || 0,
    ultimaVisita: client.ultima_visita || "Sin fecha",
    descuento: client.descuento || "Sin descuento",
    ingresosTotales: client.ingresos_totales || "Sin ingresos",
    membresia: client.is_member ? "Activa" : "Inactiva",
    tipo: client.usuario.tipo || "Sin tipo",
    serviciosDisponibles: client.servicios_disponibles || 0,
    proximoPago: client.proximo_pago || "Sin proximo pago"
  }));
  return clients;
}

const Clientes = () => {
  

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null); // Comienza sin cliente seleccionado
  const [searchTerm, setSearchTerm] = useState('');
  const [ state, dispatchState ]= React.useContext(AppContext);
  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };

  React.useEffect(() => {
    console.log("state sucursal", state.sucursal);
    getClients( state.sucursal ? { local_id: state.sucursal.id } : false ).then(setClientes);
  }, [state.sucursal]);
  
  return (
    <div className="flex bg-[#FFFFFF] min-h-screen">
      {/* Mostrar lista de clientes en mobile, siempre visible en desktop */}
      <div className={`${selectedCliente ? 'hidden' : 'block'} md:block w-full md:w-1/3`}>
        <ClientesList
          clientes={clientes}
          onSelectCliente={handleSelectCliente}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          reloadClients={()=>{
            getClients( state.sucursal ? { local_id: state.sucursal.id } : false ).then(setClientes);
          }}
        />
      </div>

      {/* Mostrar detalles de cliente seleccionado solo si hay uno en mobile, siempre visible en desktop */}
      <div className={`${selectedCliente ? 'block' : 'hidden'} md:block w-full md:w-2/3`}>
        <ClienteDetails
          cliente={selectedCliente}
          onBack={() => setSelectedCliente(null)} // Solo se usa en mobile
        />
      </div>
    </div>
  );
};

export default Clientes;

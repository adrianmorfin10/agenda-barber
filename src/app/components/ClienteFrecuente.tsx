import ClientesList from "./Clienteslist";
import Cliente from '../interfaces/cliente';
import React, { useState } from "react";
import ReporteService from "../services/ReporteService";

export const getClients = async (local_id: number, current_date: string): Promise<Cliente[]> => {
    const reportObject = new ReporteService();
    const clientsData = await reportObject.reporteClientsFrecuentes(local_id, current_date);
    const clients: Cliente[] = clientsData.map((client: any) => ({
      id: client.id,
      nombre: client.usuario.nombre,
      apellido: client.usuario.apellido_paterno + " " + client.usuario.apellido_materno,
      telefono: client.usuario.telefono,
      instagram: client.instagram || "Sin Instagram",
      citas: client.citas || 0,
      inasistencias: client.inasistencias || 0,
      cancelaciones: client.cancelaciones || 0,
      ultimaVisita: client.ultima_visita || "Sin fecha",
      descuento: client.descuento || 0,
      ingresosTotales: client.ingresos_totales || "Sin ingresos",
      membresia: client.is_member,
      tipo: client.usuario.tipo || "Sin tipo",
      serviciosDisponibles: client.servicios_disponibles || 0,
      proximoPago: client.proximo_pago || "Sin proximo pago",
      avatar: client.usuario.avatar_url,
      cliente_membresia: client.cliente_membresia,
      membresia_id: client.membresia_id,
      email: client.usuario.email
    }));
    return clients;
  }

const ClienteFrecuente = ({ local_id, current_date}: { local_id: number, current_date: string})=>{

    const [ clientes, setClientes ] = React.useState<Cliente[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        getClients(local_id, current_date).then(setClientes);
    }, [local_id, current_date]);

    return (
        <ClientesList
          clientes={clientes}
          onSelectCliente={()=>{}}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          title={"Clientes frecuentes"}
          createUser={false}
          reloadClients={() => {
            getClients(local_id, current_date).then(setClientes);
          }}
        />
    )
}
export default ClienteFrecuente;
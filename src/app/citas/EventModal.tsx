"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import ClientesList from "../components/Clienteslist"; 
import ClientService from "../services/ClientService";
import moment from "moment";
import { AppContext } from "../components/AppContext";
import Image from 'next/image';
import Cliente from "../interfaces/cliente";
import { useSearchParams } from 'next/navigation'
import { on } from "events";
import { hasMemberActive } from "../Utils";

const clientService = new ClientService();

const getClients = async (filter:any): Promise<Cliente[]> => {
  
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
    isMember: client.is_member,
    membresia: client.membresia || null,
    tipo: client.usuario.tipo || "Sin tipo",
    serviciosDisponibles: client.servicios_disponibles || 0,
    proximoPago: client.proximo_pago || "Sin proximo pago",
    cliente_membresia: client.cliente_membresia
  }));
  return clients;
}


const EventModal:React.FC<{isOpen:boolean, onClose: ()=>void, onCreateEvent: (value:any)=>void, onUpdate: (event:any)=>void, sendTokenConfirmation:(client_id:number, evento_id: number)=>void, onChangeClient: (client:any)=>void, slot:any, employees:any[], services:any[], event: any}> = ({ isOpen, onClose, onUpdate, onChangeClient, onCreateEvent, sendTokenConfirmation, slot, employees, services, event }) => {

  const [newEvent, setNewEvent] = useState<any>(null);

  const [errors, setErrors] = useState({
    startTime: "",
    endTime: "",
    employee: "",
    service: "",
    timeError: "",
  });

  const [isClientListOpen, setIsClientListOpen] = useState(false); // Controla la visibilidad de ClientesList
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedEvent, setSelectedEvent ] = useState<any>(event);
  const [state, dispatchState ]= React.useContext(AppContext);
  

  const defaultEvent = {
    title: "",
    startTime: slot?.start ? format(slot.start, "HH:mm") : "",
    endTime: slot?.end ? format(slot.end, "HH:mm") : "",
    employee: { name: "", id: 0 },
    client: "",
    date: slot?.date ? format(slot.date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    service: "",
    price: 0, // Inicialmente el precio es 0
  };

  React.useEffect(() => {
    onChangeClient(selectedClient);
  }, [selectedClient]);

  React.useEffect(()=>{
    setSelectedEvent(event);
  },[event])

  React.useEffect(() => {
    const event = selectedEvent
    if(event){
      setNewEvent({
        title:event.title,
        startTime: event.start_hour,
        endTime: event.end_hour,
        employee: { name: "", id: event.barbero_id },
        client: event.cliente.usuario.nombre,
        date: format(event.fecha, "yyyy-MM-dd"),
        service: event.servicio_id,
        prepago: event.prepago,
        price: 0, // Inicialmente el precio es 0
      });
      console.log("event.cliente", event.cliente);
      setSelectedClient({ nombre: event.cliente.usuario.nombre, apellido: event.cliente.usuario.apellido_paterno + " " + event.cliente.usuario.apellido_materno, ...event.cliente  });
    }else{
      setNewEvent(defaultEvent);
    }
  },[selectedEvent]);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
    // Limpiar errores al escribir
    setErrors({ ...errors, [name]: "", timeError: "" });
  };

  const handleChangeEmployee = (e:any): void => {
    const { value, name } = e.target;
    const newEventTemp:any = { ...newEvent, employee: { name, id: value } };
    setNewEvent(newEventTemp);
    setErrors((prev:any) => ({ ...prev, employee: "", timeError: "" }));
  };

  const handleServiceChange = (e:any) => {
    const selectedService = e.target.value;
    const serviceDetails = services.find((service:any) => service.id === selectedService);
    const precio = serviceDetails && serviceDetails.precio_servicios.length > 0 ? serviceDetails.precio_servicios[0].precio : 0;
    const tiempo_servicio = serviceDetails?.tiempo || 0;
    const { startTime } = newEvent;
    const price = Number(precio);
    const startTimeMoment = moment(`2020-12-12 ${startTime}`);
    const endTime = startTimeMoment.add(tiempo_servicio, 'minutes').format("hh:mm");
    setNewEvent((prev:any) => ({
      ...prev,
      service: selectedService,
      price: price,
      endTime
    }));

    setErrors((prev) => ({ ...prev, service: "" }));
  };

  React.useEffect(() => {
    
    getClients(state.sucursal ? { local_id: state.sucursal.id } : false ).then(data => {
      setClientes(data);
    }).catch(error => {
      console.error("Error al obtener los clientes", error);
    });

  
  }, [state.sucursal]);
 

  React.useEffect(() => {
    setNewEvent({
      ...newEvent,
      startTime: slot?.start ? format(slot.start, "HH:mm") : ""
    });
  }, [slot]);


  const getCliente = (userId:any)=>{
    
    clientService.getClient(userId).then(client=>{
      const cliente = {
        id: client.id,
        nombre: client.usuario.nombre,
        apellido: client.usuario.apellido_paterno + " " + client.usuario.apellido_materno,
        telefono: client.usuario.telefono
      }
      setSelectedClient(cliente);
      setNewEvent((prev:any) => ({ ...prev, client: `${cliente.nombre} ${cliente.apellido}` }));
    })
  }

  const handleClose = () => {
    setIsClosing(true); // Activar la animación de salida
    
    setTimeout(() => {
      onClose(); // Cerrar el modal después de la animación
      setIsClosing(false); // Restablecer el estado
    }, 500); // La duración de la animación es 0.5s
  };

  const handleSave = () => {
    const { startTime, endTime, employee, service } = newEvent;
    let valid = true;
    const newErrors = { startTime: "", endTime: "", employee: "", service: "", timeError: "" };

    // Validación de campos requeridos
    if (!startTime) {
      newErrors.startTime = "La hora de inicio es requerida";
      valid = false;
    }
    if (!endTime) {
      newErrors.endTime = "La hora de fin es requerida";
      valid = false;
    }
    if (!employee) {
      newErrors.employee = "El empleado es requerido";
      valid = false;
    }
    if (!service) {
      newErrors.service = "El servicio es requerido";
      valid = false;
    }

    // Validación de la lógica de tiempos
    if (startTime && endTime && startTime >= endTime) {
      newErrors.timeError = "La hora de inicio debe ser anterior a la hora de fin";
      valid = false;
    }

    
    setErrors(newErrors);

    // Si la validación falla, no se permite continuar
    if (!valid) {
      return;
    }

    // Crear el evento si todo es válido
    onCreateEvent({ ...newEvent, client: selectedClient,  });
    onClose();
  };

  const handleUpdate = () => {
    if(!event) return;


  }

  const handleToggleClientList = () => {
    if(state.user.rol === "cliente") return;
    setIsClientListOpen((prev) => !prev);
  };

  const handleSelectCliente = (cliente:any) => {
    
    setSelectedClient(cliente);
    setNewEvent((prev:any) => ({ ...prev, client: `${cliente.nombre} ${cliente.apellido}` }));
    setIsClientListOpen(false); // Cierra la lista de clientes al seleccionar uno
  };

  const searchParams = useSearchParams();
  const u = searchParams.get('u');

  useMemo(()=>{

    if(u || state?.user?.rol === "cliente")
      getCliente(u || state.user.clientes[0].id);

  }, [u, state.user]);

  if (!isOpen) return null;

  return (
    <div className={`fixed disabled top-0 right-0 h-full w-full max-w-xs sm:max-w-md bg-white shadow-xl z-50 flex flex-col ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
      {/* Header */}
      <div className={`p-4 mb-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Image
              src={isClientListOpen ? "/img/back.svg" : "/img/closemodal.svg"}
              alt={isClientListOpen ? "Volver" : "Cerrar"}
              width={24} // Specify appropriate width
              height={24} // Specify appropriate height
              className="h-6 w-6 cursor-pointer"
              onClick={isClientListOpen ? () => setIsClientListOpen(false) : handleClose}
            />
            <h2 className="text-xl font-bold text-black">
              {isClientListOpen ? "Selección de Cliente" : "Cita nueva"}
            </h2>
          </div>
        </div>

        {/* Cliente selector */}
        {!isClientListOpen && (
          <div className={`px-4 mb-4 ${ event ? `pointer-events-none` :  `` }`}>
            <div className="border-dashed border border-gray-400 p-4 rounded-lg cursor-pointer" onClick={handleToggleClientList}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-black text-white rounded-full h-[40px] w-[70px] flex items-center justify-center mr-3">
                  <Image 
                    src="/img/userw.svg" 
                    alt="Cliente" 
                    width={20} // Set appropriate width
                    height={20} // Set appropriate height
                    className="h-5 w-5" 
                  />
                  </div>
                  <span className="text-gray-500 font-light text-[16px]">
                    {selectedClient ? `${selectedClient.nombre} ${selectedClient.apellido}` : "Seleccione un cliente o déjelo en blanco si no tiene cita previa"}
                  </span>
                  </div>
                  {
                    state.user?.rol && state.user?.rol !== "cliente" &&
                    <Image 
                      src="/img/add.svg" 
                      alt="Agregar cliente" 
                      width={20} // Set appropriate width
                      height={20} // Set appropriate height
                      className="h-5 w-5 cursor-pointer" 
                    />
                  }
                  
                </div>
                {selectedClient && !hasMemberActive(selectedClient) && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  <p>El usuario no tiene la suscripción activa</p>
                  </div>
                )}
              </div>
            </div>
          
        )}

        {/* Mostrar ClientesList si isClientListOpen es true */}
        {isClientListOpen ? (
          <ClientesList
            clientes={clientes}
            onSelectCliente={handleSelectCliente}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            reloadClients={()=>{
              getClients( state.sucursal ? { local_id: state.sucursal.id } : false ).then(setClientes);
            }}
          />
        ) : (
          <>
            {/* Contenido de Cita nueva cuando isClientListOpen es false */}
            <div className={`mb-4 px-4 ${ event ? `pointer-events-none` :  `` }`}>
              <label className="block text-black text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                name="date"
                value={newEvent?.date}
                onChange={handleInputChange}
                className="border p-2 w-full rounded placeholder-gray-600 text-black focus:border-black"
                placeholder="Selecciona una fecha"
              />
            </div>

            {/* Servicio */}
            <div className={`mb-4 px-4 ${ event ? `pointer-events-none` :  `` }`}>
              <label className="block text-black text-sm font-medium mb-1">Seleccionar servicio</label>
              <select
                name="service"
                value={newEvent?.service}
                onChange={handleServiceChange}
                className={`border p-2 w-full rounded bg-white text-black placeholder-gray-600 pr-10 focus:border-black ${errors.service && "border-red-500"}`}
              >
                <option value="">Selecciona un servicio</option>
                {(services || []).map((service:any) => (
                  <option key={service.id} value={service.id}>
                    {service.nombre}
                  </option>
                ))}
              </select>
              {errors.service && <span className="text-red-500 text-xs">{errors.service}</span>}
            </div>

            <div className={`flex space-x-4 mb-4 px-4 ${ event ? `pointer-events-none` :  `` }`}>
              <div className="w-1/2">
                <label className="block text-black text-sm font-medium">Hora de inicio</label>
                <input
                  type="time"
                  name="startTime"
                  value={newEvent?.startTime}
                  onChange={handleInputChange}
                  className={`border p-2 w-full rounded placeholder-gray-600 text-black focus:border-black ${errors.startTime && "border-red-500"}`}
                  placeholder="Hora de inicio"
                />
                {errors.startTime && <span className="text-red-500 text-xs">{errors.startTime}</span>}
              </div>

              <div className="w-1/2">
                <label className="block text-black text-sm font-medium">Hora de fin</label>
                <input
                  type="time"
                  name="endTime"
                  value={newEvent?.endTime}
                  onChange={handleInputChange}
                  className={`border p-2 w-full rounded placeholder-gray-600 text-black focus:border-black ${errors.endTime && "border-red-500"}`}
                  placeholder="Hora de fin"
                />
                {errors.endTime && <span className="text-red-500 text-xs">{errors.endTime}</span>}
              </div>
            </div>

            {errors.timeError && <p className="text-red-500 text-xs px-4">{errors.timeError}</p>}

            {/* Empleado */}
            <div className={`mb-4 px-4 ${ event ? `pointer-events-none` :  `` }`}>
              <label className="block text-black text-sm font-medium mb-1">Empleado</label>
              <select
                name="employee"
                value={newEvent?.employee?.id}
                onChange={handleChangeEmployee}
                className={`border p-2 w-full rounded bg-white text-black placeholder-gray-600 pr-10 focus:border-black ${errors.employee && "border-red-500"}`}
              >
                <option value="">Selecciona un empleado</option>
                {employees.map((emp:any) => (
                  <option key={emp.name} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              {errors.employee && <span className="text-red-500 text-xs">{errors.employee}</span>}
            </div>
          </>
        )}

      </div>

      {!isClientListOpen && !event && (
        <div className={`mt-auto px-4 ${ event ? `pointer-events-none` :  `` }`}>
          {/* Total y Pago */}
          <div className="flex justify-between items-center border-t border-gray-300 py-4">
            <div>
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-black text-lg font-semibold">${(newEvent?.price || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm text-right">A pagar</p>
              <p className="text-black text-lg font-semibold text-right">${(newEvent?.price || 0).toFixed(2)}</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleClose}
              className="border border-black text-black px-4 py-2 rounded-lg w-full font-semibold"
            >
              Descartar
            </button>
            <button
              onClick={handleSave}
              className="bg-black text-white px-4 py-2 rounded-lg w-full font-semibold"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {!isClientListOpen && event && (
        <div className={`mt-auto px-4`}>

          {/* Botones */}
          <div className="flex space-x-2 mb-4">
            {
              !event.reservacion_confirmacion?.confirmacion &&
              <button
                onClick={()=>onUpdate({ ...(event || {}), estado: 'cancelada' })}
                className=" text-black px-3 py-2 rounded-lg w-full font-semibold"
              >
                Cancelar
              </button>
            }
            
            {
              event.prepago && selectedClient && !event.reservacion_confirmacion?.confirmacion &&
              <button
                onClick={()=>sendTokenConfirmation(selectedClient.id, event.id)}
                className="border border-black text-black px-3 py-2 rounded-lg w-full font-semibold"
              >
                Enviar token
              </button>
            }

            <button
              onClick={()=>onUpdate({ ...(event || {}), estado: 'completada' })}
              className="bg-black text-white px-3 py-2 rounded-lg w-full font-semibold"
            >
              Completar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventModal;

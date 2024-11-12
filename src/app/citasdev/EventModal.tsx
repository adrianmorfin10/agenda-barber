"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import ClientesList from "../components/Clienteslist"; 
import ClientService from "../services/ClientService";
import moment from "moment";
import { AppContext } from "../components/AppContext";
import Image from 'next/image';


const clienteObject = new ClientService();


const EventModal:React.FC<{isOpen:boolean, onClose: ()=>void, onCreateEvent: (value:any)=>void, slot:any, employees:any[], services:any[]}> = ({ isOpen, onClose, onCreateEvent, slot, employees, services }) => {


  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: slot?.start ? format(slot.start, "HH:mm") : "",
    endTime: slot?.end ? format(slot.end, "HH:mm") : "",
    employee: { name: "", id: 0 },
    client: "",
    date: slot?.date ? format(slot.date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    service: "",
    price: 0, // Inicialmente el precio es 0
  });

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
  const [clientes, setClientes] = useState([]);
  const [ state, dispatchState ]= React.useContext(AppContext);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));

    // Limpiar errores al escribir
    setErrors((prev) => ({ ...prev, [name]: "", timeError: "" }));
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
    setNewEvent((prev) => ({
      ...prev,
      service: selectedService,
      price: price,
      endTime
    }));

    setErrors((prev) => ({ ...prev, service: "" }));
  };

  React.useEffect(() => {
    
    clienteObject.getClients(state.sucursal ? { local_id: state.sucursal.id } : false ).then(data => {
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

  const handleToggleClientList = () => {
    setIsClientListOpen((prev) => !prev);
  };

  const handleSelectCliente = (cliente:any) => {
    
    setSelectedClient(cliente);
    setNewEvent((prev) => ({ ...prev, client: `${cliente.usuario.nombre} ${cliente.usuario.apellido_paterno}` }));
    setIsClientListOpen(false); // Cierra la lista de clientes al seleccionar uno
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-md bg-white shadow-xl z-50 flex flex-col ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
      {/* Header */}
      <div className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Image
              src={isClientListOpen ? "/img/back.svg" : "/img/closemodal.svg"}
              alt={isClientListOpen ? "Volver" : "Cerrar"}
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
          <div className="px-4 mb-4">
            <div className="border-dashed border border-gray-400 p-4 rounded-lg cursor-pointer" onClick={handleToggleClientList}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-black text-white rounded-full h-[40px] w-[70px] flex items-center justify-center mr-3">
                    <Image src="/img/userw.svg" alt="Cliente" className="h-5 w-5" />
                  </div>
                  <span className="text-gray-500 font-light text-[16px]">
                    {selectedClient ? `${selectedClient.usuario.nombre} ${selectedClient.usuario.apellido_paterno}` : " Seleccione un cliente o déjelo en blanco si no tiene cita previa"}
                  </span>
                  </div>
              <Image src="/img/add.svg" alt="Agregar cliente" className="h-5 w-5 cursor-pointer" />
            </div>

              
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
          />
        ) : (
          <>
            {/* Contenido de Cita nueva cuando isClientListOpen es false */}
            <div className="mb-4 px-4">
              <label className="block text-black text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                className="border p-2 w-full rounded placeholder-gray-600 text-black focus:border-black"
                placeholder="Selecciona una fecha"
              />
            </div>

            {/* Servicio */}
            <div className="mb-4 px-4">
              <label className="block text-black text-sm font-medium mb-1">Seleccionar servicio</label>
              <select
                name="service"
                value={newEvent.service}
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

            <div className="flex space-x-4 mb-4 px-4">
              <div className="w-1/2">
                <label className="block text-black text-sm font-medium">Hora de inicio</label>
                <input
                  type="time"
                  name="startTime"
                  value={newEvent.startTime}
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
                  value={newEvent.endTime}
                  onChange={handleInputChange}
                  className={`border p-2 w-full rounded placeholder-gray-600 text-black focus:border-black ${errors.endTime && "border-red-500"}`}
                  placeholder="Hora de fin"
                />
                {errors.endTime && <span className="text-red-500 text-xs">{errors.endTime}</span>}
              </div>
            </div>

            {errors.timeError && <p className="text-red-500 text-xs px-4">{errors.timeError}</p>}

            {/* Empleado */}
            <div className="mb-4 px-4">
              <label className="block text-black text-sm font-medium mb-1">Empleado</label>
              <select
                name="employee"
                value={newEvent.employee?.id}
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

      {!isClientListOpen && (
        <div className="mt-auto px-4">
          {/* Total y Pago */}
          <div className="flex justify-between items-center border-t border-gray-300 py-4">
            <div>
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-black text-lg font-semibold">${newEvent.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm text-right">A pagar</p>
              <p className="text-black text-lg font-semibold text-right">${newEvent.price.toFixed(2)}</p>
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
    </div>
  );
};

export default EventModal;

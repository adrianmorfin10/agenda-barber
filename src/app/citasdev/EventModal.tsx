"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import ClientesList from "../components/Clienteslist"; // Asegúrate de que la ruta es correcta
// import SolicitudService from "../services/SolicitudService"; // Comentado porque no se usa
import ServicioService from "../services/ServicioService";
import ClientService from "../services/ClientService";
import moment from "moment";
import { AppContext } from "../components/AppContext";

// const servicioObject = new ServicioService(); // Comentado porque no se usa
const clienteObject = new ClientService();
const services = [
  { name: "Corte de Pelo", price: 100 },
  { name: "Coloración", price: 200 },
  { name: "Peinado", price: 150 },
];

const EventModal = ({ isOpen, onClose, onCreateEvent, slot, employees, services }) => {
  const [servicios, setServicios] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: slot?.start ? format(slot.start, "HH:mm") : "",
    endTime: slot?.end ? format(slot.end, "HH:mm") : "",
    employee: "",
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
  const [selectedClient, setSelectedClient] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState([]);
  const [state, dispatchState] = React.useContext(AppContext); // `dispatchState` se deja comentado, ya que no se usa

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));

    // Limpiar errores al escribir
    setErrors((prev) => ({ ...prev, [name]: "", timeError: "" }));
  };

  const handleChangeEmployee = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, employee: { name, id: value } }));
    setErrors((prev) => ({ ...prev, employee: "", timeError: "" }));
  };

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    const serviceDetails = services.find((service) => service.id === selectedService);
    const precio = serviceDetails && serviceDetails.precio_servicios.length > 0 ? serviceDetails.precio_servicios[0].precio : 0;
    const tiempo_servicio = serviceDetails?.tiempo || 0;
    const { startTime } = newEvent;
    const price = Number(precio);
    const startTimeMoment = moment(`2020-12-12 ${startTime}`);
    const endTime = startTimeMoment.add(tiempo_servicio, "minutes").format("hh:mm");
    setNewEvent((prev) => ({
      ...prev,
      service: selectedService,
      price: price,
      endTime,
    }));
    setErrors((prev) => ({ ...prev, service: "" }));
  };

  React.useEffect(() => {
    clienteObject
      .getClients(state.sucursal ? { local_id: state.sucursal.id } : false)
      .then((data) => {
        setClientes(data);
      })
      .catch((error) => {
        console.error("Error al obtener los clientes", error);
      });
  }, [state.sucursal]);

  React.useEffect(() => {
    setNewEvent({
      ...newEvent,
      startTime: slot?.start ? format(slot.start, "HH:mm") : "",
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
    onCreateEvent({ ...newEvent, client: selectedClient });
    onClose();
  };

  const handleToggleClientList = () => {
    setIsClientListOpen((prev) => !prev);
  };

  const handleSelectCliente = (cliente) => {
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
            <img
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
      </div>

      {/* ... el resto del contenido del modal */}
    </div>
  );
};

export default EventModal;

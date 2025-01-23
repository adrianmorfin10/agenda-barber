"use client";

import React, { Suspense, use, useMemo, useState } from "react";
import  {  dateFnsLocalizer } from "react-big-calendar";

import format from "date-fns/format";
import parse from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import {getDay} from "date-fns/getDay";
import {es} from "date-fns/locale/es";
import {addMonths} from "date-fns/addMonths";
import {subMonths} from "date-fns/subMonths";
import {addDays} from "date-fns/addDays";
import {subDays} from "date-fns/subDays";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { setHours, setMinutes, isToday, addMinutes } from "date-fns";
import "./styles.css"; // Aquí se manejará el CSS
import EventModal from "./EventModal"; // Importando el componente desde otro archivo
import EmpleadoService from "../services/EmpleadoService";
import ServicioService from "../services/ServicioService";
import SolicitudService from "../services/SolicitudService";
import moment from "moment";
import Image from 'next/image';
import { AppContext } from '../components/AppContext';
import SurveyModal from "../components/SurveyModal";
import { clientHasMembershipActive, getMembershipServices, isPrepago } from "../Utils";
import { useSearchParams } from "next/navigation";
import TokenConfirmationModal from "../components/TokenConfirmationModal";
import Modal from "../components/Modal";
const solicitudObject = new SolicitudService();
const servicioObject = new ServicioService();
const empleadoObject = new EmpleadoService();
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Redondear la hora al punto más cercano
const roundToNearestHour = (date:any) => {
  const minutes = date.getMinutes();
  if (minutes !== 0) {
    return setMinutes(date, 0);
  }
  return date;
};

/**
 * {
      title: "Corte de pelo - Juan Pérez",
      start: new Date("2024-10-22T07:00:00"),
      end: new Date("2024-10-22T08:00:00"),
      employee: "Pedro López",
    }
 */
const customWeekDays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

const CalendarApp = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [localId, setLocal] = useState(0);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [openSurveyModal, setOpenSurveyModal] = useState<boolean>(false);
  const [reservaciones, setReservaciones] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [tokenConfirmation, setTokenConfirmation] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState<boolean>(false);
  const [state, dispatchState] = React.useContext(AppContext);
  const getData = async (filter:any) => {
    const _servicios = await servicioObject.getServicios(filter);
    setServicios(_servicios);
    const empleados = await empleadoObject.getEmpleados(filter);
    setEmpleados(empleados.filter((item:any)=>item.usuario).map((item:any)=>{
      return {
        ...item,
        name: item.usuario.nombre,
        initials: item.usuario.nombre.split(" ").map((name:any) => name[0]).join(""),
        workingHours: {
          start: item.start_hour || "07:00",
          end: item.end_hour || "18:00"
        },
        workDays: item.working_days || [ 1, 2, 3, 4, 5 ]
      }
    }));
    if(selectedClient)
      filter['cliente_id'] = selectedClient.id;
    const eventos = await solicitudObject.getSolicitudes(filter);
    const eventosDeEsteMes = await solicitudObject.getSolicitudesCurrentMonth(filter);
    setReservaciones(eventosDeEsteMes);
    setEvents(eventos.filter((item:any)=>item.estado === 'pendiente').map((item:any)=>({ ...item, title: `${item.servicio?.nombre} - ${item.cliente?.usuario?.nombre} ${item.cliente?.usuario?.apellido_paterno}  ` })));
  }

  React.useEffect(() => {
    if(!state.sucursal)
      return;
    setLocal(state.sucursal.id )
    getData(state.sucursal ? { local_id: state.sucursal.id } : false).then();
  }, [state.sucursal]);

  const handleCreateEvent = (newEvent:any) => {
    const start = new Date(`${newEvent.date}T${newEvent.startTime}`);
    const end = new Date(`${newEvent.date}T${newEvent.endTime}`);
    const nuevaSolicitud = {
      cliente_id: parseInt(newEvent.client.id),
      local_id: localId,
      servicio_id: parseInt(newEvent.service),
      fecha: newEvent.date,
      start_hour: newEvent.startTime,
      end_hour: newEvent.endTime,
      barbero_id: parseInt(newEvent.employee.id),
      precio: newEvent.price,
      estado: "pendiente",
      prepago: isPrepago(newEvent.client, parseInt(newEvent.service), reservaciones.filter((reservacion:any)=>reservacion.cliente_id === newEvent.client.id)),
      
    }
    solicitudObject.createSolicitud(nuevaSolicitud).then(data=>{
      setIsModalOpen(false);
      return getData(state.sucursal ? { local_id: state.sucursal.id } : false);
    }).then(()=>{
      
    }).catch(e=>{
      console.log("error createSolicitud", e);
    });
     // Cerrar el modal después de crear el evento
  };

  const onSelectedClient = async (client:any) => {
    // const filter:any = state.sucursal ? { local_id: state.sucursal.id } : false;
    // setSelectedClient(client);
    // if(selectedClient)
    //   filter['cliente_id'] = selectedClient.id;
    // const eventosDeEsteMes = await solicitudObject.getSolicitudesCurrentMonth(filter);
    // setReservaciones(eventosDeEsteMes);
    
  }
  const handleDayClick = (date:any) => {
    setSelectedDay(date);
  };

  const handleHourClick = (hour:any) => {
    const roundedHour = roundToNearestHour(hour);
    setSelectedSlot({ start: roundedHour, end: addMinutes(roundedHour, 60), date: selectedDay });
    setIsModalOpen(true);
  };
  

  // Avanzar al día siguiente
  const handleNextDay = () => {
    setSelectedDay(addDays(selectedDay, 1));
  };

  // Retroceder al día anterior
  const handlePreviousDay = () => {
    setSelectedDay(subDays(selectedDay, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const onUpdateEvent = async (event:any) => {

    try {
      await solicitudObject.updateSolicitud(event.id, event);
      setSelectedEvent(event);
      setIsModalOpen(false);
      if(event.estado === "completada")
        setOpenSurveyModal(true);
      return getData(state.sucursal ? { local_id: state.sucursal.id } : false);
    } catch (error) {
      
    }
    
  }
  const onClickEvent = (event:any, e:any)=>{
    e.stopPropagation();
    setSelectedEvent(event);
    setIsModalOpen(true);
  }
  const sendTokenConfirmation = (client_id:number, evento_id: number)=>{
    setLoadingToken(true);
    solicitudObject.generateAndSendToken(client_id, evento_id).then((reponse:any)=>{
      setLoadingToken(false);
      setTokenConfirmation(reponse.token)
    }).then((error:any)=>{
      setLoadingToken(false);
    })
  }
  const currentHour = new Date();
  const isCurrentDay = isToday(selectedDay);

  // Nombres de los días de la semana en español
  const daysOfWeek = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
  
  const searchParams = useSearchParams();
  const u = searchParams.get('u');

  useMemo(()=>{

    if(u || state?.user?.rol === "cliente")
      setSelectedClient({ id: u || state.user.clientes[0].id });

  }, [u, state.user]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Barra de navegación de días */}
      <div className="w-full bg-white border-b border-[#DADADA]flex items-center justify-between">
      <div className="w-full bg-white  px-4  border-[#DADADA] rounded-t-md max-w-[400px] mx-auto mt-4 mb-4 flex items-center justify-between">
        <button onClick={handlePreviousDay} className="text-black px-2 py-1 border border-[#DADADA] rounded">
        <Image src="/img/flecha.svg" alt="Previous" width={24} height={24} className="h-6 w-6 rotate-90" />
        </button>
        <h2 className="text-lg font-normal text-black text-center">
          Citas del {format(selectedDay, "dd MMMM yyyy")}
        </h2>
        <button onClick={handleNextDay} className="text-black px-2 py-1 border border-[#DADADA] rounded transform rotate-180">
        <Image src="/img/flecha.svg" alt="Previous" width={24} height={24} className="h-6 w-6 rotate-90" />
        </button>
      </div>
      </div>
      {/* Contenedor del calendario pequeño y calendarios de trabajadores */}
      <div className="flex flex-col lg:flex-row font-light lg:justify-between">
         {/* Calendarios de los trabajadores */}
        <div className="flex-1 p-4 overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 overflow-x-auto">
            {empleados.map((emp:any, index) => (
              <div key={emp.name} className="relative">
                <div className="flex items-center mb-2 sticky top-0 bg-white z-10 border-b border-[#DADADA]">
                  <div className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full mr-2">
                    {emp.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black mb-1">{emp.name}</h3>
                    <p className="text-sm text-gray-500">
                      {emp.workingHours?.start} - {emp.workingHours?.end}
                    </p>
                  </div>
                </div>

                {isCurrentDay && index === 0 && (
                  <div
                    className="absolute left-0 w-full border-t-2 border-red-500"
                    style={{
                      top: `${(currentHour.getHours() - 7) * 60}px`,
                    }}
                  >
                    <span className="bg-red-500 text-white p-1 rounded absolute -left-10 text-xs">
                      {format(currentHour, "HH:mm")}
                    </span>
                  </div>
                )}

                {Array.from({ length: 12 }, (_, hourIndex) => {
                  const hour = roundToNearestHour(setHours(new Date(), 7 + hourIndex));
                  const isWorkingDay = (emp.workDays || []).includes(getDay(selectedDay));
                  return (
                    <div
                      key={hourIndex}
                      className={`border-b border-gray-200 p-2 relative ${
                        isWorkingDay ? "" : "bg-gray-100 text-gray-400"
                      }`}
                      style={{ height: "60px" }}
                      onClick={() => isWorkingDay && handleHourClick(hour)}
                    >
                      {index === 0 && <span className="text-gray-500 text-xs">{format(hour, "HH:mm")}</span>}

                      {events
                        .filter(
                          (event:any) =>{
                            
                            if(!event.start_hour)
                              return false;
                            //
                            
                            const isDate = moment(event.fecha).utcOffset(0, false).format("YYYY-MM-DD") === moment(selectedDay, "YYYY-MM-DD").utcOffset(0, true).format("YYYY-MM-DD")
                            //console.log("event", event.fecha, moment(event.fecha).utcOffset(0, false).format("YYYY-MM-DD"), moment(selectedDay, "YYYY-MM-DD").utcOffset(0, true).format("YYYY-MM-DD"))
                            const isEmployee = event.barbero_id === emp.id;
                            const isHourStart = moment(`2012-12-12 ${event.start_hour}`).format("HH:mm") === moment(hour).format("HH:mm");
                            
                            return (isDate && isEmployee && isHourStart)
                            
                          }
                            
                        )
                        .map((event:any, i:number) => {
                          const eventDuration = ((new Date(`2012-12-12 ${event.end_hour}`)).getTime() - (new Date(`2012-12-12 ${event.start_hour}`)).getTime()) / (1000 * 60);
                          const colors = ["bg-blue-400", "bg-green-400", "bg-red-400", "bg-purple-400"];
                          const employeeColor = colors[index % colors.length];
                          return (
                            <div
                              key={`event-${event.id}-${i}`}
                              className={`absolute left-0 ${employeeColor} text-xs p-1 rounded`}
                              style={{
                                top: 0,
                                height: `${eventDuration}px`,
                                width: "calc(100% - 50px)",
                                margin: "4px 4px",
                                left: index === 0 ? "40px" : "0",
                              }}
                              onClick={(e) => onClickEvent(event, e)}
                            >
                              {event.title} ({ event.start_hour ? event.start_hour : ""} - { event.end_hour ? event.end_hour : ""})
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {
        ((state.user.rol === "cliente" && !clientHasMembershipActive(state.user?.clientes, servicios, reservaciones))) ?
        <></> :
        <EventModal
          onChangeClient={onSelectedClient}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateEvent={handleCreateEvent}
          sendTokenConfirmation={sendTokenConfirmation}
          onUpdate={(event:any)=>onUpdateEvent(event)}
          slot={selectedSlot}
          event={selectedEvent}
          employees={empleados}
          services={state.user.rol === "cliente" && state.user?.clientes?.length ? getMembershipServices(state.user?.clientes[0], servicios, reservaciones.filter((reservacion:any)=>reservacion.cliente_id === state.user?.clientes[0].id))  : servicios}
        />
      }
      
      <SurveyModal 
        isOpen={openSurveyModal} 
        onClose={()=>{ setOpenSurveyModal(false)}} 
        onConfirm={(rating:number)=>{
          if(!selectedEvent)
            return
          solicitudObject.updateSolicitud(selectedEvent?.id, { ...selectedEvent, calificacion: rating}).then(()=>{ 
            setOpenSurveyModal(false)
          })
        }} 
      />
      <TokenConfirmationModal 
        isOpen={(typeof tokenConfirmation === "string")} 
        token={tokenConfirmation}
        onClose={()=>{ setTokenConfirmation(null)}} 
        onConfirm={(confirm:boolean)=>{
          setTokenConfirmation(null);
          if(!confirm || !selectedEvent.id)
            return;
          solicitudObject.confirmarReservacion(selectedEvent.id).then(()=>{
            alert('Cita confirmado correctamente');
          }).catch(()=>{
            alert('Ha ocurrido un error al confirmar la cita');
          })
        }} 
      />
      <Modal
        isOpen={loadingToken}
        title="Token"
        content="Enviando token de confirmacion"
        buttons={false}
      />
    </div>
  );
};
const Page = () => {
  return (
      <Suspense>
          <CalendarApp />
      </Suspense>
  )
}

export default Page

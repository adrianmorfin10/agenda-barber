"use client";

import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { setHours, setMinutes, isToday, addMinutes } from "date-fns";
import "./styles.css";
import EventModal from "./EventModal";
import EmpleadoService from "../services/EmpleadoService";
import ServicioService from "../services/ServicioService";
import SolicitudService from "../services/SolicitudService";
import moment from "moment";
import Image from 'next/image';

const solicitudObject = new SolicitudService();
const servicioObject = new ServicioService();
const empleadoObject = new EmpleadoService();
const locales = { es };

// Definimos los tipos para eventos y slots seleccionados
interface EventType {
  title: string;
  start: Date;
  end: Date;
  employee: string;
  barbero_id?: number;
  start_hour?: string;
  end_hour?: string;
  fecha?: string;
}

interface SlotType {
  start: Date;
  end: Date;
  date: Date;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Redondear la hora al punto más cercano
const roundToNearestHour = (date: Date) => {
  const minutes = date.getMinutes();
  return minutes !== 0 ? setMinutes(date, 0) : date;
};

const CalendarApp: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventType[]>([
    {
      title: "Coloración - Ana Martínez",
      start: new Date("2024-10-22T07:00:00"),
      end: new Date("2024-10-22T08:00:00"),
      employee: "Ana Chávez",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null);
  const [localId, setLocal] = useState<number>(6);
  const [servicios, setServicios] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      const _servicios = await servicioObject.getServicios();
      setServicios(_servicios);

      const empleados = await empleadoObject.getEmpleados();
      setEmpleados(
        empleados.map((item) => ({
          ...item,
          name: item.usuario.nombre,
          initials: item.usuario.nombre.split(" ").map((name) => name[0]).join(""),
          workingHours: {
            start: item.start_hour || "07:00",
            end: item.end_hour || "18:00",
          },
          workDays: item.working_days || [1, 2, 3, 4, 5],
        }))
      );

      const eventos = await solicitudObject.getSolicitudes();
      setEvents(
        eventos.map((item) => ({
          ...item,
          title: `${item.servicio?.nombre} - ${item.cliente?.usuario?.nombre} ${item.cliente?.usuario?.apellido_paterno}`,
        }))
      );
    };
    getData();
  }, []);

  const handleCreateEvent = (newEvent: any) => {
    const start = new Date(`${newEvent.date}T${newEvent.startTime}`);
    const end = new Date(`${newEvent.date}T${newEvent.endTime}`);
    solicitudObject
      .createSolicitud({
        cliente_id: parseInt(newEvent.client.id),
        local_id: localId,
        servicio_id: parseInt(newEvent.service),
        fecha: newEvent.date,
        start_hour: newEvent.startTime,
        end_hour: newEvent.endTime,
        barbero_id: parseInt(newEvent.employee.id),
        precio: newEvent.price,
        estado: "pendiente",
      })
      .then(() => {
        setEvents((prev) => [
          ...prev,
          {
            title: `${newEvent.client ? newEvent.client : "Cliente sin cita previa"} - ${newEvent.employee.name}`,
            start,
            end,
            employee: newEvent.employee.name,
            barbero_id: newEvent.employee.id,
          },
        ]);
        setIsModalOpen(false);
      })
      .catch((e) => {
        console.log("Error en createSolicitud", e);
      });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
  };

  const handleHourClick = (hour: Date) => {
    const roundedHour = roundToNearestHour(hour);
    setSelectedSlot({ start: roundedHour, end: addMinutes(roundedHour, 60), date: selectedDay });
    setIsModalOpen(true);
  };

  const handleNextDay = () => {
    setSelectedDay(addDays(selectedDay, 1));
  };

  const handlePreviousDay = () => {
    setSelectedDay(subDays(selectedDay, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const currentHour = new Date();
  const isCurrentDay = isToday(selectedDay);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Barra de navegación de días */}
      <div className="w-full bg-white border-b border-[#DADADA] flex items-center justify-between">
        <div className="w-full bg-white px-4 border-[#DADADA] rounded-t-md max-w-[400px] mx-auto mt-4 mb-4 flex items-center justify-between">
          <button onClick={handlePreviousDay} className="text-black px-2 py-1 border border-[#DADADA] rounded">
            <Image src="/img/flecha.svg" alt="Previous" width={24} height={24} />
          </button>
          <h2 className="text-lg font-normal text-black text-center">
            Citas del {format(selectedDay, "dd MMMM yyyy", { locale: locales.es })}
          </h2>
          <button onClick={handleNextDay} className="text-black px-2 py-1 border border-[#DADADA] rounded">
            <Image src="/img/flecha.svg" alt="Next" width={24} height={24} />
          </button>
        </div>
      </div>

      {/* Contenedor del calendario y calendarios de trabajadores */}
      <div className="flex flex-col lg:flex-row font-light lg:justify-between">
        {/* Calendarios de los trabajadores */}
        <div className="flex-1 p-4 overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 overflow-x-auto">
            {empleados.map((emp, index) => (
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
                          (event) =>
                            event.barbero_id === emp.id &&
                            hour.getHours() === moment(event.start_hour, "HH").hours() &&
                            selectedDay.getDate() === new Date(event.fecha!).getDate()
                        )
                        .map((event, i) => {
                          const start_hour = moment(`2019-01-01 ${event.start_hour}`);
                          const end_hour = moment(`2019-01-01 ${event.end_hour}`);
                          const eventDuration = end_hour.diff(start_hour, "minutes");
                          const colors = ["bg-blue-400", "bg-green-400", "bg-red-400", "bg-purple-400"];
                          const employeeColor = colors[index % colors.length];
                          return (
                            <div
                              key={i}
                              className={`absolute left-0 ${employeeColor} text-xs p-1 rounded`}
                              style={{
                                top: 0,
                                height: `${eventDuration}px`,
                                width: "calc(100% - 50px)",
                                margin: "4px 4px",
                                left: index === 0 ? "40px" : "0",
                              }}
                            >
                              {event.title} {event.start_hour} - {event.end_hour}
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
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateEvent={handleCreateEvent}
        slot={selectedSlot}
        employees={empleados}
        services={servicios}
      />
    </div>
  );
};

export default CalendarApp;

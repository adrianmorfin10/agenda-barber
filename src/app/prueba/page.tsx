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
import "react-big-calendar/lib/css/react-big-calendar.css";
import { setHours, isToday, addMinutes } from "date-fns";
import "./styles.css"; // Aquí se manejará el CSS
import EventModal from "./EventModal"; // Importando el componente desde otro archivo

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

const employees = [
  {
    name: "Pedro López",
    initials: "PL",
    workingHours: { start: "07:00", end: "18:00" },
    workDays: [1, 2, 3, 4, 5], // Lunes a Viernes
  },
  {
    name: "Ana Chávez",
    initials: "AC",
    workingHours: { start: "08:00", end: "17:00" },
    workDays: [1, 3, 5], // Lunes, Miércoles, Viernes
  },
  {
    name: "Juan Martínez",
    initials: "JM",
    workingHours: { start: "09:00", end: "16:00" },
    workDays: [2, 4], // Martes y Jueves
  },
  {
    name: "Carlos Pérez",
    initials: "CP",
    workingHours: { start: "08:00", end: "16:00" },
    workDays: [1, 2, 3, 4, 5], // Lunes a Viernes
  },
];

const CalendarApp = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([
    {
      title: "Corte de pelo - Juan Pérez",
      start: new Date("2024-10-22T07:00:00"),
      end: new Date("2024-10-22T08:00:00"),
      employee: "Pedro López",
    },
    {
      title: "Coloración - Ana Martínez",
      start: new Date("2024-10-22T07:00:00"),
      end: new Date("2024-10-22T08:00:00"),
      employee: "Ana Chávez",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleCreateEvent = (newEvent) => {
    console.log("Iniciando creación de evento...");

    // Verificamos qué datos se están pasando al crear el evento
    console.log("Datos del evento recibidos:", newEvent);
    console.log("Fecha del evento:", newEvent.date);
    console.log("Hora de inicio:", newEvent.startTime);
    console.log("Hora de fin:", newEvent.endTime);
    console.log("Empleado:", newEvent.employee);
    console.log("Cliente (opcional):", newEvent.client);

    const start = new Date(`${newEvent.date}T${newEvent.startTime}`);
    const end = new Date(`${newEvent.date}T${newEvent.endTime}`);

    // Eliminamos la validación que da problemas
    // Creamos el evento asegurándonos de que el cliente sea opcional.
    setEvents((prev) => [
      ...prev,
      {
        title: `${newEvent.client ? newEvent.client : "Cliente sin cita previa"} - ${newEvent.employee}`,
        start,
        end,
        employee: newEvent.employee,
      },
    ]);
    setIsModalOpen(false); // Cerrar el modal después de crear el evento
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
  };

  const handleHourClick = (hour) => {
    setSelectedSlot({ start: hour, end: addMinutes(hour, 60), date: selectedDay });
    setIsModalOpen(true);
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
    <div className="flex h-full bg-white">
      {/* Calendario pequeño a la izquierda */}
      <div className="w-1/4 p-4 border-r" style={{ maxWidth: "300px" }}>
        <div className="flex justify-between mb-4">
          <button onClick={handlePreviousMonth} className="bg-black px-2 py-1 rounded">{"<"}</button>
          <span className="text-lg text-black font-bold">{format(currentMonth, "MMMM yyyy", { locale: locales.es })}</span>
          <button onClick={handleNextMonth} className="bg-black px-2 py-1 rounded">{">"}</button>
        </div>
        <Calendar
          localizer={localizer}
          date={currentMonth}
          events={[]} // No mostrar eventos en el calendario pequeño
          startAccessor="start"
          endAccessor="end"
          style={{ height: 400 }} // Solo la altura, el resto de estilos los aplicas en styles.css
          views={["month"]}
          selectable
          onSelectSlot={({ start }) => handleDayClick(start)}
          onDrillDown={(date) => handleDayClick(date)}
          dayPropGetter={(date) => {
            const isSelectedDay = format(date, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd");

            // Aseguramos que la clase se aplique a rbc-date-cell
            return {
              className: isSelectedDay ? "rbc-date-cell selected-day" : "rbc-date-cell"
            };
          }}
          components={{
            dateCellWrapper: ({ children, value }) => {
              const isSelectedDay = format(value, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd");
              return (
                <div
                  className={`rbc-date-cell ${isSelectedDay ? "selected-day" : ""}`}
                  onClick={() => handleDayClick(value)}
                >
                  {children}
                </div>
              );
            },
          }}
        />
      </div>

      {/* Vista diaria con layout de horas */}
      <div className="flex-1 p-4">
        <h2 className="text-xl font-bold text-black mb-4 ">
          Citas del {format(selectedDay, "dd MMMM yyyy", { locale: locales.es })}
        </h2>

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateEvent={handleCreateEvent}
          slot={selectedSlot}
          employees={employees} // Pasamos empleados como prop
        />

        <div className="relative">
          <div className={`grid grid-cols-${employees.length < 4 ? employees.length : 4} gap-0`}>
            {employees.map((emp, index) => (
              <div key={emp.name} className="relative">
                <div className="flex items-center mb-2 sticky top-0 bg-white z-10">
                  <div className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full mr-2">
                    {emp.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black mb-1">{emp.name}</h3>
                    <p className="text-sm text-gray-500">
                      {emp.workingHours.start} - {emp.workingHours.end}
                    </p>
                  </div>
                </div>

                {isCurrentDay && index === 0 && (
                  <div
                    className="absolute left-0 w-full border-t-2 border-red-500"
                    style={{
                      top: `${(currentHour.getHours() - 7) * 60 + currentHour.getMinutes()}px`,
                    }}
                  >
                    <span className="bg-red-500 text-white p-1 rounded absolute -left-10 text-xs">
                      {format(currentHour, "HH:mm")}
                    </span>
                  </div>
                )}

                {Array.from({ length: 12 }, (_, hourIndex) => {
                  const hour = setHours(new Date(), 7 + hourIndex);
                  const isWorkingDay = emp.workDays.includes(getDay(selectedDay));
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
                            event.employee === emp.name &&
                            format(event.start, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd") &&
                            event.start.getHours() === hour.getHours()
                        )
                        .map((event, i) => {
                          const eventDuration = (event.end - event.start) / (1000 * 60);
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
                              {event.title} ({format(event.start, "HH:mm")} - {format(event.end, "HH:mm")})
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
    </div>
  );
};

export default CalendarApp;

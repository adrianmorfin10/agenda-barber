import React, { useState } from 'react';

interface Event {
  employee: string;
  startTime: string;
  endTime: string;
  service: string;
}

const employees = ['Adrian Morfin', 'Pedro Perez', 'Pablo Ammal'];

const GridCitas: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const handleSaveEvent = (employee: string, startTime: string, endTime: string, service: string) => {
    const newEvent = { employee, startTime, endTime, service };
    setEvents([...events, newEvent]);
  };

  const renderEvents = (employee: string) => {
    return events
      .filter(event => event.employee === employee)
      .map((event, index) => (
        <div
          key={index}
          className="absolute text-white rounded p-2"
          style={{
            top: `${parseInt(event.startTime.split(':')[0], 10) * 60}px`,
            height: `${(parseInt(event.endTime.split(':')[0], 10) - parseInt(event.startTime.split(':')[0], 10)) * 60}px`,
          }}
        >
          {`${event.startTime} - ${event.endTime}: ${event.service}`}
        </div>
      ));
  };

  const renderGrid = () => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    return hours.map((hour, index) => (
      <div key={index} className="flex flex-row">
        <div className="w-16 border-t border-l border-gray-300">{hour}</div>
        {employees.map((employee) => (
          <div key={employee} className="flex-1 border-t border-l border-gray-300 relative">
            {renderEvents(employee)}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="h-full w-full overflow-auto">
      <div className="sticky top-0 grid grid-cols-4 bg-gray-100">
        <div className="w-16"></div>
        {employees.map((employee) => (
          <div key={employee} className="text-center border-l border-gray-300 p-2">
            {employee}
          </div>
        ))}
      </div>
      {renderGrid()}
    </div>
  );
};

export default GridCitas;


import React, { useEffect, useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth } from 'date-fns';

interface CalendarioProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const Calendario: React.FC<CalendarioProps> = ({ currentDate, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);

  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate]);

  const startMonth = startOfMonth(selectedDate);
  const endMonth = endOfMonth(selectedDate);
  const startDate = startOfWeek(startMonth);
  const endDate = endOfWeek(endMonth);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  // Código de la lógica de distribución de los días en filas y columnas
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, 'd');
      const cloneDay = day;
      days.push(
        <div
          className={`flex items-center justify-center h-10 w-10 cursor-pointer ${isSameDay(day, selectedDate) ? 'bg-black text-white rounded-full' : ''} ${!isSameMonth(day, selectedDate) ? 'text-gray-400' : ''}`}
          key={day.toString()}
          onClick={() => {
            setSelectedDate(cloneDay);
            onDateChange(cloneDay);
          }}
        >
          {formattedDate}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="flex justify-around" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const handlePrevMonth = () => {
    const newDate = subMonths(selectedDate, 1);
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(selectedDate, 1);
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 w-full">
      <div className="flex justify-between mb-2">
        <button onClick={handlePrevMonth} className="bg-cover rounded">
          <img src="/img/arrow-left.svg" alt="arrow-left" className='w-7'/>
        </button>
        <div className="text-xl font-bold">
          {format(selectedDate, 'MMMM yyyy')}
        </div>
        <button onClick={handleNextMonth} className="bg-cover rounded">
          <img src="/img/arrow-right.svg" alt="arrow-right" className='w-7'/>
        </button>
      </div>
      <div className="flex justify-around">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center justify-center h-10 w-10 font-bold">
            {day}
          </div>
        ))}
      </div>
      <div>{rows}</div>
    </div>
  );
};

export default Calendario;

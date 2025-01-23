'use client';

import React, { useState } from 'react';

interface DateSelectorProps {
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateChange }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value);
    setSelectedMonth(newMonth);
    onDateChange(new Date(selectedYear, newMonth, 1)); // Usar selectedYear y newMonth para asegurar la fecha correcta
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value);
    setSelectedYear(newYear);
    onDateChange(new Date(newYear, selectedMonth, 1)); // Usar selectedMonth y newYear para asegurar la fecha correcta
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="flex items-center">
      {/* Selector de mes */}
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="border border-gray-300 p-2 rounded mr-2 text-black"
      >
        <option value="" disabled className="text-gray-400">
          Seleccionar mes
        </option>
        {months.slice(0, currentMonth + 1).reverse().map((month, index) => (
          <option key={index} value={currentMonth - index} className="text-black">
            {month}
          </option>
        ))}
      </select>

      {/* Selector de año */}
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="border border-gray-300 p-2 rounded mr-2 text-black"
      >
        <option value="" disabled className="text-gray-400">
          Seleccionar año
        </option>
        {[...Array(currentYear - 2015)].map((_, index) => (
          <option key={index} value={currentYear - index} className="text-black">
            {currentYear - index}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;

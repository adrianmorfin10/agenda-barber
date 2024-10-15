'use client';

import React, { useState } from 'react';

interface DateSelectorProps {
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const handlePreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    handleDateChange(previousDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    handleDateChange(nextDate);
  };

  return (
    <div className="flex items-center">
      <button onClick={handlePreviousDay} className="text-black mr-2">
        ←
      </button>
      <input
        type="date"
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => handleDateChange(new Date(e.target.value))}
        className="border border-gray-300 p-2 rounded mr-2"
      />
      <button onClick={handleNextDay} className="text-black">
        →
      </button>
    </div>
  );
};

export default DateSelector;

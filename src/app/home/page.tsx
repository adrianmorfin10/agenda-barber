'use client';  // Marca este archivo como Cliente Componente

import React, { useState } from 'react';
import FlechasDia from './FlechasDia';
import Calendario from './Calendario';
import GridCitas from './GridCitas';
import ModuloCitas from './ModuloCitas';
import './home.css';
import { addDays, format } from 'date-fns'; // Biblioteca para manejar fechas

const Page = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, -1));
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  return (
    <div className="flex flex-col h-screen text-neutral-950">
      <header className="p-5 flex justify-between items-center h-1/6 bg-white">
        <div className="flex w-1/3">
          <p className="p-2.5 border border-gray-200 rounded">
            Hoy
          </p>
        </div>
        <div className="flex gap-1 justify-center items-center w-1/3">
          <FlechasDia currentDate={currentDate} 
          onPrevDay={handlePrevDay} 
          onNextDay={handleNextDay} 
          />
        </div>
        <div className="flex flex-grow justify-end items-end w-1/3">
          <div className="flex bg-[#ffffff] border border-gray-200 rounded">
            <input type="text" placeholder="Buscar" className="" />
          </div>
        </div>
      </header>
      <main className="flex flex-grow justify-center items-center bg-red-400 w-full h-5/6">
        <aside className="bg-white w-3/12 h-full p-5">
          <Calendario 
          currentDate={currentDate} 
          onDateChange={handleDateChange} 
          />
        </aside>
        <section className="flex flex-grow flex-col justify-center items-center bg-indigo-500 w-9/12 h-full">
          <div className="flex justify-center items-center w-full h-1/2">
            <GridCitas />
          </div>
          <div className="flex justify-center items-center w-full h-1/2">
          <ModuloCitas />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;



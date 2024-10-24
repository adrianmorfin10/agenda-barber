import React, { useState } from 'react';
import AddClientForm from './AddClientForm';

const ScheduleAppointment: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [client, setClient] = useState('');
  const [service, setService] = useState('');
  const [startTime, setStartTime] = useState('3:30 PM');
  const [endTime, setEndTime] = useState('3:40 PM');
  const [employee, setEmployee] = useState('Adrian Morfin');
  const [total, setTotal] = useState(50);
  const [toPay, setToPay] = useState(50);
  const [isAddClientFormOpen, setIsAddClientFormOpen] = useState(false);

  const handleClientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClient(event.target.value);
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setService(event.target.value);
  };

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTime(event.target.value);
  };

  const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEmployee(event.target.value);
  };

  const toggleCita = () => {
    setIsOpen(!isOpen);
  };

  const CloseCitas = () => {
    setIsOpen(false);
  };

  const toggleAddClientForm = () => {
    setIsAddClientFormOpen(!isAddClientFormOpen);
  };

  return (
    <div>

      {/* Este es el boton que despliega el formato para agendar una cita. */}
      <button 
      onClick={toggleCita} 
      className="fixed bottom-5 right-5 bg-black text-white rounded-full w-12 h-12 text-2xl flex items-center justify-center"
      >
      +
      </button>

      {/* Fragmento del codigo cuando el boton esta en estado abierto. */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-bold">
              Cita nueva
            </h2>
            <button onClick={CloseCitas} className="pl-2 pr-2 p-1 text-gray-500 hover:text-black">
              ✕
            </button>
          </div>
          <div className="flex items-center flex-col p-6 h-full">
            <div className="flex flex-col justify-center w-full border-dashed rounded mb-4 ">

              {/* Este es un boton anidado que despliega el formato para anadir a un cliente. */}
              <div className="flex justify-center items-center">
                <button onClick={toggleAddClientForm} className="border bg-black text-white p-2 rounded">
                  Seleccionar cliente
                </button>

                {/* Componente en donde se abre el formato para anadir cliente. */}
                {isAddClientFormOpen &&
                 <AddClientForm 
                 isOpen={isAddClientFormOpen} 
                 handleClose={toggleAddClientForm} 
                 />
                }

              </div>
              {/* Aqui termina el codigo del formato para anadir a un cliente. */}

            </div>
            <div className="flex flex-col w-full mb-4">
              <select value={service} onChange={handleServiceChange} className="mt-1 p-2 border border-gray-300 rounded w-full">
                <option>Seleccionar servicio</option> {/* Aqui van variables */}
              </select>
              <div className="flex items-center mt-2">
                <button className="bg-black text-white p-2 rounded w-2/4">Añadir servicio +</button>
              </div>
            </div>
            <div className="flex justify-between w-full mb-4">
              <div className='flex flex-col w-1/4'>
                <label className="text-gray-700">Inicio</label>
                <select value={startTime} onChange={handleStartTimeChange} className="mt-1 p-2 border border-gray-300 rounded">
                  <option>3:30 PM</option> {/* Aqui van variables */}
                </select>
              </div>
              <div className='flex flex-col w-1/4'>
                <label className="text-gray-700">Fin</label>
                <select value={endTime} onChange={handleEndTimeChange} className="mt-1 p-2 border border-gray-300 rounded">
                  <option>3:40 PM</option> {/* Aqui van variables */}
                </select>
              </div>
            </div>
            <div className="flex flex-col w-full mb-4">
              <label className="block text-gray-700">Empleado</label>
              <select value={employee} onChange={handleEmployeeChange} className="mt-1 p-2 border border-gray-300 rounded w-full">
                <option>Adrian Morfin</option> {/* Aqui van variables */}
              </select>
            </div>
            <div className="flex justify-between items-end w-full mb-4 font-bold mt-72">
              <div>
                <p className='text-xs'>Total</p>
                <p className='text-2xl'>$50</p>
              </div>
              <div>
                <p className='text-xs'>A pagar</p>
                <p className='text-2xl'>$50</p>
              </div>
            </div>
            <div className="flex justify-betweengap-20 w-full mt-10 gap-1">
              <button onClick={CloseCitas} className="bg-gray-300 text-black p-2 rounded mr-2 flex flex-grow justify-center">Descartar</button>
              <button className="bg-black text-white p-2 rounded flex justify-center flex-grow">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default ScheduleAppointment;

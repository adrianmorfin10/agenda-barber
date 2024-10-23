import React from 'react';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    client: string;
    serviceType: string;
    date: string;
    startTime: string;
    endTime: string;
  };
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="font-bold text-lg">Detalles de la Cita</h2>
        <p><strong>Cliente:</strong> {event.client}</p>
        <p><strong>Servicio:</strong> {event.serviceType}</p>
        <p><strong>Fecha:</strong> {event.date}</p>
        <p><strong>Hora de Inicio:</strong> {event.startTime}</p>
        <p><strong>Hora de Fin:</strong> {event.endTime}</p>
        <button className="mt-4 bg-blue-500 text-white px-2 py-1 rounded" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default EventDetailModal;

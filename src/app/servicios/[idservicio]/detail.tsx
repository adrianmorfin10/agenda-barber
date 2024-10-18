// src/app/servicios/[idservicio]/detail.tsx

"use client"; // Asegúrate de que este archivo esté marcado como cliente

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image'; // Importar para manejar imágenes

const ServiceDetail: React.FC = () => {
  const { idservicio } = useParams();
  const router = useRouter(); // Inicializa el router

  // Simulación de servicios (esto debe ser reemplazado con datos reales)
  const services = [
    { id: 1, nombre: 'Corte de Cabello', tiempo: '30 min', precio: 20 },
    { id: 2, nombre: 'Borde de Barba', tiempo: '15 min', precio: 15 },
    { id: 3, nombre: 'Colorimetría', tiempo: '45 min', precio: 50 },
  ];

  // Convierte el idservicio a número
  const serviceId = Number(idservicio);

  // Busca el servicio según el ID
  const service = services.find((s) => s.id === serviceId); // Compara con el ID como número

  if (!service) {
    return <div>Servicio no encontrado</div>; // Manejo del caso en que no se encuentre el servicio
  }

  return (
    <div className="p-4">
      {/* Contenedor para el botón de regreso */}
      <div className="flex items-center mb-4 cursor-pointer" onClick={() => router.back()}>
        <Image
          src="/img/back.svg" // Asegúrate de que la ruta sea correcta
          alt="Regresar"
          width={20} // Ancho del icono
          height={40} // Alto del icono
          className="mr-2" // Margen derecho para separar el icono del texto
        />
        <span className="text-black">Regresar a Servicios</span>
      </div>

      <h1 className="text-2xl font-bold">Detalles del Servicio</h1>
      <p><strong>Nombre:</strong> {service.nombre}</p>
      <p><strong>Tiempo:</strong> {service.tiempo}</p>
      <p><strong>Precio:</strong> ${service.precio}</p>
    </div>
  );
};

export default ServiceDetail;

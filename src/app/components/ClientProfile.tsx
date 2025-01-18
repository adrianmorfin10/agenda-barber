"use client";

import React from "react";

interface ClientProfileProps {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  estadoMembresia: string; // Ejemplo: "Activa", "Inactiva"
  onChangePassword: () => void; // Función que se ejecuta al hacer clic en el botón de cambio de contraseña
}

const ClientProfile: React.FC<ClientProfileProps> = ({
  nombre,
  apellido,
  telefono,
  email,
  estadoMembresia,
  onChangePassword,
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-black">Perfil del Cliente</h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-600 font-medium">Nombre:</span>
          <span className="text-gray-800">{nombre}</span>
        </div>

        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-600 font-medium">Apellido:</span>
          <span className="text-gray-800">{apellido}</span>
        </div>

        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-600 font-medium">Teléfono:</span>
          <span className="text-gray-800">{telefono}</span>
        </div>

        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-600 font-medium">Correo Electrónico:</span>
          <span className="text-gray-800">{email}</span>
        </div>

        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-600 font-medium">Estado de Membresía:</span>
          <span
            className={`font-semibold ${
              estadoMembresia === "Activa" ? "text-green-600" : "text-red-600"
            }`}
          >
            {estadoMembresia}
          </span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onChangePassword}
          className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          Cambiar Contraseña
        </button>
      </div>
    </div>
  );
};

export default ClientProfile;

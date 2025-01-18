"use client";

import React from "react";
import ClientProfile from "../components/ClientProfile";

const ClientProfilePage: React.FC = () => {
  const handlePasswordChange = () => {
    // Aquí se implementa la lógica para redirigir al proceso de Auth0
    window.location.href = "https://tu-dominio.auth0.com/forgot";
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <ClientProfile
        nombre="Juan"
        apellido="Pérez"
        telefono="555-1234-567"
        email="juan.perez@example.com"
        estadoMembresia="Activa"
        onChangePassword={handlePasswordChange}
      />
    </main>
  );
};

export default ClientProfilePage;

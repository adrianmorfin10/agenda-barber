"use client";

import React from "react";
import ClientProfile from "../components/ClientProfile";
import { AppContext } from "../components/AppContext";
import ChangePasswordModal from "../components/ChangePasswordModal";

const ClientProfilePage: React.FC = () => {
  const [ state, dispatchState] = React.useContext(AppContext);
  const [ openModal, setOpenModal ] = React.useState(false);
  const handlePasswordChange = () => {
    // Aquí se implementa la lógica para redirigir al proceso de Auth0
    setOpenModal(true);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <ClientProfile
        nombre={state.user?.nombre || ''}
        apellido={`${state.user?.apellido_paterno || ''} ${state.user?.apellido_materno || ''}`}
        telefono={state.user?.telefono || ''}
        email={state.user?.email || ''}
        estadoMembresia="Activa"
        onChangePassword={handlePasswordChange}
      />
      <ChangePasswordModal 
        isOpen={openModal} 
        onClose={()=>{ 
          setOpenModal(!openModal)
        }} 
        onConfirm={(confirm:boolean)=>{
          
        }} 
      />
    </main>
  );
};

export default ClientProfilePage;

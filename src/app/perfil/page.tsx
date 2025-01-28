"use client";

import React from "react";
import ClientProfile from "../components/ClientProfile";
import { AppContext } from "../components/AppContext";
import UserService from "../services/UserService";
const userObject = new UserService();

const ClientProfilePage: React.FC = () => {

  const [ state, dispatchState] = React.useContext(AppContext);
  const [ openModal, setOpenModal ] = React.useState(false);
  const handlePasswordChange = () => {
    // Aquí se implementa la lógica para redirigir al proceso de Auth0
    userObject.changePassword(state.user.email).then(()=>{
      alert("Revise su correo electronico y siga el link para cambiar la contraseña")
    }).catch((e:any)=>{
      alert("Ha ocurrido un error al tratar de cambia su contraseña")
    })
    
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
      
    </main>
  );
};

export default ClientProfilePage;

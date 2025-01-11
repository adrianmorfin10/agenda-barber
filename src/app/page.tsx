// src/app/page.tsx
"use client";

import React from "react";
import { AppContext } from "./components/AppContext";
import { hasMemberActive, isPrepago } from "./Utils";

export default function HomePage() {
  const [state, dispatchState] = React.useContext(AppContext);
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(()=>{
    if(state.user)
      setLoading(false);
  },[state.user])
  if(loading)
    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold">Bienvenido a la Agenda Barber</h1>
        <p className="mt-4">Cargando datos del usuario</p>
        {/* Agrega más contenido según sea necesario */}
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <div>
      <h1 className="text-2xl font-bold">Bienvenido a la Agenda Barber</h1>
      <p className="mt-4">Aquí puedes gestionar tus citas, ventas y más.</p>
      {state.user.clientes && !hasMemberActive(state.user.clientes[0]) && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>El usuario no tiene la suscripción activa</p>
        </div>
      )}
      {/* Agrega más contenido según sea necesario */}
      </div>
    </div>
  );
}

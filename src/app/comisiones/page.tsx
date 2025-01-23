"use client";
import React from 'react';
import Comisiones from '../components/Comisiones';
import { AppContext } from '../components/AppContext';

const ComisionesPage = () => {
  const [state, dispatchState] = React.useContext(AppContext);
  if(state.user && state.user.rol === "encagado")
    return null;
  return <Comisiones />;
};

export default ComisionesPage;

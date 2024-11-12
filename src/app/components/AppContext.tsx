"use client";
import React from 'react';

export const AppContext = React.createContext<any>([{ }, () => {}]);
export const useAppContext = () => React.useContext(AppContext);
"use client";
import React from 'react';
import { AppContext } from './AppContext';
import NavBar from './NavBar';
export const reducer = (state = initialState, action) => {
    const { key, value } = action;
    let newData = { ...state };
    newData[key] = value;
    return newData;
  }
const MainComponent = ({ children })=>{
    const [ state, dispatch ] = React.useReducer(reducer, {})
    const store = React.useMemo(() => ([state, dispatch]), [state]);
    return (
        <AppContext.Provider value={store}>
            <NavBar />
            {/* Margen superior aplicado solo en dispositivos pequeños */}
            <main className="flex-grow min-h-screen mt-16 md:mt-0">{children}</main>
        </AppContext.Provider>
    )
}
export default MainComponent
"use client";
import React, { useReducer, useMemo, useEffect, useState, ReactNode } from 'react';
import { AppContext } from './AppContext';
import NavBar from './NavBar';
import LoadingSpinner from './LoadingSpinner'; // Asegúrate de tener este componente

// Estado inicial
const initialState = {
    user: null,
    isAuthenticated: false,
    // Otros estados iniciales pueden ir aquí
};

// Definimos los tipos de `state` y `action`
interface State {
    user: any;
    isAuthenticated: boolean;
    // Agrega más propiedades según necesites
}

interface Action {
    key: string;
    value: any;
}

// Reducer con tipado
export const reducer = (state: State = initialState, action: Action) => {
    const { key, value } = action;
    console.log("action reducer", action)
    return {
        ...state,
        [key]: value,
    };
};

// Tipamos las props de MainComponent para evitar el error de 'children'
interface MainComponentProps {
    children: ReactNode;
}

const MainComponent: React.FC<MainComponentProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const store = useMemo(() => [state, dispatch], [state]);

    // Estado de loading
    const [isLoading, setIsLoading] = useState(false);

    // Simulación de carga al montar (esto es opcional)
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 2000); // Carga simulada de 2 segundos
        return () => clearTimeout(timer);
    }, []);

    return (
        <AppContext.Provider value={store}>
            <NavBar />
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                // Margen superior aplicado solo en dispositivos pequeños
                <main className="flex-grow min-h-screen mt-16 md:mt-0">{children}</main>
            )}
        </AppContext.Provider>
    );
};

export default MainComponent;

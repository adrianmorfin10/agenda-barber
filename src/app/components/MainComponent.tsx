"use client";
import React, { useReducer, useMemo, useEffect, useState, ReactNode } from 'react';
import { AppContext } from './AppContext';
import NavBar from './NavBar';
import LoadingSpinner from './LoadingSpinner'; // Asegúrate de tener este componente
import { useUser } from '@auth0/nextjs-auth0/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import UserService from '../services/UserService';
import { addInterceptorToAxios, getHeaders, getRole } from '../Utils';

const userObject = new UserService();
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
    const { user, error, isLoading: userLoading } = useUser();
    const _user:any = user;
    const { user: user_data } = state;
    const store = useMemo(() => [state, dispatch], [state]);
    // Simulación de carga al montar (esto es opcional)
    useEffect(() => {
        if(user)
            userObject.getUserByUserProviderId(_user.sub).then((data) => {
                const tmpData = { ...data, rol: getRole(data) };
                addInterceptorToAxios(getHeaders(tmpData));
                dispatch({ key: 'user', value : { ...tmpData, auth0_user_data: user } }); 
            });
    }, [user]);

    if (userLoading || !user_data) return <LoadingSpinner />;
    if (error) return <div>{error.message}</div>;
    if (!user) return <div>Debes iniciar sesión</div>;
    // Estado de loading
    return (
        <AppContext.Provider value={store}>
            <NavBar />
            
            <main className="flex-grow min-h-screen mt-16 md:mt-0">{children}</main>
           
        </AppContext.Provider>
    );
};

export default withPageAuthRequired(MainComponent);

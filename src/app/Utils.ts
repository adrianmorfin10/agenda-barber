import axios from 'axios';
import * as _ from "lodash";

export const addInterceptorToAxios = (headers: any) => {
    axios.interceptors.request.use((config: any) => {
        config.headers = { ...config.headers, ...headers };
        // Do something before request is sent
        return config;
    }, (error: any) => {
        // Do something with request error
        return Promise.reject(error);
    });

}
export const getRole = (user: any) => {
    if (!user) return 'admin';
    const { barberos, clientes, email } = user;
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL)
        return 'admin';
    if (barberos?.length) {
        return 'encargado';
    }
    if (clientes?.length) {
        return 'cliente';
    }
    return 'admin';
}
export const getHeaders = (user:any) => {

    if(!user) return {};

    const { barberos, clientes, email } = user;

    if(getRole(user) === "admin")
        return {};

    const headers:any = { rol: getRole(user) };
   
    if(barberos.length){
        headers['local_id'] = barberos[0].local_id;
    }


    return headers;
    
}

export const clientHasMembershipActive = (clientes: any[], services: any[], reservaciones: any[]):boolean => {
    const cliente = clientes.length ? clientes[0] : {};
    const { is_member } = cliente;
    if(!is_member) return false;
    
    return getMembershipServices(cliente, services, reservaciones).length > 0;
}

//obtener objeto membresia
//obtener objeto reservaciones del cliente filtrado por las reservaciones que esten completadas o pendientes en el mes en curso
//Agrupar las reservaciones por servicio
//Si tiene algun servicio donde la cantidad de reservaciones sea menor a la cantidad de reservaciones de la membresia agregar al objeto membresia
export const getMembershipServices = (cliente: any, services: any[], reservacions:any[] ):any[] => {
    const _services:any[] = [];
    const { membresia } = cliente;
    const reservetionFileredByState = reservacions.filter((reservacion:any)=>reservacion.estado === "completada" || reservacion.estado === "pendiente");
    const reservetionsGroupedByService = _.groupBy(reservetionFileredByState, 'servicio_id');
    membresia.membresia_servicios.forEach((ms:any)=>{
        const reservetions = reservetionsGroupedByService[ms.servicio_id] || [];
        if(reservetions.length < ms.cantidad_reservaciones){
            _services.push(services.find((service:any)=>service.id === ms.servicio_id));
        }
    });
    console.log('getMembershipServices', _services, reservetionsGroupedByService);
    return _services;
}
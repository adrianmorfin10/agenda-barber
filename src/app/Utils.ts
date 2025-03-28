import axios from 'axios';
import * as _ from "lodash";
import moment from 'moment';

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
    return getMembershipServices(cliente, services, reservaciones.filter(r=>r.cliente_id === cliente.id)).length > 0;
}

//obtener objeto membresia
//obtener objeto reservaciones del cliente filtrado por las reservaciones que esten completadas o pendientes en el mes en curso
//Agrupar las reservaciones por servicio
//Si tiene algun servicio donde la cantidad de reservaciones sea menor a la cantidad de reservaciones de la membresia agregar al objeto membresia
export const getMembershipServices = (cliente: any, services: any[], reservacions:any[] ):any[] => {
    const _services:any[] = [];
    
    const { cliente_membresia } = cliente;
    if(!cliente_membresia) return _services;
    const active_cliente_membresia = cliente_membresia.find((cm:any)=>cm.activo === true) || {};
    if(!active_cliente_membresia)
        return _services;
    const {  membresia, fecha_inicio, fecha_fin } = active_cliente_membresia;
    const currentUTCDate = moment().utc().toDate();
    const endDate = moment(fecha_fin).utc().toDate();
    const startDate = fecha_inicio ? moment(fecha_inicio).toDate() : false;
    if((!startDate) ||  currentUTCDate >= endDate)
        return _services;
    
    if(!reservacions.length){
        const membresia_service_ids = membresia.membresia_servicios.map((ms:any)=>parseInt(ms.servic))
        return services.filter((s:any)=>membresia_service_ids.includes(parseInt(s.id)));
    }
    
    const reservetionFileredByState = reservacions.filter((reservacion:any)=>reservacion.estado === "completada" || reservacion.estado === "pendiente");
    const reservetionsGroupedByService = _.groupBy(reservetionFileredByState, 'servicio_id');
    membresia.membresia_servicios.forEach((ms:any)=>{
        const reservetions = reservetionsGroupedByService[ms.servicio_id] || [];
        if(reservetions.length < ms.cantidad_reservaciones){
            _services.push(services.find((service:any)=>service.id === ms.servicio_id));
        }
    });
    
    return _services;
}

export const isPrepago = (cliente:any, service_id: number, reservaciones:any[]) => {
    if(!cliente) return false;
    const { cliente_membresia } = cliente;
    if(!cliente_membresia) return false;
    const active_cliente_membresia = cliente_membresia.find((cm:any)=>cm.activo === true) || {};
    
    if(!active_cliente_membresia)
        return false;
    const {  membresia, fecha_inicio, fecha_fin } = active_cliente_membresia;

    if(!membresia) return false;
    const currentUTCDate = moment().utc().toDate();
    const fechaFinDate = moment(fecha_fin).toDate();

    if(currentUTCDate >= fechaFinDate)
        return false;
    
    const reservetionFileredByState = reservaciones.filter((reservacion:any)=>reservacion.estado === "completada" || reservacion.estado === "pendiente");
    
   
    const ms = membresia.membresia_servicios.find((ms:any)=>ms.servicio_id.toString() === service_id.toString());
    const reservetionsGroupedByService = _.groupBy(reservetionFileredByState, 'servicio_id');
    
    const reservetions = reservetionsGroupedByService[service_id.toString()] || [];
 
    return (reservetions.length < (ms?.cantidad_reserv || 0));
}
const cache: { [key: string]: boolean } = {};
export const hasMemberActive = (cliente:any) =>{
    
    if(!cliente) return false;
    const { id, cliente_membresia } = cliente;
    if (!id) return false;

    // Check if the result is already in the cache
    if (cache[id] !== undefined) {
        return cache[id];
    }

    if(!cliente_membresia) return false;
    const active_cliente_membresia = cliente_membresia.find((cm:any)=>cm.activo === true) || {};
    const {  membresia, fecha_inicio, fecha_fin } = active_cliente_membresia;
    if(!membresia) return false;
    const currentUTCDate = moment().utc().toDate();
    const fechaFinDate = moment(fecha_fin).toDate();

    const isActive = currentUTCDate < fechaFinDate;
    // Store the result in the cache
    cache[id] = isActive;
    
    return true
}
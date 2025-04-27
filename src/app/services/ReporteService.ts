import axios from "axios";
import HttpService from "./HttpService";
import moment from "moment";
export enum EstadoCliente {
    NUEVO = "NUEVO",
    ACTIVO = "ACTIVO",
    INACTIVO = "INACTIVO",
}
class ReporteService extends HttpService {

    constructor() {
        super();
    }

    async reporteGeneral(local_id: any, month:number | null, year:number | null) {
        const response = await axios.post(`${this.baseUrl}/reporte/general`, { local_id, year, month });
        return response.data;
    }

    async reporteCliente(local_id: any, month:number | null, year:number | null, client_id: number | null, tipo: string = 'citas') {
        const response = await axios.post(`${this.baseUrl}/reporte/cliente`, { local_id, year, month, client_id, tipo });
        return response.data;
    }

    async reporteEmpleado(local_id: any, month:number | null, employee_id: number | null, tipo: string = 'citas') {
        const response = await axios.post(`${this.baseUrl}/reporte/empleado`, { local_id, month, employee_id, tipo });
        return response.data;
    }

    async reporteVentaEmpleado(local_id: any, periodo: string, employee_id: number | null, current_date: string, start_date?: string, end_date?: string){
        const response = await axios.post(`${this.baseUrl}/reporte/ventas-empleado`, { local_id, employee_id, periodo, current_date, start_date, end_date  });
        return response.data;
    }

    async  reporteClientsFrecuentes(local_id: any, current_date: string){
        const response = await axios.post(`${this.baseUrl}/reporte/cliente-frecuentes`, { local_id, current_date  });
        return response.data;
    }

    async reportVentasAdmin(filter?:any, order?:any){
        const body = { ...filter };
        if(order)
            body.order = order;
        const response = await axios.post(`${this.baseUrl}/reporte/reporte-admin`, body);
        return response.data;
    }

    static getEstadoCliente(fecha?: Date){
        if(!fecha) return EstadoCliente.NUEVO
        const now = moment();
        const fecha_moment = moment(fecha);
        const diferenciaMeses = now.diff(fecha_moment, 'months');
        if(diferenciaMeses >= 3) return EstadoCliente.INACTIVO;
        return EstadoCliente.ACTIVO
    }
    
}
export default ReporteService;
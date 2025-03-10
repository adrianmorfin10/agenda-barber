import axios from "axios";
import HttpService from "./HttpService";

class ReporteService extends HttpService {

    constructor() {
        super();
    }

    async reporteGeneral(local_id: any, month:number | null, year:number | null) {
        const response = await axios.post(`${this.baseUrl}/reporte/general`, { local_id, year, month });
        return response.data;
    }

    async reporteCliente(local_id: any, month:number | null, year:number | null, client_id: number | null) {
        const response = await axios.post(`${this.baseUrl}/reporte/cliente`, { local_id, year, month, client_id });
        return response.data;
    }

    async reporteEmpleado(local_id: any, month:number | null, employee_id: number | null) {
        const response = await axios.post(`${this.baseUrl}/reporte/empleado`, { local_id, month, employee_id });
        return response.data;
    }

    async reporteVentaEmpleado(local_id: any, periodo: string, employee_id: number | null, current_date: string){
        const response = await axios.post(`${this.baseUrl}/reporte/ventas-empleado`, { local_id, employee_id, periodo, current_date  });
        return response.data;
    }

    async  reporteClientsFrecuentes(local_id: any, current_date: string){
        const response = await axios.post(`${this.baseUrl}/reporte/cliente-frecuentes`, { local_id, current_date  });
        return response.data;
    }

    async reportVentasAdmin(){
        const response = await axios.post(`${this.baseUrl}/reporte/reporte-admin`, { });
        return response.data;
    }
    
}
export default ReporteService;
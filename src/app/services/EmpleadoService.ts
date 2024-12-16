import axios from "axios";
import HttpService from "./HttpService";

class EmpleadoService extends HttpService {

    constructor() {
        super();
    }

    async getEmpleados(filter?: any) {
        const response = await axios.get(`${this.baseUrl}/barbero${filter ? `?l=${filter.local_id}` : '' }`);
        return response.data;
    }

    async createEmpleado(empleado:any){
        const response = await axios.post(`${this.baseUrl}/barbero/create`, empleado);
        return response.data;
    }

}
export default EmpleadoService;
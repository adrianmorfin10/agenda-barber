import axios from "axios";
import HttpService from "./HttpService";

class ServicioService extends HttpService {

    constructor() {
        super();
    }

    async getServicios(filter: any = false) {
        const response = await axios.get(`${this.baseUrl}/servicio${filter ? `?l=${filter.local_id}` : '' }`);
        return response.data;
    }
    
    async createService(servicio: any): Promise<void> {
        await axios.post(`${this.baseUrl}/servicio/create`, servicio);
    }
}
export default ServicioService;
import axios from "axios";
import HttpService from "./HttpService";

class MembresiaService extends HttpService {

    constructor() {
        super();
    }

    async getMembresias(filter: any = false) {
        const response = await axios.get(`${this.baseUrl}/membresia${filter ? `?l=${filter.local_id}` : '' }`);
        return response.data;
    }
    
    async createMembresia(membresia: any): Promise<void> {
        await axios.post(`${this.baseUrl}/membresia/create`, membresia);
    }
}

export default MembresiaService;
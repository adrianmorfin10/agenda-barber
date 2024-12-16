import axios from "axios";
import HttpService from "./HttpService";

class SolicitudService extends HttpService {

    constructor() {
        super();
    }

    async getSolicitudes(filter: any = false) {
        const response = await axios.get(`${this.baseUrl}/reservacion${filter ? `?l=${filter.local_id}` : '' }`);
        return response.data;
    }

    async getSolicitud(id: string) {
        const response = await axios.get(`${this.baseUrl}/reservacion/${id}`);
        return response.data;
    }

    async createSolicitud(client: any) {
        const response = await axios.post(`${this.baseUrl}/reservacion/create`, client);
        return response.data;
    }

    async updateSolicitud(id: string, client: any) {
        const response = await axios.post(`${this.baseUrl}/reservacion/${id}/update`, client);
        return response.data;
    }
    
    async deleteSolicitud(id: string) {
        const response = await axios.post(`${this.baseUrl}/reservacion/${id}/delete`);
        return response.data;
    }
}
export default SolicitudService;
import axios from "axios";
import HttpService from "./HttpService";

class SolicitudService extends HttpService {

    constructor() {
        super();
    }

    async getSolicitudes(filter: any = false) {
        const keys = Object.keys(filter);
        const response = await axios.get(`${this.baseUrl}/reservacion${ keys.length ? `?${keys.map((k:string)=>`${k}=${filter[k]}`).join('&')}` : '' }`);
        return response.data;
    }

    async getSolicitudesCurrentMonth(filter: any = false) {
        const keys = Object.keys(filter);
        const response = await axios.get(`${this.baseUrl}/reservacion/current/month${ keys.length ? `?${keys.map((k:string)=>`${k}=${filter[k]}`).join('&')}` : '' }`);
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

    async updateSolicitud(id: string | null, reservacion: any | null) {
        if(!id || !reservacion) return;
        const response = await axios.post(`${this.baseUrl}/reservacion/${id}/update`, reservacion);
        return response.data;
    }
    
    async deleteSolicitud(id: string) {
        const response = await axios.post(`${this.baseUrl}/reservacion/${id}/delete`);
        return response.data;
    }
}
export default SolicitudService;
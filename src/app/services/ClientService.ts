import axios from "axios";
import HttpService from "./HttpService";

class ClientService extends HttpService {

    constructor() {
        super();
    }

    async getClients(filter = false) {
        console.log("filter client", filter)
        const response = await axios.get(`${this.baseUrl}/clients${filter ? `?l=${filter.local_id}` : '' }`);
        return response.data;
    }

    async getClient(id: string) {
        const response = await axios.get(`${this.baseUrl}/clients/${id}`);
        return response.data;
    }

    async createClient(client: any) {
        const response = await axios.post(`${this.baseUrl}/clients/create`, client);
        return response.data;
    }

    async updateClient(id: string, client: any) {
        const response = await axios.post(`${this.baseUrl}/clients/${id}/update`, client);
        return response.data;
    }
    
    async deleteClient(id: string) {
        const response = await axios.post(`${this.baseUrl}/clients/${id}/delete`);
        return response.data;
    }
}
export default ClientService;
import axios from "axios";
import HttpService from "./HttpService";

// Definimos un tipo para los filtros (ajústalo según los filtros disponibles)
interface LocalFilterData {
    city?: string;
    country?: string;
    // Agrega otros filtros aquí según sea necesario
}

// Definimos un tipo para los datos de un local
interface Local {
    id: number;
    name: string;
    address: string;
    seleccionado?: boolean;
    // Agrega otras propiedades aquí según la estructura de un local
}

class LocalService extends HttpService {
    constructor() {
        super();
    }

    async getLocales(filterData: LocalFilterData | null = null): Promise<Local[]> {
        const response = await axios.get(`${this.baseUrl}/local`, { params: filterData });
        return response.data;
    }

    async createLocal(newLocal: Local|any): Promise<void> {
        await axios.post(`${this.baseUrl}/local/create`, newLocal);
    }

    async updateLocal(local: Local|any, id: number): Promise<void> {
        await axios.post(`${this.baseUrl}/local/${id}/update`, local);
    }
}

export default LocalService;

import axios from "axios";
import HttpService from "./HttpService";

class ComisionService extends HttpService {

    constructor() {
        super();
    }

    async getComisiones(tipo:string, empleado: string) {
        const response = await axios.get(`${this.baseUrl}/comision?t=${tipo}&e=${empleado}`);
        return response.data;
    }

    
}
export default ComisionService;
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

    saveComision(data:any){
        console.log("data", data)
        return axios.post(`${this.baseUrl}/comision/save`, data);
    }

    
}
export default ComisionService;
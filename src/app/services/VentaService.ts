import axios from "axios";
import HttpService from "./HttpService";

class VentaService extends HttpService {

    constructor() {
        super();
    }

    async getAll(local_id:number, periodo: string){
        const response = await axios.get(`${this.baseUrl}/venta?local_id=${local_id}&periodo=${periodo}`);
        return response.data;
    }
    
    async getCitasPorCobrarByLocal(local_id: any) {
        const response = await axios.get(`${this.baseUrl}/venta/${local_id}/por-cobrar`);
        return response.data;
    }

    async getMembresiasPorCobrarByLocal(local_id: any) {
        const response = await axios.get(`${this.baseUrl}/venta/${local_id}/membresias`);
        return response.data;
    }

    async checkout(carrito:any){

        const response = await axios.post(`${this.baseUrl}/venta/create`, carrito);
        return response.data;
         
    }
    
    
}
export default VentaService;
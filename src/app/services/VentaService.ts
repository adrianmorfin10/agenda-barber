import axios from "axios";
import HttpService from "./HttpService";

class VentaService extends HttpService {

    constructor() {
        super();
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
         
    }
    
    
}
export default VentaService;
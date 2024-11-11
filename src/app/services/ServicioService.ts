import axios from "axios";
import HttpService from "./HttpService";

class ServicioService extends HttpService {

    constructor() {
        super();
    }

    async getServicios(filterData: any = false) {
        const response = await axios.get(`${this.baseUrl}/servicio`, filterData || {});
        return response.data;
    }

}
export default ServicioService;
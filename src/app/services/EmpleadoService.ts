import axios from "axios";
import HttpService from "./HttpService";

class EmpleadoService extends HttpService {

    constructor() {
        super();
    }

    async getEmpleados(filterData: any) {
        const response = await axios.get(`${this.baseUrl}/barbero`, filterData);
        return response.data;
    }

}
export default EmpleadoService;
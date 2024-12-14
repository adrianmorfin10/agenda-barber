import axios from "axios";
import HttpService from "./HttpService";

class ReporteService extends HttpService {

    constructor() {
        super();
    }

    async reporteGeneral(local_id: any, month:number | null, year:number | null) {
        const response = await axios.post(`${this.baseUrl}/reporte/general`, { local_id, year, month });
        return response.data;
    }

    
    
    
}
export default ReporteService;
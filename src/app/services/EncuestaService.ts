import axios from "axios";
import HttpService from "./HttpService";

class EncuestaService extends HttpService {

    constructor() {
        super();
    }

    async create(object: any) {
        const response = await axios.post(`${this.baseUrl}/encuesta/create`, object);
        return response.data;
    }

}
export default EncuestaService;
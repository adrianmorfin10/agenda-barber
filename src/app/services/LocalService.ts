import axios from "axios";
import HttpService from "./HttpService";

class LocalService extends HttpService {

    constructor() {
        super();
    }

    async getLocales(filterData: any =  null) {
        const response = await axios.get(`${this.baseUrl}/local`, filterData);
        return response.data;
    }

    async createLocal(newLocal){
        return axios.post(`${this.baseUrl}/local/create`, newLocal);
    }
    async updateLocal(local, id){
        return axios.post(`${this.baseUrl}/local/${id}/update`, local);
    }

}
export default LocalService;
import axios from "axios";
import HttpService from "./HttpService";

class UserService extends HttpService {

    constructor() {
        super();
    }

    async getUserByUserProviderId(user_provider_id: string) {
        const response = await axios.get(`${this.baseUrl}/users/user-by-external-provider-id/${user_provider_id}`);
        return response.data;
    }

}
export default UserService;
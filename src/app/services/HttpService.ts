class HttpService {
    protected baseUrl: string;

    constructor() {
        this.baseUrl = process.env.BASE_URL || "http://localhost:3000";
    }
}
export default HttpService;
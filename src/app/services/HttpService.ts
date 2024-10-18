class HttpService {
    protected baseUrl: string;

    constructor() {
        this.baseUrl = process.env.REACT_APPBASE_URL || "http://localhost:5001";
    }
}
export default HttpService;
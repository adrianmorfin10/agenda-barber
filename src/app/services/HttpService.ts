class HttpService {
    public baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5001";
    }
}
export default HttpService;
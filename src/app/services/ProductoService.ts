import axios from "axios";
import HttpService from "./HttpService";

class ProductoService extends HttpService {

    constructor() {
        super();
    }

    async getProductos(filter: any = false) {
        const response = await axios.get(`${this.baseUrl}/producto${filter ? `?l=${filter.local_id}` : '' }`);
        return response.data;
    }

    async createProducto(producto: any): Promise<void> {
        await axios.post(`${this.baseUrl}/producto/create`, producto);
    }

    async deleteProducto(idProducto:number): Promise<void>{
        await axios.post(`${this.baseUrl}/producto/${idProducto}/delete`);
    }

}
export default ProductoService;
import axios from "axios";
import HttpService from "./HttpService";

class VentaService extends HttpService {
  constructor() {
    super();
  }

  async getAll(local_id: number, periodo: string, currentDate: string) {
    console.log("current date", currentDate);
    const response = await axios.get(
      `${this.baseUrl}/venta?local_id=${local_id}&periodo=${periodo}&current_date=${currentDate}`
    );
    return response.data;
  }

  async getCitasPorCobrarByLocal(local_id: any) {
    const response = await axios.get(`${this.baseUrl}/venta/${local_id}/por-cobrar`);
    return response.data;
  }

  async getMembresiasPorCobrarByLocal(local_id: any) {
    const response = await axios.get(`${this.baseUrl}/venta/${local_id}/membresias`);
    return response.data;
  }

  async deleteVenta(id: number) {
    const response = await axios.post(`${this.baseUrl}/venta/${id}/delete`);
    return response.data;
  }

  async checkout(carrito: any) {
    const response = await axios.post(`${this.baseUrl}/venta/create`, carrito);
    return response.data;
  }

  async getEmpleados(local_id: number) {
    const response = await axios.get(`${this.baseUrl}/barbero?local_id=${local_id}`);
    return response.data;
  }
}

export default VentaService;
interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    instagram: string;
    citas: number;
    inasistencias: number;
    cancelaciones: number;
    ultimaVisita: string;
    descuento: string;
    ingresosTotales: string;
    membresia: string;
    tipo: string;
    serviciosDisponibles: number;
    proximoPago: string;
    avatar: string | null
  }
  export default Cliente;
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
    isMember?: boolean;
    membersia?: object;
    membresia_id?: number;
    tipo: string;
    serviciosDisponibles: number;
    proximoPago: string;
    cliente_membresia?: object;
    avatar: string | null
  }
  export default Cliente;
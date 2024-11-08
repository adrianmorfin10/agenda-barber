// src/app/interfaces/Empleado.ts

export interface Empleado {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    instagram?: string;
    citas: number;             // Total de citas del empleado
    inasistencias: number;      // Número de inasistencias
    cancelaciones: number;      // Número de cancelaciones
    ultimaVisita: string;       // Fecha de última visita
    ingresosTotales: string;    // Ingresos totales en formato string
    tipo: string;               // Tipo de empleado (ej. "Black")
    diasTrabajo: number[];      // Días de trabajo en formato [1,2,3,...]
    servicios: number[];        // Servicios que el empleado puede brindar
}
"use client";

import React, { useState } from 'react';
import SelectorArbol from './SelectorArbol';
import DetallesComisiones from './DetallesComisiones';
import SubNavBar from './SubNavBar';
import ServicioService from '../services/ServicioService';
import EmpleadoService from '../services/EmpleadoService';
import ProductoService from '../services/ProductoService';
import MembresiaService from '../services/MembresiaService';
import { AppContext } from './AppContext';

const servicioObject = new ServicioService();
const empleadoObject = new EmpleadoService();
const productoObject = new ProductoService();
const membresiaObject = new MembresiaService();
interface Comision {
  empleadoId: number;
  comisionProducto: number;
  comisionServicio: number;
  comisionMembresia: number;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

const Comisiones: React.FC = () => {
 

  const [comisiones, setComisiones] = useState<Comision[]>([
    { empleadoId: 1, comisionProducto: 0, comisionServicio: 0, comisionMembresia: 0 },
    { empleadoId: 2, comisionProducto: 0, comisionServicio: 0, comisionMembresia: 0 },
  ]);

  const [selectedEmpleado, setSelectedEmpleado] = useState<'todos' | Empleado>('todos');
  const [activeTree, setActiveTree] = useState<string | null>(null);
  const [membresias, setMembreias] = useState([]);
  const [productos, setSProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [state, dispatchState] = React.useContext(AppContext);
  React.useEffect(() => {
    getData(state.sucursal ? { local_id: state.sucursal.id } : false).then();
  }, [state.sucursal]);
  const getData = async (filter:any) => {
    const _servicios = await servicioObject.getServicios(filter);
    setServicios(_servicios);
    const empleados = await empleadoObject.getEmpleados(filter);
    setEmpleados(empleados.filter((item:any)=>item.usuario).map((item:any)=>{
      return {
        nombre: item.usuario.nombre,
        apellido: item.usuario.apellido_paterno || item.usuario.apellido_materno
      }
    }));
    const _membresias = await membresiaObject.getMembresias(filter);
    setMembreias(_membresias);
    const _productos = await productoObject.getProductos(filter);
    setSProductos(_productos)
    
  }
  return (
    <div className="bg-white h-screen p-5 flex flex-col">
      <SubNavBar />
      <div className="flex flex-grow">
        <SelectorArbol
          empleados={empleados}
          selectedEmpleado={selectedEmpleado}
          setSelectedEmpleado={setSelectedEmpleado}
          activeTree={activeTree}
          setActiveTree={setActiveTree}
        />
        <DetallesComisiones
          selectedEmpleado={selectedEmpleado}
          comisiones={comisiones}
          setComisiones={setComisiones}
          activeTree={activeTree}
        />
      </div>
    </div>
  );
};

export default Comisiones;

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
import ComisionService from '../services/ComisionService';

const servicioObject = new ServicioService();
const empleadoObject = new EmpleadoService();
const productoObject = new ProductoService();
const membresiaObject = new MembresiaService();
const comisionObject = new ComisionService();

interface Comision {
  id: number;
  nombre: string;
  comision: number;
}

interface Categoria {
  general: number;
  items: Comision[];
}

interface EmpleadoComisiones {
  productos: Categoria;
  servicios: Categoria;
  membresias: Categoria;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
}

const Comisiones: React.FC = () => {

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [comisiones, setComisiones] = useState([]);
  const [vmComisiones,  setVmComisiones ] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<any>('todos');
  const [activeTree, setActiveTree] = useState<"productos" | "servicios" | "membresias" | null>(null);
  const [membresias, setMembresias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [generalComision, setGeneralComision] = useState(0);
  const [typeComision, setTypeComision] = React.useState(null);
  const [state, dispatchState] = React.useContext(AppContext);
  
  React.useEffect(() => {
    getData(state.sucursal ? { local_id: state.sucursal.id } : false).then();
  }, [state.sucursal]);

  React.useEffect(()=>{
    if(selectedEmpleado?.id && typeComision)
      comisionObject.getComisiones(typeComision, selectedEmpleado?.id).then(response=>{
        setComisiones(response);
      }).catch(error=>{})
  },[selectedEmpleado, typeComision])

  const getComisionsAndMap = (_comisions:any, list:any, type:any)=>{
    const comisions = (_comisions || []).filter((item:any)=>item.tipo === type);
    return list.map((item:any)=>{
      let comision = null;
      switch (type) {
        case 'productos':
          comision = comisions.find((c:any)=>c.comisionProducto.id === item.id);
          break;
        case 'servicios':
          comision = comisions.find((c:any)=>c.comisionServicio.id === item.id);
          break;
        case 'membresias':
          comision = comisions.find((c:any)=>c.comisionMembresia.id === item.id);
          break;
      }
      return ({ ...comision, nombre: item.nombre, comision: comision?.porciento || 0 })
    })
  }
  React.useEffect(()=>{
    let list:any[] = [];
    switch (activeTree) {
      case 'productos':
        list = productos;
        break;
      case 'servicios':
        list = servicios;
        break;
      case 'membresias':
        list = membresias;
        break;
    }
    const comisionesFiltred = getComisionsAndMap(comisiones, list, activeTree);
    setVmComisiones(comisionesFiltred);
  },[activeTree]);

  const getData = async (filter:any) => {
    const _servicios = await servicioObject.getServicios(filter);
    setServicios(_servicios);
    const empleados = await empleadoObject.getEmpleados(filter);
    setEmpleados(empleados.filter((item:any)=>item.usuario).map((item:any)=>{
      return {
        id: item.id,
        nombre: item.usuario.nombre,
        apellido: item.usuario.apellido_paterno || item.usuario.apellido_materno
      }
    }));
    const _membresias = await membresiaObject.getMembresias(filter);
    setMembresias(_membresias);
    const _productos = await productoObject.getProductos(filter);
    setProductos(_productos)
    
  }

  
  const handleGeneralComisionChange = (categoria: keyof EmpleadoComisiones, nuevaComision: number) => {

    
  };

  const handleSpecificComisionChange = (
    categoria: keyof EmpleadoComisiones,
    itemId: number,
    nuevaComision: number
  ) => {
    if (!selectedEmpleado || selectedEmpleado === "todos") return;

    const empleadoId = selectedEmpleado.id;

    setComisiones([]);
  };

  const guardarComisiones = () => {
    
    const newComisiones = vmComisiones.map((item:any)=>({ ...item, comision:  generalComision }));
    setVmComisiones(newComisiones);
    setIsModalOpen(true); // Abrir modal
  };

  const cerrarModal = () => {
    setIsModalOpen(false); // Cerrar modal
  };

  

  return (
    <div className="bg-white h-screen p-5 flex flex-col">
      <SubNavBar />
      <div className="flex flex-grow">
        <SelectorArbol
          empleados={empleados}
          selectedEmpleado={selectedEmpleado}
          setSelectedEmpleado={setSelectedEmpleado}
          activeTree={activeTree}
          setActiveTree={(activeTree)=>{
            setActiveTree(activeTree);
            setGeneralComision(0);
          }}
        />
        <div className="flex-1 p-4 text-black">
          {selectedEmpleado && selectedEmpleado !== "todos" && activeTree && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-black">
                Comisiones de {selectedEmpleado.nombre} - {activeTree.charAt(0).toUpperCase() + activeTree.slice(1)}
              </h2>
              <div className="mb-4">
                <label className="block font-semibold mb-2 text-black">Comisión General</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={generalComision}
                    onChange={(e:any) =>{
                      const generalValue = parseInt(e.target.value);
                      setGeneralComision(generalValue);
                    }}
                    className="border rounded p-2 w-24 text-black"
                  />
                  <button
                    onClick={guardarComisiones}
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Guardar
                  </button>
                </div>
              </div>
              <ul>
                {(vmComisiones || []).map((item:any, index:number) => (
                  <li key={item.id} className="mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-black">{item.nombre}</span>
                      <input
                        type="number"
                        value={item.comision}
                        onChange={(e) =>{
                          const comision = parseInt(e.target.value);
                          const items = [ ...vmComisiones ];
                          items[index].comision = comision
                          setVmComisiones(items);
                          // handleSpecificComisionChange(activeTree, item.id, Number(e.target.value))
                        }}
                        className="border rounded p-2 w-24 text-black"
                      />
                      <button
                        onClick={guardarComisiones}
                        className="bg-black text-white px-4 py-2 rounded"
                      >
                        Guardar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-black">Comisiones Guardadas</h2>
            <p className="mb-4 text-black">Las comisiones se han guardado correctamente.</p>
            <button
              onClick={cerrarModal}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comisiones;

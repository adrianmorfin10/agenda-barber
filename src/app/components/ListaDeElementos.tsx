"use client";

import React, { useImperativeHandle, forwardRef } from 'react';
import { AppContext } from './AppContext';
import ProductoService from '../services/ProductoService';
import ServicioService from '../services/ServicioService';
import VentaService from '../services/VentaService';
const productoObject = new ProductoService();
const servicioObject = new ServicioService();
const ventaObject = new VentaService();
type SectionType = "Venta Rápida" | "Por Cobrar" | "Productos" | "Membresías";

interface Item {
  id: number;
  nombre: string;
  precio: number;
}

interface ListaDeElementosProps {
  section: SectionType;
  onAddToCart: (item: Item) => void;
}

const ListaDeElementos = forwardRef<any, ListaDeElementosProps>( ({ section, onAddToCart }, ref) => {
  const [ items, setItems] = React.useState<Record<SectionType, Item[]>>({
    "Venta Rápida": [],
    "Por Cobrar": [
      // { id: 3, nombre: "Corte de Cabello - Juan", precio: 100 },
      // { id: 4, nombre: "Coloración - María", precio: 150 },
    ],
    "Productos": [
      // { id: 5, nombre: "Producto A", precio: 50 },
      // { id: 6, nombre: "Producto B", precio: 120 },
    ],
    "Membresías": [
      // { id: 7, nombre: "Black", precio: 300 },
      // { id: 8, nombre: "White", precio: 200 },
    ],
  })
 
  const [ state, dispatchState ]= React.useContext(AppContext);

  const getData = async (filter:any) =>{
    const newItems = { ...items };
    //Productos
    const resposonseProducts = await productoObject.getProductos(filter);
    const productos = resposonseProducts.map((item: any)=>{
      const { precio_productos, id, nombre, } = item;
      return { id, nombre, precio: precio_productos.length ? precio_productos[0].precio : 0, type: "producto"   }
    });
    newItems["Productos"] = productos;
    const responseServicio = await servicioObject.getServicios(filter);
    const servicios = responseServicio.map((item: any)=>{
      const { precio_servicios, id, nombre, } = item;
      return { id, nombre, precio: precio_servicios.length ? precio_servicios[0].precio : 0, type: "servicio"   }
    });
    newItems["Venta Rápida"] = servicios;
    const porCobrarResponse = await ventaObject.getCitasPorCobrarByLocal(filter.local_id);
    newItems["Por Cobrar"] = porCobrarResponse.map((item:any)=>{
      const { id, cliente } = item;
      const { precio_servicios } = item.servicio;
      const nombre = `${item.servicio.nombre} - ${cliente.usuario?.nombre} ${cliente.usuario?.apellido_paterno}`;
      return { id, nombre, precio: precio_servicios.length ? precio_servicios[0].precio : 0, type: "reservacion_por_cobrar"   }
    });
    const membresiasPorCobrar = await ventaObject.getMembresiasPorCobrarByLocal(filter.local_id);
    newItems["Membresías"] = membresiasPorCobrar.map((item:any)=>{
      const { id, nombre } = item;
      return { id, nombre, precio:  10, type: "membresia"  };
    });
    setItems(newItems);
  }

  React.useEffect(() => {
    if(state.sucursal)
      getData(state.sucursal ? { local_id: state.sucursal.id } : false).finally(()=>{})
  
  }, [state.sucursal]);

  useImperativeHandle(ref, () => ({
    refreshData: () => {
      getData(state.sucursal ? { local_id: state.sucursal.id } : false).finally(() => {});
    }
  }));

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{section}</h2>
      <ul className="space-y-2">
        {(items[section] || []).map((item) => (
          <li
            key={item.id}
            onClick={() => onAddToCart(item)}
            className="p-3 bg-white rounded cursor-pointer hover:bg-gray-100 flex justify-between shadow"
          >
            <span>{item.nombre}</span>
            <span>${item.precio}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default ListaDeElementos;

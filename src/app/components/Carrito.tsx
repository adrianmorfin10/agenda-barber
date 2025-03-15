"use client";

import React, { useState } from "react";
import ClientesList from "./Clienteslist";
import Image from "next/image";
import Cliente from '../interfaces/cliente';
import { AppContext } from './AppContext';
import ClientService from "../services/ClientService";
import VentaService from "../services/VentaService";
const clientService = new ClientService();
const ventaObject = new VentaService();
import EmpleadoService from "../services/EmpleadoService";
const empleadoServiceObject = new EmpleadoService();
import Modal from './ModalCarrito';
import moment from "moment";
import SurveyModal from "./SurveyModal";

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CarritoProps {
  items: CartItem[],
  onCheckOutSuccess: () => void,
  onLessItem: (index: number) => void
}

const Carrito: React.FC<CarritoProps> = ({ items, onCheckOutSuccess, onLessItem }) => {
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [empleados, setEmpleados] = React.useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | "">("");
  const [state, dispatchState] = React.useContext(AppContext);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  React.useEffect(() => {
    if (!state.sucursal?.id)
      return;

    getClients(state.sucursal ? { local_id: state.sucursal.id } : false).then(data => {
      setClientes(data);
    }).catch(error => {
      console.error("Error al obtener los clientes", error);
    });

    getEmpleados();
  }, [state.sucursal]);

  const getClients = async (filter: any): Promise<any[]> => {
    const clientsData = await clientService.getClients(filter);
    const clients: Cliente[] = clientsData.map((client: any) => ({
      id: client.id,
      nombre: client.usuario.nombre,
      apellido: client.usuario.apellido_paterno + " " + client.usuario.apellido_materno,
      telefono: client.usuario.telefono,
      instagram: client.instagram,
      citas: client.citas || 0,
      inasistencias: client.inasistencias || 0,
      cancelaciones: client.cancelaciones || 0,
      ultimaVisita: client.ultima_visita || "Sin fecha",
      descuento: client.descuento || "Sin descuento",
      ingresosTotales: client.ingresos_totales || "Sin ingresos",
      membresia: client.is_member ? "Activa" : "Inactiva",
      tipo: client.usuario.tipo || "Sin tipo",
      serviciosDisponibles: client.servicios_disponibles || 0,
      proximoPago: client.proximo_pago || "Sin proximo pago",
      cliente_membresia: client.cliente_membresia
    }));
    return clients;
  };

  const getEmpleados = () => {
    empleadoServiceObject.getEmpleados(state.sucursal ? { local_id: state.sucursal.id } : false).then(response => {
      const _empleados = response.map((item: any) => {
        const { reservacions } = item;
        const canceladas = reservacions.filter((item: any) => item.state === "cancel");
        const insistidas = reservacions.filter((item: any) => item.state === "inasistsida");
        return {
          id: item.id,
          nombre: item.usuario.nombre,
          apellido: item.usuario.apellido_paterno,
          telefono: item.usuario.telefono,
          email: item.usuario.email,
          instagram: '',
          citas: reservacions?.length || 0,
          inasistencias: insistidas?.length || 0,
          cancelaciones: canceladas?.length || 0,
          ultimaVisita: reservacions.length ? new Date(reservacions[0].fecha).toLocaleString() : '',
          ingresosTotales: 0,
          tipo: 'Black',
          diasTrabajo: item.working_days || [],
          servicios: item.working_days || [],
          proximoPago: '',
        };
      });
      setEmpleados(_empleados);
    }).catch(error => {
      console.error("Error al obtener los empleados", error);
    });
  };

  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleToggleClientList = () => {
    setIsClientListOpen((prev) => !prev);
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedClient(cliente);
    setIsClientListOpen(false);
  };

  const handleSelectEmployee = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedEmployee(selectedValue === "" ? "" : Number(selectedValue));
  };

  const checkOut = async () => {
    if (!selectedEmployee) {
      setIsEmployeeModalOpen(true);
      return;
    }
    try {
      const checkOutData = { ventas: items.map(item => ({ ...item, fecha: moment().local().toISOString() })), fecha_creacion: moment().local().toISOString(), descuento: discount, client: selectedClient?.id || false, empleado_id: selectedEmployee, local_id: state.sucursal.id };
      await ventaObject.checkout(checkOutData);
      setIsSuccessModalOpen(true);
    } catch (e) {
      console.error("Error durante el checkout", e);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setIsSurveyModalOpen(true);
  };

  const handleSurveyModalClose = (rating: number) => {
    setIsSurveyModalOpen(false);
    onCheckOutSuccess();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        {isClientListOpen && (
          <button
            onClick={() => setIsClientListOpen(false)}
            className="text-gray-500 flex items-center"
          >
            <Image src="/img/back.svg" alt="Volver" width={20} height={20} className="inline mr-2" />
            <span className="text-xl font-semibold">Selección de Cliente</span>
          </button>
        )}
        {!isClientListOpen && <h2 className="text-xl font-semibold"></h2>}
      </div>

      {!isClientListOpen && (
        <>
          <div className="mb-4 px-4">
            <div
              className="border-dashed border border-gray-400 p-4 rounded-lg cursor-pointer"
              onClick={handleToggleClientList}
            >
              <div className="flex items-center justify-between">
                <div className="bg-black text-white rounded-full h-[40px] w-[70px] flex items-center justify-center mr-3">
                  <Image src="/img/userw.svg" alt="Cliente" width={20} height={20} />
                </div>
                <span className="text-gray-500 font-light text-[16px]">
                  {selectedClient
                    ? `${selectedClient.nombre} ${selectedClient.apellido}`
                    : "Seleccione un cliente (opcional)"}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4 px-4">
            <label className="block text-sm font-semibold text-black">Selecciona empleado que generó la venta</label>
            <select
              className="border p-2 w-full rounded-lg text-black"
              value={selectedEmployee}
              onChange={handleSelectEmployee}
            >
              <option value="">Selecciona un empleado</option>
              {empleados.map((emp: any) => (
                <option key={`emp-${emp.id}`} value={emp.id}>
                  {`${emp.nombre} ${emp.apellido}`}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {isClientListOpen ? (
        <ClientesList
          clientes={clientes}
          onSelectCliente={handleSelectCliente}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-2 font-semibold text-gray-700">
            <div>Artículo</div>
            <div className="text-center">Cantidad</div>
            <div className="text-right">Subtotal</div>
          </div>

          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
              >
                <span className="flex-1">{item.nombre}</span>
                <div className=" flex flex-row gap-[10px]">
                  {
                    <button
                      onClick={(e) => onLessItem(index)}
                      className=" text-gray-600 rounded text-sm "
                    >
                      -
                    </button>
                  }
                  <span className="text-right  text-sm font-light text-gray-500">
                    {`x${item.cantidad}`}
                  </span>
                </div>
                <span className="text-right w-20">${(item.precio * item.cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-end mt-4">
            <div className="flex items-center">
              <label htmlFor="discount" className="text-sm font-semibold mr-2">
                Descuento:
              </label>
              <input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                className="border rounded p-1 w-24 text-right"
                placeholder="0"
                min="0"
              />
              <span className="ml-2">MXN</span>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold">Subtotal: ${subtotal.toFixed(2)}</h3>
            <h3 className="text-lg font-semibold">Total: ${(subtotal - discount).toFixed(2)}</h3>
            <button className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800" onClick={checkOut}>
              Proceder a Pago
            </button>
          </div>
        </>
      )}

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="Venta Exitosa"
        message="La venta se ha realizado correctamente."
      />

      <SurveyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
        onConfirm={handleSurveyModalClose}
      />

      <Modal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        title="Empleado Requerido"
        message="Por favor, selecciona un empleado antes de proceder al pago."
      />
    </div>
  );
};

export default Carrito;
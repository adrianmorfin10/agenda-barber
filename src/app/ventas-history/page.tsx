"use client";

import React, { useState, useEffect } from "react";
import SidebarVentas from "../components/SidebarVentas";
import { AppContext } from "../components/AppContext";
import VentaService from "../services/VentaService";
import moment from "moment";
import EmpleadoService from "../services/EmpleadoService";

const ventasObject = new VentaService();
const empleadoObject = new EmpleadoService();

// Define el tipo de las secciones
type SectionType = "Venta Rápida" | "Por Cobrar" | "Productos" | "Membresías" | "Ventas Realizadas";

const getName = (venta: any) => {
  if (venta.venta_producto) return venta.venta_producto.producto.nombre;
  if (venta.venta_membresia) return venta.venta_membresia.membresia.nombre;
  if (venta.venta_servicio) return venta.venta_servicio.servicio.nombre;
  return `cita`;
};

const VentasHistory: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>("Ventas Realizadas");
  const [filterType, setFilterType] = useState<"dia" | "semana" | "mes" | "year">("dia");
  const [sales, setSales] = useState<
    { id: number; hora: string; fecha: string; empleado: string; producto: string; precio: string; cliente: string }[]
  >([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [state, dispatchState] = React.useContext(AppContext);
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: number, nombre: string } | null>(null);
  const [employees, setEmployees] = useState<{ id: number, nombre: string }[]>([]);

  // Obtener la lista de empleados
  useEffect(() => {
    if (!state.sucursal) return;

    empleadoObject
      .getEmpleados({ local_id: state.sucursal.id })
      .then((data: any) => {
        const employeeNames = data.map((employee: any) => ({ id: employee.id, nombre: employee.usuario.nombre }));
        setEmployees(employeeNames);
      })
      .catch((e: any) => {
        console.error("Error al obtener empleados:", e);
      });
  }, [state.sucursal]);

  // Obtener las ventas
  useEffect(() => {
    if (!state.sucursal) return;
    getSales(selectedEmployee?.id || 0); // Pasar 0 si no hay empleado seleccionado
  }, [state.sucursal, filterType, currentDate, selectedEmployee]);

  const getSales = (barbero_id: number) => {
    ventasObject
      .getAll(state.sucursal.id, filterType, moment(currentDate).format("YYYY-MM-DD hh:mm"), barbero_id)
      .then((data: any) => {
        const salesHistory = data.map((item: any) => {
          const ventaDate = moment(item.fecha).local();
          return {
            id: item.id,
            fecha: ventaDate.format("YYYY-MM-DD"),
            hora: ventaDate.format("HH:mm"),
            empleado: item.barbero.usuario.nombre,
            producto: getName(item),
            precio: `$${item.total}`,
            cliente: item.carrito_compra.cliente?.usuario?.nombre || "Cliente no encontrado",
          };
        });

        setSales(salesHistory);
      })
      .catch((e: any) => {
        console.error("Error al obtener ventas:", e);
      });
  };

  const changeDate = (_filterType: string, operation: "add" | "less"): Date => {
    const newDate = moment(currentDate).utcOffset(0, false);
    const value = operation === "add" ? 1 : -1;
    switch (filterType) {
      case "dia":
        newDate.add(value, "day");
        break;
      case "semana":
        newDate.add(value, "week");
        break;
      case "mes":
        newDate.add(value, "month");
        break;
      case "year":
        newDate.add(value, "year");
        break;
    }
    return newDate.toDate();
  };

  const handlePrev = () => {
    setCurrentDate(changeDate(filterType, "less"));
  };

  const handleNext = () => {
    setCurrentDate(changeDate(filterType, "add"));
  };

  const totalVentas = sales.length;
  const totalPrecio = sales.reduce((sum, sale) => sum + parseFloat(sale.precio.replace("$", "")), 0);

  const formatDate = () => {
    if (filterType === "dia") return currentDate.toLocaleDateString();
    if (filterType === "semana") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    }
    if (filterType === "mes") return currentDate.toLocaleDateString("default", { year: "numeric", month: "long" });
    if (filterType === "year") return currentDate.getFullYear();
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <SidebarVentas selectedSection={selectedSection} setSelectedSection={setSelectedSection} />

      {/* Contenido principal */}
      <div className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>

        {/* Filtro */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {["dia", "semana", "mes", "year"].map((type) => (
              <button
                key={type}
                className={`p-2 rounded text-sm font-light ${
                  filterType === type ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
                onClick={() => {
                  setCurrentDate(new Date());
                  setFilterType(type as "dia" | "semana" | "mes" | "year");
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <button className="p-2 bg-black rounded text-white hover:bg-gray-400" onClick={handlePrev}>
              Anterior
            </button>
            <span className="text-xs font-bold text-black">{formatDate()}</span>
            <button className="p-2 bg-black rounded text-white hover:bg-gray-400" onClick={handleNext}>
              Siguiente
            </button>
          </div>

          {/* Selector de empleados */}
          <div className="mb-4">
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700">
              Filtrar por empleado:
            </label>
            <select
              id="employee"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              value={(selectedEmployee?.id || "").toString()}
              onChange={(e) => {
                const _employee = employees.find((item) => item.id.toString() === e.target.value) || null;
                setSelectedEmployee(_employee);
              }}
            >
              <option value="">Todos los empleados</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm font-medium">Total de ventas: {totalVentas}</span>
          <span className="text-sm font-medium">Total: ${totalPrecio.toFixed(2)}</span>
        </div>

        {/* Lista de ventas */}
        <div className="space-y-4">
          {sales.map((sale: any) => (
            <div
              key={`sale-${sale.id}`}
              className="p-4 border rounded bg-gray-50 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{sale.producto}</p>
                <p className="text-xs text-gray-600">
                  {sale.fecha} - {sale.hora} por {sale.empleado} a {sale.cliente}
                </p>
              </div>
              <div className="p-2 flex flex-row items-center gap-2.5">
                <span className="font-bold text-black">{sale.precio}</span>
                {state.user?.rol === "admin" && (
                  <button
                    onClick={() => {
                      if (confirm("¿Está seguro de eliminar esta venta?"))
                        ventasObject
                          .deleteVenta(sale.id)
                          .then(() => getSales(selectedEmployee?.id || 0))
                          .catch(() => alert("Ha ocurrido un error al eliminar la venta"));
                    }}
                    className="border border-red-400 text-red-400 px-4 py-2 rounded text-sm md:text-base"
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>
          ))}
          {sales.length === 0 && <p className="text-gray-500 text-center">No hay ventas para este período.</p>}
        </div>
      </div>
    </div>
  );
};

export default VentasHistory;
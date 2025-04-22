"use client";

import React, { useState, useEffect } from "react";
import SidebarVentas from "../components/SidebarVentas";
import { AppContext } from "../components/AppContext";
import VentaService from "../services/VentaService";
import moment from "moment";
import EmpleadoService from "../services/EmpleadoService";

const ventasObject = new VentaService();
const empleadoObject = new EmpleadoService();

type SectionType = "Venta Rápida" | "Por Cobrar" | "Productos" | "Membresías" | "Ventas Realizadas";
type SortType = "fecha" | "precio" | "tipo" | "none";

const getName = (venta: any) => {
  if (venta.venta_producto) return venta.venta_producto.producto.nombre;
  if (venta.venta_membresia) return venta.venta_membresia.membresia.nombre;
  if (venta.venta_servicio) return venta.venta_servicio.servicio.nombre;
  return `cita`;
};

const getType = (venta: any) => {
  if (venta.venta_producto) return "Producto";
  if (venta.venta_membresia) return "Membresía";
  if (venta.venta_servicio) return "Servicio";
  return "Cita";
};

const VentasHistory: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>("Ventas Realizadas");
  const [filterType, setFilterType] = useState<"dia" | "semana" | "mes" | "year">("dia");
  const [sales, setSales] = useState<any[]>([]);
  const [displayedSales, setDisplayedSales] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [state, dispatchState] = React.useContext(AppContext);
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: number, nombre: string } | null>(null);
  const [employees, setEmployees] = useState<{ id: number, nombre: string }[]>([]);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [sortBy, setSortBy] = useState<SortType>("none");
  const [productStats, setProductStats] = useState<{
    name: string;
    count: number;
    total: number;
    quantityStr: string;
  }[]>([]);

  // Obtener empleados
  useEffect(() => {
    if (!state.sucursal) return;

    empleadoObject.getEmpleados({ local_id: state.sucursal.id })
      .then((data: any) => {
        const employeeNames = data.map((employee: any) => ({ 
          id: employee.id, 
          nombre: employee.usuario.nombre 
        }));
        setEmployees(employeeNames);
      })
      .catch(console.error);
  }, [state.sucursal]);

  // Obtener ventas
  useEffect(() => {
    if (!state.sucursal) return;
    getSales(selectedEmployee?.id || 0);
  }, [state.sucursal, filterType, currentDate, selectedEmployee]);

  // Función para sumar dígitos
  const sumDigits = (str: string): number => {
    return str.split('').reduce((sum, char) => sum + parseInt(char || '0'), 0);
  };

  // Procesar ventas para mostrar
  useEffect(() => {
    // Ordenar
    const processedSales = [...sales].sort((a, b) => {
      if (sortBy === "fecha") {
        return new Date(b.fecha + ' ' + b.hora).getTime() - new Date(a.fecha + ' ' + a.hora).getTime();
      } else if (sortBy === "precio") {
        return parseFloat(b.precio.replace("$", "")) - parseFloat(a.precio.replace("$", ""));
      } else if (sortBy === "tipo") {
        return a.producto.localeCompare(b.producto);
      }
      return 0;
    });
    
    setDisplayedSales(processedSales);
    
    // Calcular estadísticas
    const statsMap = new Map<string, {count: number, total: number, quantityStr: string}>();
    
    sales.forEach(sale => {
      const current = statsMap.get(sale.producto) || {count: 0, total: 0, quantityStr: ""};
      statsMap.set(sale.producto, {
        count: current.count + sale.cantidad,
        total: current.total + parseFloat(sale.precio.replace("$", "")),
        quantityStr: current.quantityStr + sale.cantidad.toString()
      });
    });
    
    // Corregido: Forma correcta de mapear el Map a un array
    const statsArray = Array.from(statsMap.entries()).map(([name, stats]) => ({
      name,
      count: sumDigits(stats.quantityStr),
      total: stats.total,
      quantityStr: stats.quantityStr
    }));
    
    setProductStats(statsArray);
  }, [sales, sortBy]);

  const getSales = (barbero_id: number) => {
    ventasObject.getAll(
      state.sucursal.id, 
      filterType, 
      moment(currentDate).format("YYYY-MM-DD hh:mm"), 
      barbero_id, 
      startDate, 
      endDate
    )
      .then((data: any) => {
        setSales(data.map((item: any) => {
          const ventaDate = moment(item.fecha).local();
          return {
            id: item.id,
            fecha: ventaDate.format("YYYY-MM-DD"),
            hora: ventaDate.format("HH:mm"),
            empleado: item.barbero.usuario.nombre,
            cantidad: item.cantidad,
            producto: getName(item),
            tipo: getType(item),
            precio: `$${item.total}`,
            descuento: item.descuento || 0,
            cliente: item.carrito_compra.cliente?.usuario?.nombre || "Cliente no encontrado",
            rawPrice: item.total,
            rawDate: ventaDate.toDate()
          };
        }));
      })
      .catch(console.error);
  };

  const changeDate = (operation: "add" | "less"): Date => {
    const newDate = moment(currentDate);
    const value = operation === "add" ? 1 : -1;
    
    switch (filterType) {
      case "dia": return newDate.add(value, "days").toDate();
      case "semana": return newDate.add(value, "weeks").toDate();
      case "mes": return newDate.add(value, "months").toDate();
      case "year": return newDate.add(value, "years").toDate();
      default: return newDate.toDate();
    }
  };

  const handlePrev = () => {
    const newDate = changeDate("less");
    if (filterType === "semana") {
      const { startOfWeek, endOfWeek } = getStartAndEndDate(newDate);
      setStartDate(moment(startOfWeek).format("YYYY-MM-DD hh:mm"));
      setEndDate(moment(endOfWeek).format("YYYY-MM-DD hh:mm"));
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = changeDate("add");
    if (filterType === "semana") {
      const { startOfWeek, endOfWeek } = getStartAndEndDate(newDate);
      setStartDate(moment(startOfWeek).format("YYYY-MM-DD hh:mm"));
      setEndDate(moment(endOfWeek).format("YYYY-MM-DD hh:mm"));
    }
    setCurrentDate(newDate);
  };

  const getStartAndEndDate = (date: Date = currentDate) => {
    const start = new Date(date);
    start.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { startOfWeek: start, endOfWeek: end };
  };

  const formatDate = () => {
    switch (filterType) {
      case "dia": return currentDate.toLocaleDateString();
      case "semana":
        const { startOfWeek, endOfWeek } = getStartAndEndDate();
        return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
      case "mes": 
        return currentDate.toLocaleDateString("es-MX", { 
          year: "numeric", 
          month: "long" 
        });
      case "year": return currentDate.getFullYear();
      default: return "";
    }
  };

  const totalVentas = sales.length;
  const totalPrecio = sales.reduce((sum, sale) => sum + parseFloat(sale.precio.replace("$", "")), 0);

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <SidebarVentas 
        selectedSection={selectedSection} 
        setSelectedSection={setSelectedSection} 
      />

      <div className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>

        {/* Filtros */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {["dia", "semana", "mes", "year"].map((type) => (
              <button
                key={type}
                className={`p-2 rounded text-sm font-light ${
                  filterType === type ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (type === "semana") {
                    const { startOfWeek, endOfWeek } = getStartAndEndDate();
                    setStartDate(moment(startOfWeek).format("YYYY-MM-DD hh:mm"));
                    setEndDate(moment(endOfWeek).format("YYYY-MM-DD hh:mm"));
                  }
                  setCurrentDate(new Date());
                  setFilterType(type as any);
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <button 
              className="p-2 bg-black rounded text-white hover:bg-gray-400" 
              onClick={handlePrev}
            >
              Anterior
            </button>
            <span className="text-xs font-bold">{formatDate()}</span>
            <button 
              className="p-2 bg-black rounded text-white hover:bg-gray-400" 
              onClick={handleNext}
            >
              Siguiente
            </button>
          </div>

          {/* Filtros adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filtrar por empleado:
              </label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                value={selectedEmployee?.id || ""}
                onChange={(e) => {
                  const emp = employees.find(em => em.id.toString() === e.target.value);
                  setSelectedEmployee(emp || null);
                }}
              >
                <option value="">Todos los empleados</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ordenar por:
              </label>
              <div className="flex gap-2 mt-1">
                {(["fecha", "precio", "tipo"] as SortType[]).map((type) => (
                  <button
                    key={type}
                    className={`p-2 rounded text-sm ${
                      sortBy === type ? "bg-black text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setSortBy(sortBy === type ? "none" : type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen de ventas */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Resumen por producto/servicio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {productStats.map((stat, index) => (
                <div key={index} className="p-3 border rounded bg-gray-50">
                  <h3 className="font-medium">{stat.name}</h3>
                  <p className="text-sm">Cantidad: {stat.count}</p>
                  <p className="text-sm">Total: ${stat.total.toFixed(2)}</p>
                  
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Totales */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm font-medium">
            Total de ventas: {totalVentas}
          </span>
          <span className="text-sm font-medium">
            Total: ${totalPrecio.toFixed(2)}
          </span>
        </div>

        {/* Lista de ventas */}
        <div className="space-y-4 mt-4">
          {displayedSales.length > 0 ? (
            displayedSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 border rounded bg-gray-50 flex justify-between items-center"
              >
                <div>
                <p className="text-sm font-medium">{sale.producto} <span className="text-xs text-gray-500" >({sale.cantidad})</span></p>
                <p className="text-xs text-gray-600">
                  {sale.fecha} - {sale.hora} por {sale.empleado} a {sale.cliente} con descuento de ${sale.descuento} pesos
                </p>
                <p className="text-xs text-gray-600">
                  ID: {sale.id}
                </p>
              </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{sale.precio}</span>
                  {state.user?.rol === "admin" && (
                    <button
                      onClick={() => {
                        if (confirm("¿Eliminar esta venta?")) {
                          ventasObject.deleteVenta(sale.id)
                            .then(() => getSales(selectedEmployee?.id || 0))
                            .catch(() => alert("Error al eliminar"));
                        }
                      }}
                      className="border border-red-400 text-red-400 px-3 py-1 rounded text-sm"
                    >
                      Borrar
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay ventas para este período
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VentasHistory;
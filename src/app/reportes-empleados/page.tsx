'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale } from 'chart.js';
import RepNavBar from '../components/RepNavBar';
import { AppContext } from '../components/AppContext';
import EmpleadoService from '../services/EmpleadoService';
import ReporteService from '../services/ReporteService';
import TablaFiltrosEmpleados from '../components/FiltroEmpleados';
import moment from 'moment';

const employeeService = new EmpleadoService();
const reporteObject = new ReporteService();

ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale);

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const current_date = moment(new Date()).format("YYYY-MM-DD");
const ReportesEmpleados: React.FC = () => {
  const [state, dispatchState] = React.useContext(AppContext);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [employees, setEmployees] = useState<any[]>([]);
  const [periodo, setPeriodo] = useState('dia');
  const [viewType, setViewType] = useState<'citas' | 'ventas'>('citas'); // Nuevo estado para el tipo de vista
  const [ventaEmpleadoData, setVentaEmpleadoData] = React.useState<{ 
    total_citas: number, 
    total_comision: number, 
    total_ventas: number, 
    membresias_vendidas: number, 
    productos_vendidos: number
  }>({ 
    total_citas: 0, 
    total_comision: 0, 
    total_ventas: 0, 
    membresias_vendidas: 0, 
    productos_vendidos: 0 
  });
  const [employeeData, setEmployeeData] = useState({
    totalCitas: 0,
    citasPorSemana: [0, 0, 0, 0],
    semanas: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
  });

  React.useEffect(() => {
    if (!state.sucursal?.id) return;

    employeeService.getEmpleados({ local_id: state.sucursal?.id }).then((employeesData: any[]) => {
      const _employees = employeesData.map((employee: any) => ({
        id: employee.id,
        nombre: employee.usuario.nombre,
      }));
      setEmployees(_employees);
      if (_employees.length) setSelectedEmployee(_employees[0].id);
    });
  }, [state.sucursal]);

  React.useEffect(() => {
    if (!state.sucursal?.id || !selectedEmployee) return;
    getData(state.sucursal?.id, selectedMonth + 1, selectedEmployee, viewType).finally();
  }, [state.sucursal, selectedMonth, selectedEmployee, periodo, viewType]);

  const getData = async (local_id: any, month: number | null, employee_id: number | null, tipo:string = 'citas') => {
    const data = await reporteObject.reporteEmpleado(local_id, month, employee_id, tipo);
    const dataEmpleado = await reporteObject.reporteVentaEmpleado(local_id, periodo, employee_id, current_date);
    setVentaEmpleadoData(dataEmpleado);
    
    const citasList = [0, 0, 0, 0];
    
    (data.citas || []).forEach((item: any, index: number) => {
      citasList[index] = item.total_citas;
    });
    
    setEmployeeData({ 
      ...employeeData, 
      totalCitas: data.total_citas, 
      citasPorSemana: citasList,
    });
  };

  const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEmployee(parseInt(event.target.value));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const data = {
    labels: employeeData.semanas.map((semana) => `${semana} de ${meses[selectedMonth]}`),
    datasets: [
      {
        label: viewType === 'citas' ? 'Citas Semanales' : 'Ventas Semanales',
        data: employeeData.citasPorSemana,
        backgroundColor: 'rgb(0, 0, 0)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${viewType === 'citas' ? 'Citas' : 'Ventas'} por Empleado - ${meses[selectedMonth]}`,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(169, 169, 169)',
        },
      },
      y: {
        ticks: {
          color: 'rgb(169, 169, 169)',
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white h-full">
      <RepNavBar />

      <div className="p-4">
        <h1 className="text-xl font-bold mb-4 text-black">Reporte de Empleados</h1>

        <div className="flex flex-wrap gap-4 mb-4">
          {/* Selector de empleado */}
          <div>
            <label htmlFor="employeeSelector" className="block text-black font-medium mb-2">
              Selecciona un empleado:
            </label>
            <select
              id="employeeSelector"
              value={selectedEmployee || ''}
              onChange={handleEmployeeChange}
              className="border border-gray-300 p-2 rounded text-black"
            >
              {employees.map((item: any) => (
                <option value={item.id} key={`empleado-${item.id}`}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de mes */}
          <div>
            <label htmlFor="monthSelector" className="block text-black font-medium mb-2">
              Selecciona un mes:
            </label>
            <select
              id="monthSelector"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 p-2 rounded text-black"
            >
              {meses.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Switch Citas/Ventas */}
          <div className="flex items-end">
            <div className="flex items-center mt-2">
              <span 
                className={`px-4 py-2 rounded-l-lg cursor-pointer ${viewType === 'citas' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => setViewType('citas')}
              >
                Citas
              </span>
              <span 
                className={`px-4 py-2 rounded-r-lg cursor-pointer ${viewType === 'ventas' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => setViewType('ventas')}
              >
                Ventas
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {/* Gráfico */}
          <div className="flex-1 max-h-[400px] w-full">
            <Bar data={data} options={options} />
          </div>

          {/* Tabla con filtros */}
          <div className="flex-1 max-w-[400px]">
            <TablaFiltrosEmpleados
              data={ventaEmpleadoData}
              onChangePeriodo={(periodo, selectedDate, startDate, endDate) => {
                if (!state.sucursal?.id || !selectedEmployee) return;
                
                reporteObject.reporteVentaEmpleado(
                  state.sucursal?.id, 
                  periodo, 
                  selectedEmployee, 
                  moment(selectedDate).format("YYYY-MM-DD hh:mm"), 
                  startDate, 
                  endDate
                ).then((reportData) => {
                  setVentaEmpleadoData(reportData);
                }).catch(() => alert('Error al tratar de obtener los datos'));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesEmpleados;
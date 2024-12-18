// src/app/reportes-empleados/page.tsx

'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale } from 'chart.js';
import RepNavBar from '../components/RepNavBar'; // Importamos el componente RepNavBar
import { AppContext } from '../components/AppContext';
import EmpleadoService from '../services/EmpleadoService';
import ReporteService from '../services/ReporteService';
const employeeService = new EmpleadoService();
const reporteObject = new ReporteService();

ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale);
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const ReportesEmpleados: React.FC = () => {
  const [state, dispatchState] = React.useContext(AppContext);
  const [selectedEmployee, setSelectedEmployee] = useState<number | ''>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // Mes actual por defecto
  const [employees, setEmployees ] = useState<any[]>([]);
  const [employeeData, setEmployeeData] = useState({
    totalCitas: 0,
    citasPorSemana: [0, 0, 0, 0 ], // Datos de ejemplo para las citas semanales
    semanas: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'], // Nombre de las semanas
  });
  React.useEffect(()=>{

    if(!state.sucursal?.id)
      return;
    
    employeeService.getEmpleados({ local_id: state.sucursal?.id}).then((employeesData:any[])=>{
      const _employees = employeesData.map((employee: any) => ({
        id: employee.id,
        nombre: employee.usuario.nombre
      }));
      console.log("setEmployees", _employees)
      setEmployees(_employees);
      if(_employees.length)
        setSelectedEmployee(_employees[0].id)
    });
    
  }, [state.sucursal]);

  React.useEffect(()=>{
    if(!state.sucursal?.id || !selectedEmployee)
      return;
    getData(state.sucursal?.id, selectedMonth + 1, selectedEmployee).finally();
  }, [state.sucursal, selectedMonth, selectedEmployee ]);

  const getData = async (local_id: any, month:number | null, employee_id: number | null) =>{
    const data = await reporteObject.reporteEmpleado(local_id, month, employee_id);
    
    const dataList = [0, 0, 0, 0 ];
    data.citas.forEach((item:any, index:number)=>{
      dataList[index] = item.total_citas
    })
    setEmployeeData({ ...employeeData, totalCitas: data.total_citas, citasPorSemana: dataList })
  }

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
        label: 'Citas Semanales',
        data: employeeData.citasPorSemana,
        backgroundColor: 'rgb(0, 0, 0)', // Color completamente negro
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
        text: `Citas por Empleado - ${meses[selectedMonth]}`,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(169, 169, 169)', // Escala de grises para las etiquetas de las semanas
        },
      },
      y: {
        ticks: {
          color: 'rgb(169, 169, 169)', // Escala de grises para las etiquetas del eje Y
        },
      },
    },
  };
  console.log("employees", employees)
  return (
    <div className="p-4 bg-white h-full">
      <RepNavBar /> {/* Barra de navegación fuera del contenedor */}

      <div className="p-4" style={{ padding: '1rem' }}> {/* Padding de 1rem */}
        <h1 className="text-xl font-bold mb-4 text-black">Reporte de Empleados</h1>

        {/* Selectores de empleado y mes en línea */}
        <div className="flex space-x-4 mb-4">
          {/* Selector de empleado */}
          <div>
            <label htmlFor="employeeSelector" className="block text-black font-medium mb-2">
              Selecciona un empleado:
            </label>
            <select
              id="employeeSelector"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className="border border-gray-300 p-2 rounded"
            >
              {
                employees.map((item:any)=>(<option value={item.id} key={`empleado-${item.id}`}>{ item.nombre }</option>))
              }
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
              className="border border-gray-300 p-2 rounded"
            >
              {meses.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gráfico de citas semanales */}
        <div className="mt-5 max-h-[400px] w-full h-full">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ReportesEmpleados;
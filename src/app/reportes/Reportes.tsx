'use client';

import React from 'react';
import DateSelector from './DateSelector';
import { Doughnut } from 'react-chartjs-2';
import Image from 'next/image';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  registerables,
} from 'chart.js';
import { AppContext } from '../components/AppContext';
import ReporteService from '../services/ReporteService';
const reporteObject = new ReporteService();
ChartJS.register(ArcElement, Tooltip, Legend, Title, ...registerables);

interface ReportesProps {
  onDateChange: (date: Date) => void;
}

interface ReportGeneralData {
  ingresosTotales: number;
  serviciosIngresos: number;
  productosIngresos: number;
  membresiasIngresos: number; 
  totalCitas: number;
}

const Reportess: React.FC<ReportesProps> = ({ onDateChange }) => {
  const [state, dispatchState] = React.useContext(AppContext);
  const [ date, setDate ] = React.useState<Date | null>(null)
  const [ reportGeneralData, setReportGeneralData ] = React.useState<ReportGeneralData>({
    ingresosTotales: 0,
    serviciosIngresos: 0, 
    productosIngresos: 0,
    membresiasIngresos: 0,
    totalCitas: 0
  })
  
  React.useEffect(()=>{
    if(!state.sucursal?.id)
      return;
    const month = date instanceof Date ? date.getMonth() + 1 : null;
    const year = date instanceof Date ? date.getFullYear() : null;
    getGeneralData(state.sucursal.id, month, year ).finally();
  }, [state.sucursal, date]);



  const getGeneralData = async (local_id:number, month:number | null, year:number | null)=>{
    const data = await reporteObject.reporteGeneral(local_id, month, year);
    const { ventas } =  data;
    const _reportGeneralData: ReportGeneralData = {
      totalCitas: data.total_citas,
      serviciosIngresos: (ventas || []).filter((item:any)=>item.venta_servicio || item.venta_reservacion).reduce((sum:number, item:any) => sum + Number(item.total) , 0),
      productosIngresos: (ventas || []).filter((item:any)=>item.venta_producto).reduce((sum:number, item:any) => sum + Number(item.total) , 0),
      membresiasIngresos: (ventas || []).filter((item:any)=>item.venta_membresia).reduce((sum:number, item:any) => sum + Number(item.total), 0),
      ingresosTotales: (ventas || []).reduce((sum:number, item:any) => sum + Number(item.total), 0)
    }
    setReportGeneralData(_reportGeneralData);
  }

  const handleDateChange = (date: Date) => {
    console.log('Fecha seleccionada en Reportess:', date);
    setDate(date);
    onDateChange(date);
  };

  const data = {
    labels: ['Servicios', 'Productos', 'Membresías'],
    datasets: [
      {
        data: [reportGeneralData.serviciosIngresos, reportGeneralData.productosIngresos, reportGeneralData.membresiasIngresos],
        backgroundColor: ['#FFC107', '#28A745', '#007BFF'],
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
        text: 'Ingresos por Tipo',
      },
    },
  };

  return (
    <div className="flex flex-col h-full p-5 bg-white">
      <div className="flex items-center mb-4">
        <h1 className="font-bold text-2xl mr-4 text-black">Estadísticas e Informes</h1>
        <DateSelector onDateChange={handleDateChange} />
      </div>
      <hr className="border-t border-gray-300" />

      <div className="flex flex-col lg:flex-row flex-grow">
        <div className="flex-1 bg-white p-4 border-r border-[#CACACA]">
          <h2 className="font-semibold text-lg mb-3 text-black">Ingresos</h2>
          
          <div className="flex justify-between mb-3 border border-[#CACACA] p-4 rounded">
            <div className="w-full">
              <h3 className="font-medium text-black">Ingresos Totales:</h3>
              <p className="text-black">${reportGeneralData.ingresosTotales}</p>
            </div>
            <div className="w-full">
              <h3 className="font-medium text-black">Total de Citas:</h3>
              <p className="text-black">{reportGeneralData.totalCitas}</p>
            </div>
          </div>

          <div className="flex flex-row items-center">
            <div className="my-4 max-w-[270px]">
              <Doughnut data={data} options={options} />
            </div>

            <div className="ml-4 flex flex-col">
              <div className="flex items-center mb-1 text-black">
                <span className="inline-block w-3 h-3 bg-yellow-500 mr-2"></span>
                <span>Servicios</span>
              </div>
              <div className="flex items-center mb-1 text-black">
                <span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>
                <span>Productos</span>
              </div>
              <div className="flex items-center mb-1 text-black">
                <span className="inline-block w-3 h-3 bg-blue-500 mr-2"></span>
                <span>Membresías</span>
              </div>
            </div>
          </div>

          <table className="mt-5 text-black w-full">
            <thead>
              <tr className="border-t border-[#CACACA]">
                <th className="text-left p-2">Tipo de Ingreso</th>
                <th className="text-center p-2">Precio</th>
                <th className="text-center p-2">Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#CACACA]">
                <td className="flex items-center p-2">
                  <span className="inline-block w-2 h-6 bg-yellow-500 mr-2"></span>
                  Servicios
                </td>
                <td className="text-center p-2">${reportGeneralData.serviciosIngresos}</td>
                <td className="text-center p-2">{((reportGeneralData.serviciosIngresos / reportGeneralData.ingresosTotales) * 100).toFixed(2)}%</td>
              </tr>
              <tr className="border-t border-[#CACACA]">
                <td className="flex items-center p-2">
                  <span className="inline-block w-2 h-6 bg-green-500 mr-2"></span>
                  Productos
                </td>
                <td className="text-center p-2">${reportGeneralData.productosIngresos}</td>
                <td className="text-center p-2">{((reportGeneralData.productosIngresos / reportGeneralData.ingresosTotales) * 100).toFixed(2)}%</td>
              </tr>
              <tr className="border-t border-[#CACACA]">
                <td className="flex items-center p-2">
                  <span className="inline-block w-2 h-6 bg-blue-500 mr-2"></span>
                  Membresías
                </td>
                <td className="text-center p-2">${reportGeneralData.membresiasIngresos}</td>
                <td className="text-center p-2">{((reportGeneralData.membresiasIngresos / reportGeneralData.ingresosTotales) * 100).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Componente de la derecha (comentado) */}
        {/* 
        <div className="bg-white p-4 max-w-[320px] w-full lg:ml-4 border border-[#CACACA] rounded mt-5">
          <div className="flex justify-between mb-4">
            <div className="flex flex-col w-full">
              <p className="font-light text-gray-500 text-[0.75rem]">Citas</p>
              <p className="font-bold text-black">50</p>
            </div>
            <div className="flex flex-col w-full">
              <p className="font-light text-gray-500 text-[0.75rem]">Tiempo Reservado</p>
              <p className="font-bold text-black">20 horas</p>
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <div className="flex justify-between mb-4">
              <div className="flex flex-col w-full">
                <p className="font-light text-gray-500 text-[0.75rem]">Confirmadas</p>
                <p className="font-bold text-black">30</p>
              </div>
              <div className="flex flex-col w-full">
                <p className="font-light text-gray-500 text-[0.75rem]">Finalizadas</p>
                <p className="font-bold text-black">25</p>
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex flex-col w-full">
                <p className="font-light text-gray-500 text-[0.75rem]">Inasistencias</p>
                <p className="font-bold text-black">5</p>
              </div>
              <div className="flex flex-col w-full">
                <p className="font-light text-gray-500 text-[0.75rem]">Canceladas</p>
                <p className="font-bold text-black">2</p>
              </div>
            </div>
          </div>

          <h2 className="font-semibold text-lg mb-3 text-black">Informes</h2>
          <div className="border-t border-[#CACACA] pt-2">
            <div className="flex justify-between items-center mb-2 p-2 hover:bg-gray-200 cursor-pointer">
              <p className="font-light text-black">Resumen de Ventas</p>
              <Image src="/img/chevron.svg" alt="Chevron" width={24} height={24} />
            </div>
            <div className="flex justify-between items-center mb-2 p-2 hover:bg-gray-200 cursor-pointer">
              <p className="font-light text-black">Ventas por Producto</p>
              <Image src="/img/chevron.svg" alt="Chevron" width={24} height={24} />
            </div>
            <div className="flex justify-between items-center mb-2 p-2 hover:bg-gray-200 cursor-pointer">
              <p className="font-light text-black">Ventas por Servicio</p>
              <Image src="/img/chevron.svg" alt="Chevron" width={24} height={24} />
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default Reportess;

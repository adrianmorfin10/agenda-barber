'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale } from 'chart.js';
import RepNavBar from '../components/RepNavBar'; // Importamos el componente RepNavBar
import { AppContext } from '../components/AppContext';
import ReporteService from '../services/ReporteService';
import ClientService from '../services/ClientService';
const clientService = new ClientService();
const reporteObject = new ReporteService();
ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale);

const ReportesClientes: React.FC = () => {
  const [state, dispatchState] = React.useContext(AppContext);
  const [selectedClient, setSelectedClient] = useState<number | ''>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [clients, setClients ] = useState<any[]>([]);
  const [clientData, setClientData] = useState({
    totalCitas: 50,
    citasPorMes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Datos de ejemplo para las citas mensuales
  });

  React.useEffect(()=>{
    if(!state.sucursal?.id)
      return;
    clientService.getClients({ local_id: state.sucursal?.id}).then((clientsData:any[])=>{
      const _clients = clientsData.map((client: any) => ({
        id: client.id,
        nombre: client.usuario.nombre
      }));
      setClients(_clients);
      if(_clients.length)
        setSelectedClient(_clients[0].id)
    });
    
  }, [state.sucursal ]);
  
  React.useEffect(()=>{
    if(!state.sucursal?.id || !selectedClient)
      return;
    getData(state.sucursal?.id, selectedMonth + 1, selectedYear, selectedClient).finally();
  }, [state.sucursal, selectedMonth, selectedYear, selectedClient ]);

  const getData = async (local_id: any, month:number | null, year:number | null, client_id: number | null) =>{
    const data = await reporteObject.reporteCliente(local_id, month, year, client_id);
    
    const dataList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    data.citas.forEach((item:any)=>{
      const month = parseInt(item.month);
      dataList[month - 1] = item.total_citas
    })
    setClientData({ totalCitas: data.total_citas, citasPorMes: dataList })
  }

  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(parseInt(event.target.value));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
    datasets: [
      {
        label: 'Citas Mensuales',
        data: clientData.citasPorMes,
        backgroundColor: 'rgb(0, 0, 0)', // Color negro sólido
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
        text: `Citas por Cliente - ${selectedYear} ${['Enero', 'Febrero', 'Marzo', 'Abril'][selectedMonth]}`,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(169, 169, 169)', // Escala de grises para las etiquetas de los meses
        },
      },
      y: {
        ticks: {
          color: 'rgb(169, 169, 169)', // Escala de grises para las etiquetas del eje Y
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white h-full">
      <RepNavBar /> {/* Barra de navegación fuera del contenedor */}

      <div className="p-4" style={{ padding: '1rem' }}> {/* Padding de 1rem */}
        <h1 className="text-xl font-bold mb-4 text-black">Reporte de Clientes</h1>

        {/* Selectores de cliente, mes y año en línea */}
        <div className="flex space-x-4 mb-4">
          {/* Selector de cliente */}
          <div>
            <label htmlFor="clientSelector" className="block text-black font-medium mb-2">
              Selecciona un cliente:
            </label>
            <select
              id="clientSelector"
              value={selectedClient}
              onChange={handleClientChange}
              className="border border-gray-300 p-2 rounded text-black"
            >
              {
                clients.map((item:any)=><option value={`${item.id}`} key={`cliente-${item.id}`}>{item.nombre}</option>)
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
              className="border border-gray-300 p-2 rounded text-black"
            >
              {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de año */}
          <div>
            <label htmlFor="yearSelector" className="block text-black font-medium mb-2">
              Selecciona un año:
            </label>
            <select
              id="yearSelector"
              value={selectedYear}
              onChange={handleYearChange}
             className="border border-gray-300 p-2 rounded text-black"
            >
              {[2024, 2023, 2022, 2021].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gráfico de citas mensuales */}
        <div className="mt-5 max-h-[400px] w-full h-full">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ReportesClientes;

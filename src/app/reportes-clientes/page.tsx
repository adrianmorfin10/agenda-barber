'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale } from 'chart.js';
import RepNavBar from '../components/RepNavBar';
import { AppContext } from '../components/AppContext';
import ReporteService from '../services/ReporteService';
import ClientService from '../services/ClientService';
import ClienteFrecuente from '../components/ClienteFrecuente';

const clientService = new ClientService();
const reporteObject = new ReporteService();
ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale);

const ReportesClientes: React.FC = () => {
  const [state, dispatchState] = React.useContext(AppContext);
  const [selectedClient, setSelectedClient] = useState<number | ''>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [clients, setClients] = useState<any[]>([]);
  const [viewType, setViewType] = useState<'citas' | 'ventas'>('citas');
  const [clientData, setClientData] = useState({
    citasPorMes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ventasPorMes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

  React.useEffect(() => {
    if (!state.sucursal?.id)
      return;
    clientService.getClients({ local_id: state.sucursal?.id }).then((clientsData: any[]) => {
      const _clients = clientsData.map((client: any) => ({
        id: client.id,
        nombre: client.usuario.nombre
      }));
      setClients(_clients);
      if (_clients.length)
        setSelectedClient(_clients[0].id)
    });

  }, [state.sucursal]);

  React.useEffect(() => {
    if (!state.sucursal?.id || !selectedClient)
      return;
    getData(state.sucursal?.id, selectedYear, selectedClient).finally();
  }, [state.sucursal, selectedYear, selectedClient]);

  const getData = async (local_id: any, year: number | null, client_id: number | null) => {
    const data = await reporteObject.reporteCliente(local_id, null, year, client_id);

    const citasDataList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const ventasDataList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    data.citas.forEach((item: any) => {
      const month = parseInt(item.month);
      citasDataList[month - 1] = item.total_citas;
    });

    (data.ventas || []).forEach((item: any) => {
      const month = parseInt(item.month);
      ventasDataList[month - 1] = item.total_ventas;
    });

    setClientData({ 
      citasPorMes: citasDataList,
      ventasPorMes: ventasDataList,
    });
  }

  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(parseInt(event.target.value));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: viewType === 'citas' ? 'Citas Mensuales' : 'Ventas Mensuales',
        data: viewType === 'citas' ? clientData.citasPorMes : clientData.ventasPorMes,
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
        text: `${viewType === 'citas' ? 'Citas' : 'Ventas'} por Cliente - Año ${selectedYear}`,
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
    <div className="p-4 bg-white h-full overflow-scroll">
      <RepNavBar />

      <div className="p-4" style={{ padding: '1rem' }}>
        <h1 className="text-xl font-bold mb-4 text-black">Reporte de Clientes</h1>

        {/* Selectores de cliente, año y switch en línea */}
        <div className="flex flex-wrap gap-4 mb-4">
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
                clients.map((item: any) => <option value={`${item.id}`} key={`cliente-${item.id}`}>{item.nombre}</option>)
              }
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
              {[2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021].map((year) => (
                <option key={year} value={year}>
                  {year}
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

        {/* Gráfico */}
        <div className="mt-5 max-h-[400px] w-full h-full">
          <Bar data={data} options={options} />
        </div>
        
      
      </div>
    </div>
  );
};

export default ReportesClientes;
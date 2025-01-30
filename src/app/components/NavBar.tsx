"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SucursalModal from '../components/SucursalModal';
import LocalService from '../services/LocalService';
import { useAppContext } from './AppContext';
const localServiceObject = new LocalService();

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  encargado: string;
}
 const navItemsByRol:any = {
  'admin':[
    { path: '/citas', label: 'Citas', icon: '/img/calendar.svg', inactiveIcon: '/img/calendar-inactive.svg' },
    { path: '/ventas', label: 'Ventas', icon: '/img/bill.svg', inactiveIcon: '/img/bill-inactive.svg' },
    { path: '/clientes', label: 'Clientes', icon: '/img/user.svg', inactiveIcon: '/img/user-inactive.svg' },
    { path: '/productos', label: 'Productos', icon: '/img/product.svg', inactiveIcon: '/img/product-inactive.svg' },
    { path: '/reportes', label: 'Reportes', icon: '/img/report.svg', inactiveIcon: '/img/report-inactive.svg' },
    { path: '/empleados', label: 'Empleados', icon: '/img/emp.svg', inactiveIcon: '/img/emp-inactive.svg' },
  ], 
  'encargado':[
    { path: '/citas', label: 'Citas', icon: '/img/calendar.svg', inactiveIcon: '/img/calendar-inactive.svg' },
    { path: '/ventas', label: 'Ventas', icon: '/img/bill.svg', inactiveIcon: '/img/bill-inactive.svg' },
    { path: '/clientes', label: 'Clientes', icon: '/img/user.svg', inactiveIcon: '/img/user-inactive.svg' },
    { path: '/productos', label: 'Productos', icon: '/img/product.svg', inactiveIcon: '/img/product-inactive.svg' },
    { path: '/empleados', label: 'Empleados', icon: '/img/emp.svg', inactiveIcon: '/img/emp-inactive.svg' },
  ],
  'cliente':[
    { path: '/citas', label: 'Citas', icon: '/img/calendar.svg', inactiveIcon: '/img/calendar-inactive.svg' },
  ]
 }
const NavBar: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | any>(null);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [appState, dispatchState] = useAppContext();

  const handleSucursalSelect = (sucursal: Sucursal) => {
    const promises = [
      localServiceObject.updateLocal({ ...sucursal, seleccionado: true }, sucursal.id),
      localServiceObject.updateLocal({ ...sucursalSeleccionada, seleccionado: false }, sucursalSeleccionada.id)
    ];

    Promise.all(promises)
      .then(() => {
        setSucursalSeleccionada(sucursal);
        setIsModalOpen(false);
        dispatchState({ key: "sucursal", value: sucursal });
      })
      .catch((e) => {
        console.error("Error updating selected branch:", e);
      });
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  const handleAddSucursal = (nuevaSucursal: Sucursal) => {
    setSucursales([...sucursales, nuevaSucursal]);
    localServiceObject.getLocales()
      .then((locales) => {
        setSucursales(locales);
      })
      .catch((e) => {
        console.error("Error fetching branches:", e);
      });
    setIsModalOpen(false);
  };
  

  React.useEffect(() => {
    setLoading(true);
    localServiceObject.getLocales()
      .then((locales) => {
        let selected = null; 
        if(appState.user.rol === "admin"){
          selected = locales.find((local: any) => local.seleccionado);
          if(!selected && locales.length)
            selected = locales[0];
        }else if(appState.user.rol === "encargado"){
          selected = locales.find((local: any) => local.id === appState.user.barberos[0].local_id);
        }else{
          selected = locales.find((local: any) => local.id === appState.user.clientes[0].local_id);
        }
        
        setSucursales(locales);
        setSucursalSeleccionada(selected);
        dispatchState({ key: "sucursal", value: selected });
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching branches on load:", e);
      });
  }, []);
  
  const navItems = navItemsByRol[appState.user.rol];

  return (
    <div>
      {/* Desktop NavBar */}
      <div className="bg-[#0C0C0C] md:w-50 h-screen hidden md:flex flex-col p-5 sticky top-0">
        <div className="flex justify-center mb-5">
          <Image src="/img/logobarber.png" alt="Logo" width={130} height={40} />
        </div>
        <hr className="border-t border-[#1D1D1D] my-1" />
        {
          appState.user?.auth0_user_data &&
          <>
            <div className="flex items-center justify-between text-[#7C7C7C] cursor-pointer " >
              <div className="flex items-center  cursor-pointer "
               onClick={() => {
                // Redirige a la página de perfil
                window.location.href = "/perfil";
              }} >
                
                <div className="bg-[#1c1c1c] rounded-full p-2 mr-2">
                  <img className="rounded-full" src={appState.user.auth0_user_data.picture} alt="User picture" width={30} height={30} />
                </div>
                
                <span>{appState.user.auth0_user_data.nickname}</span>
              </div>
              
              <span onClick={handleLogout} >Salir</span>
              
            </div>
            <hr className="border-t border-[#1D1D1D] my-1" />
          </>
        }
        
        <div className="flex flex-col space-y-4">
          {navItems.map((item:any) => (
            <Link key={item.path} href={item.path} className={`flex items-center space-x-2 p-2 transition hover:bg-[#1D1D1D] rounded-md ${pathname === item.path ? 'text-white' : 'text-[#7C7C7C]'}`}>
              <Image 
                src={pathname === item.path ? item.icon : item.inactiveIcon} 
                alt={item.label} 
                width={20} 
                height={20} 
              />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-auto flex items-center text-white cursor-pointer" onClick={() =>{ if(appState.user.rol === "admin") setIsModalOpen(true); }}>
          <div className="bg-[#1c1c1c] rounded-full p-2 mr-2">
            <Image src="/img/local.svg" alt="Sucursal" width={20} height={20} />
          </div>
          {
            !loading && sucursalSeleccionada?
            <span>{sucursalSeleccionada?.nombre || 'Seleccione la sucursal'}</span> :
            <span>{'Cargando ...'}</span>
          }
        </div>
      </div>

      {/* Mobile NavBar */}
      <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-[#0C0C0C] z-50">

        
        <button onClick={() =>{ setMenuOpen(!menuOpen) }}>
          <Image src={menuOpen ? '/img/close.svg' : '/img/menu.svg'} alt="Menu" width={30} height={30} />
        </button>
        <Image src="/img/logo-responsive.png" alt="Logo" width={30} height={30} />
        <div className="flex items-center cursor-pointer" onClick={() => { if(appState.user.rol === "admin") setIsModalOpen(true)}}>
          <div className="bg-[#1c1c1c] rounded-full p-2">
            <Image src="/img/local.svg" alt="Sucursal" width={20} height={20} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
<div className={`md:hidden fixed inset-0 bg-[#0C0C0C] z-40 transition-transform transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
  
  <div className="p-5 mt-16"> {/* Added margin-top to ensure full visibility */}
  {
    appState.user?.auth0_user_data &&
    <>
      <div className="flex items-center justify-between text-[#7C7C7C] cursor-pointer " >
        <div className="flex items-center  cursor-pointer "
          onClick={() => {
          // Redirige a la página de perfil
          window.location.href = "/perfil";
        }} >
          
          <div className="bg-[#1c1c1c] rounded-full p-2 mr-2">
            <img className="rounded-full" src={appState.user.auth0_user_data.picture} alt="User picture" width={30} height={30} />
          </div>
          
          <span>{appState.user.auth0_user_data.name}</span>
        </div>
        
        <span onClick={handleLogout} >Salir</span>
        
      </div>
      <hr className="border-t border-[#1D1D1D] my-1" />
    </>
  }
    {navItems.map((item:any) => (
      <Link 
        key={item.path} 
        href={item.path} 
        className={`flex items-center space-x-4 p-3 transition hover:bg-[#1D1D1D] rounded-md ${pathname === item.path ? 'text-white' : 'text-[#7C7C7C]'}`} 
        onClick={() => setMenuOpen(false)}
      >
        <Image 
          src={pathname === item.path ? item.icon : item.inactiveIcon} 
          alt={item.label} 
          width={24} // Increased icon size
          height={24} // Increased icon size
        />
        <span className="text-lg">{item.label}</span> {/* Increased font size */}
      </Link>
    ))}
  </div>
</div>

      {/* Modal de Selección de Sucursal */}
      {isModalOpen && (
        <SucursalModal
          sucursalSeleccionada={sucursalSeleccionada}
          sucursales={sucursales}
          onSelect={handleSucursalSelect}
          onAddSucursal={handleAddSucursal}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default NavBar;

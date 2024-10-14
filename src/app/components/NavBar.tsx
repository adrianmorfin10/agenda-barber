"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';


const NavBar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/home', label: 'Citas', icon: '/img/calendar.svg', inactiveIcon: '/img/calendar-inactive.svg' },
    { path: '/ventas', label: 'Ventas', icon: '/img/bill.svg', inactiveIcon: '/img/bill-inactive.svg' },
    { path: '/clientes', label: 'Clientes', icon: '/img/user.svg', inactiveIcon: '/img/user-inactive.svg' },
    { path: '/productos', label: 'Productos', icon: '/img/product.svg', inactiveIcon: '/img/product-inactive.svg' },
    { path: '/reportes', label: 'Reportes', icon: '/img/report.svg', inactiveIcon: '/img/report-inactive.svg' },
    { path: '/empleados', label: 'Empleados', icon: '/img/emp.svg', inactiveIcon: '/img/emp-inactive.svg' },
  ];

  return (
    <div>
      {/* Desktop NavBar */}
      <div className="bg-[#0C0C0C] md:w-60 h-screen hidden md:flex flex-col p-5">
        <div className="flex justify-center mb-5">
          <Image src="/img/logobarber.png" alt="Logo" width={150} height={80} />
        </div>
        <hr className="border-t border-[#1D1D1D] my-5" />
        <div className="flex flex-col space-y-4">
          {navItems.map(item => (
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
        <div className="mt-auto flex items-center text-white">
          <div className="bg-[#1c1c1c] rounded-full p-2 mr-2">
            <Image src="/img/local.svg" alt="Sucursal" width={20} height={20} />
          </div>
          <span>Tu Sucursal</span>
        </div>
      </div>

      {/* Mobile NavBar */}
      <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-[#0C0C0C] z-50">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <Image src={menuOpen ? '/img/close.svg' : '/img/menu.svg'} alt="Menu" width={30} height={30} />
        </button>
        <Image src="/img/logo-responsive.png" alt="Logo" width={30} height={30} />
        <div className="flex items-center">
          <div className="bg-[#1c1c1c] rounded-full p-2">
            <Image src="/img/local.svg" alt="Sucursal" width={20} height={20} />
          </div>
        </div>
      </div>

      {/* Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-[#0C0C0C] flex flex-col p-4 z-40">
          <div className="flex flex-col space-y-4 mt-16">
            {navItems.map(item => (
              <Link key={item.path} href={item.path} className={`flex items-center space-x-2 p-2 transition hover:bg-[#1D1D1D] rounded-md text-white ${pathname === item.path ? 'font-bold' : 'text-[#7C7C7C]'}`} onClick={() => setMenuOpen(false)}>
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
        </div>
      )}

      {/* Contenido Principal */}
      <div className={`mt-16 md:mt-0 ${menuOpen ? 'hidden' : 'block'} z-30`}>
       
      </div>
    </div>
  );
};

export default NavBar;

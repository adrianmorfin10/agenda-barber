"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MobileNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/home', label: 'Citas', icon: '/img/calendar.svg' },
    { path: '/ventas', label: 'Ventas', icon: '/img/bill.svg' },
    { path: '/clientes', label: 'Clies', icon: '/img/user.svg' },
    { path: '/productos', label: 'Productos', icon: '/img/product.svg' },
    { path: '/reportes', label: 'Reportes', icon: '/img/report.svg' },
    { path: '/empleados', label: 'Empleados', icon: '/img/emp.svg' },
  ];

  return (
    <div className="md:hidden bg-[#0C0C0C] fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-50">
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <Image src={isMenuOpen ? "/img/close.svg" : "/img/menu.svg"} alt="Menu" width={30} height={30} />
      </button>
      <Image src="/img/logo-responsive.png" alt="Logo" width={30} height={30} />
      <span className="text-white">Tu Sucursal</span>

      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[#0C0C0C] flex flex-col items-center space-y-4 p-4">
          {navItems.map(item => (
            <Link key={item.path} href={item.path} className="flex items-center space-x-2">
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              <span className="text-white">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileNavBar;

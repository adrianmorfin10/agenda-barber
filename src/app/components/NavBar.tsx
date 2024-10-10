// src/components/NavBar.tsx
"use client"; // Agrega esta línea al principio

import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const NavBar = () => {
  const pathname = usePathname(); // Obtiene la ruta actual

  // Define las rutas y sus respectivos íconos
  const navItems = [
    { path: '/home', label: 'Citas', icon: '/img/calendar.svg' },
    { path: '/ventas', label: 'Ventas', icon: '/img/bill.svg' },
    { path: '/clientes', label: 'Clientes', icon: '/img/user.svg' },
    { path: '/productos', label: 'Productos', icon: '/img/product.svg' },
    { path: '/reportes', label: 'Reportes', icon: '/img/report.svg' },
    { path: '/empleados', label: 'Empleados', icon: '/img/emp.svg' },
  ];

  return (
    <div className="bg-[#0C0C0C] p-5 w-60 h-screen overflow-y-auto">
      <Image src="/img/barber.png" alt="Logo" width={100} height={100} />
      <hr className="border-t border-[#1D1D1D] my-5" />
      <div className="flex flex-col space-y-4">
        {navItems.map(item => (
          <Link key={item.path} href={item.path}>
            <div className={`flex items-center space-x-2 p-2 ${pathname === item.path ? 'text-white' : 'text-[#7C7C7C]'}`}>
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-auto text-white text-center">
        <span>Tu Sucursal</span>
      </div>
    </div>
  );
};

export default NavBar;


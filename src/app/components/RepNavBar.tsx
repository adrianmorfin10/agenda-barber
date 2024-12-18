// src/app/components/RepNavBar.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const RepNavBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex bg-white p-4">
      <nav className="flex items-center space-x-5">
        <Link href="/reportes">
          <div className={`cursor-pointer text-black font-medium text-lg ${pathname === '/reportes' ? 'border-b-2 border-black' : 'text-gray-500'}`}>
            Reportes
          </div>
        </Link>
        <Link href="/reportes-clientes">
          <div className={`cursor-pointer text-black font-medium text-lg ${pathname === '/reportes-clientes' ? 'border-b-2 border-black' : 'text-gray-500'}`}>
            Clientes
          </div>
        </Link>
        <Link href="/reportes-empleados">
          <div className={`cursor-pointer text-black font-medium text-lg ${pathname === '/reportes-empleados' ? 'border-b-2 border-black' : 'text-gray-500'}`}>
            Empleados
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default RepNavBar;

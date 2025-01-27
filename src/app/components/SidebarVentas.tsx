"use client";

import React from 'react';

type SectionType = "Venta Rápida" | "Por Cobrar" | "Productos" | "Membresías" | "Ventas Realizadas";

interface SidebarVentasProps {
  selectedSection: SectionType | null;
  setSelectedSection: (section: SectionType) => void;
}

const SidebarVentas: React.FC<SidebarVentasProps> = ({ selectedSection, setSelectedSection }) => {
  const sections: SectionType[] = ["Venta Rápida", "Por Cobrar", "Productos", "Membresías", "Ventas Realizadas"];

  const handleSectionClick = (section: SectionType) => {
    setSelectedSection(section);
    const currentPath = window.location.pathname;

    if (section === "Ventas Realizadas") {
      window.location.href = "/ventas-history";
    } else if (currentPath === "/ventas-history") {
      window.location.href = "/ventas";
    }
  };

  return (
    <div className="w-64 max-w-[160px] p-4 bg-gray-50 border-r border-gray-200">
      <h2 className="text-lg font-bold mb-4">Ventas</h2>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li
            key={section}
            onClick={() => handleSectionClick(section)}
            className={`cursor-pointer text-lg ${
              selectedSection === section ? "text-black font-semibold underline" : "text-gray-500"
            }`}
          >
            {section}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarVentas;

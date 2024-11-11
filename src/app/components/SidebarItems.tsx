"use client";

import React from 'react';

interface SidebarItemsProps {
  title: string;
  items: string[];
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ title, items }) => {
  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarItems;

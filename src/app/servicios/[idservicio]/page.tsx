// src/app/servicios/[idservicio]/page.tsx

import React from 'react';
import ServiceDetail from './detail';

const ServicePage = () => {
  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <ServiceDetail />
    </div>
  );
};

export default ServicePage;

"use client";

import React from 'react';

const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white text-center p-4">
      <h2 className="text-2xl font-bold text-black mb-2">En construcción</h2>
      <p className="text-gray-600 mb-4">
        Lo sentimos, esta sección se encuentra en construcción. Regresa más tarde.
      </p>
      <img src="/img/cons.svg" alt="En construcción" className="w-full max-w-[500px]" />
    </div>
  );
};

export default UnderConstruction;

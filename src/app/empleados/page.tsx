"use client";

import React from "react";
import UnderConstruction from "../components/UnderConstruction";
import { useUser } from '@auth0/nextjs-auth0/client';
import Empleados from "./Empleados";

const Page = () => {
  const { user, error, isLoading } = useUser();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <Empleados />
    </div>
  );
};

export default Page;

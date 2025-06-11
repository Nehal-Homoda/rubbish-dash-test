"use client";
import ServicesDataTable from "@/components/data-tables/ServicesDataTable";
import React, { useState } from "react";
import UIDashCard from "@/components/ui/UIDashCard";
import TableStatusDropdown from "@/components/ui/TableStatusDropdown";


export default function services() {

  const options = [
    {
      label: "مفعل",
      value: "مفعل",
      style: "text-green-700 bg-green-100 rounded-md text-sm w-fit p-1",
      icon: "fa-solid fa-chevron-down",
    },
    {
      label: "غير مفعل",
      value: "غير مفعل",
      style: "text-red-500/80 bg-red-100/65 rounded-md text-sm w-fit p-1",
      icon: "fa-solid fa-chevron-down",
    },
    {
      label: "معلق",
      value: "معلق",
      style: "text-yellow-500 bg-yellow-100 rounded-md text-sm w-fit p-1",
      icon: "fa-solid fa-chevron-down",
    },
  ];

  return (
    <>
      <div>
        <UIDashCard shadow="shadow-xl">
          <TableStatusDropdown items={options} />
          <ServicesDataTable />
        </UIDashCard>
      </div>
    </>
  );
}

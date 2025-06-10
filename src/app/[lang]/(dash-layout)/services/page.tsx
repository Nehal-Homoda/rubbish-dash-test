"use client";
import ServicesDataTable from "@/components/data-tables/ServicesDataTable";
import React, { useState } from "react";
import UIDashCard from "@/components/ui/UIDashCard";
import FileInput from "@/components/ui/form/FileInput";

export default function services() {

  return (
    <>
      <div>
        <UIDashCard shadow="shadow-xl">
          <ServicesDataTable />
        </UIDashCard>
      </div>
    </>
  );
}

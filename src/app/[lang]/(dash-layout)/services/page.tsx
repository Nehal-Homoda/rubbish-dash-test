import ServicesDataTable from "@/components/data-tables/ServicesDataTable";
import UIDashCard from "@/components/ui/UICardYara";
import React from "react";

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

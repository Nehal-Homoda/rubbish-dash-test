import ServicesDataTable from "@/components/data-tables/ServicesDataTable";
import React from "react";
import { UIDashCard } from '@/components/ui/UICardYara';

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

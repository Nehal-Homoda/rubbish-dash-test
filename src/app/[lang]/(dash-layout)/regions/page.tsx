import RegionsDataTable from "@/components/data-tables/RegionsDataTable";
import UIDashCard from "@/components/ui/UICardYara";
import React from "react";

export default function regions() {
  return (
    <>
      <div >
        <UIDashCard shadow="shadow-xl" >
          <RegionsDataTable />
        </UIDashCard>
      </div>
    </>
  );
}

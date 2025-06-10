import UsersDataTable from "@/components/data-tables/UsersDataTable";
import UsersDataTableCopy from "@/components/data-tables/UsersDataTableCopy";
import UIDashCard from "@/components/ui/UIDashCard";
import React from "react";

export default function users() {
  return (
    <>
      {" "}
      <UIDashCard shadow="shadow-xl">
        {/* <UsersDataTable /> */}
        <UsersDataTableCopy />
      </UIDashCard>
    </>
  );
}

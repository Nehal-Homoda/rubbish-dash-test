"use client";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";

type Props = {
  items: any[];
};
export default function TableStatusDropdown({ items }: Props) {
  const [statusOptions, setStatusOptions] = useState(items);
  const [selectedStatus, setSelectedStatus] = useState(items[0]);

  //   useEffect(() => {
  //     setStatusOptions(options);
  //     setSelectedStatus(options[0]);
  //   }, []);

  const selectedItemTemplate = (item) => {
    if (!item)
      return (
        <span className="text-green-700 bg-green-100 rounded-md text-sm w-fit p-1">
          مفعل
        </span>
      );
    console.log(item);
    console.log(selectedStatus);

    return <div>{item.name}</div>;

    return (
      <div className={`flex items-center gap-2 ${selectedStatus.style}`}>
        <span>{selectedStatus.label}</span>
        {/* <i className={`${item.icon}`}></i> */}
      </div>
    );
  };

  return (
    <div className="card flex justify-content-center items-center">
      <Dropdown
        // pt={{
        //   root: `px-0 flex justify-center items-center border-none shadow-none w-fit bg-transparent`,
        //   trigger: "text-surface hidden",
        //   input: "pe-0",
        // }}
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.value)}
        options={statusOptions}
        optionLabel="label"
        // placeholder="اختر الحالة"
        autoOptionFocus
        valueTemplate={selectedItemTemplate}
      />
    </div>
  );
}

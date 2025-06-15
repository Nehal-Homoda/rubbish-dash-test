"use client";
import { useLangAndDictionary } from "@/utils/lang";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";

type Option = {
  label: string;
  value?: boolean;
  icon?: string;
  style?: string;
};
type Props = {
  currentStatus: boolean;
  onStatusChange: (newValue: boolean) => void;
};

export default function TableStatusDropdown({ currentStatus, onStatusChange }: Props) {
    const { lang, dict } = useLangAndDictionary();
  
  const statusOptions: Option[] = [
    {
      label: "مفعل",
      value: true,
      style: "text-green-700 bg-green-100 rounded-md text-sm w-fit p-1",
      icon: "fa-solid fa-chevron-down",
    },
    // {
    //   label: "معلق",
    //   style: "text-yellow-500 bg-yellow-100 rounded-md text-sm w-fit p-1",
    //   icon: "fa-solid fa-chevron-down",
    // },
    {
      label: "غير مفعل",
      value: false,
      style: "text-red-500/80 bg-red-100/65 rounded-md text-sm w-fit p-1",
      icon: "fa-solid fa-chevron-down",
    },
  ];
  const [selectedStatus,setSelectedStatus] = useState(null) 

  const selectedItemTemplate = (item: any) => {

    if (!item)
      return (
        <div className={`flex items-center gap-2 ${selectedStatus?.style}`}>
          <span>{selectedStatus?.label}</span>
          <i className={`${selectedStatus?.icon}`}></i>
        </div>
      );
    
    return (
      <div className={`flex items-center gap-2 ${item.style}`}>
        <span>{item.label}</span>
        <i className={`${item.icon}`}></i>
      </div>
    );
  };

  const handleChange = (e) => {onStatusChange(e.value); setSelectedStatus(e.value)}

  useEffect(() => {
    const x = statusOptions.find((s) => s.value === currentStatus) ?? null;
    setSelectedStatus(x);
  }, []);

  return (
    <div className="card flex justify-content-center items-center">
      <Dropdown
        pt={{
          root: `px-0 flex justify-center items-center border-none shadow-none w-fit bg-transparent mx-auto`,
          trigger: "text-surface hidden",
          input: "pe-0",
        }}
        value={selectedStatus}
        onChange={(e) => handleChange(e)}
        options={statusOptions}
        optionLabel="label"
        placeholder="اختر الحالة"
        valueTemplate={selectedItemTemplate}
      />
    </div>
  );
}

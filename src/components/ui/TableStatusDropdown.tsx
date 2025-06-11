"use client";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";

type Props = {
    items: any[];
};
export default function TableStatusDropdown({ items }: Props) {
    const [statusOptions, setStatusOptions] = useState(items);
    const [selectedStatus, setSelectedStatus] = useState(items[0] ?? null);

    //   useEffect(() => {
    //     setStatusOptions(options);
    //     setSelectedStatus(options[0]);
    //   }, []);

    const selectedItemTemplate = (item: any) => {
        if (!item)
            return (
                <div className={`flex items-center gap-2 ${selectedStatus.style}`}>
                    <span>{selectedStatus.label}</span>
                    <i className={`${selectedStatus.icon}`}></i>
                </div>
            );
        console.log(item);
        console.log(selectedStatus);

        // return <div className="text-surface">{item.value}</div>;

        return (
            <div className={`flex items-center gap-2 ${item.style}`}>
                <span>{item.label}</span>
                <i className={`${item.icon}`}></i>
            </div>
        );
    };

    return (
        <div className="card flex justify-content-center items-center">
            <Dropdown
                pt={{
                    root: `px-0 flex justify-center items-center border-none shadow-none w-fit bg-transparent`,
                    trigger: "text-surface hidden",
                    input: "pe-0",
                }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.value)}
                options={statusOptions}
                optionLabel="label"
                // appendTo={"self"}
                placeholder="اختر الحالة"
                // autoOptionFocus
                valueTemplate={selectedItemTemplate}
            />
        </div>
    );
}

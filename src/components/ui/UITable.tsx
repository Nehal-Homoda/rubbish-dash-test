import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CheckBox from "./form/CheckBox";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
interface User {
  id: number;
  name: string;
  mobile: string;
  area: string;
  subscription: string;
  renewalDate: string;
  status: string;
}

export default function UserTable() {
  const users: User[] = [
    {
      id: 1,
      name: "حبيبة احمد",
      mobile: "01201988345",
      area: "حي ثان طنطا",
      subscription: "مشترك/شهرية",
      renewalDate: "21 مايو 2025",
      status: "مفعل",
    },
    {
      id: 2,
      name: "يمنى يوسف",
      mobile: "01201988345",
      area: "حي ثالث طنطا",
      subscription: "مشترك/3شهور",
      renewalDate: "21 مايو 2025",
      status: "مفعل",
    },
    {
      id: 3,
      name: "محمد احمد",
      mobile: "01201988345",
      area: "حي اول طنطا",
      subscription: "غير مشترك",
      renewalDate: "غير محدد",
      status: "مفعل",
    },
    {
      id: 4,
      name: "مريم ابراهيم",
      mobile: "01201988345",
      area: "حي ثالث طنطا",
      subscription: "مشترك/6شهور",
      renewalDate: "21 مايو 2025",
      status: "غير مفعل",
    },
    {
      id: 5,
      name: "هاجر ربيع",
      mobile: "01201988345",
      area: "حي اول طنطا",
      subscription: "غير مشترك",
      renewalDate: "غير محدد",
      status: "معلق",
    },
  ];

  const checkboxTemplate = (rowData: User) => {
    return (
      <CheckBox
        id={`checkbox-${rowData.id}`}
        boxSize="size-6"
        checkStyle="text-white"
        checkBoxBg="bg-foreground/10"
        peerChecked="peer-checked:bg-surface"
        checkBoxRoundedValue="rounded-md"
      />
    );
  };
  const headerCheckbox = () => {
    return (
      <CheckBox
        id="header-checkbox"
        boxSize="size-6"
        checkStyle="text-white"
        checkBoxBg="bg-foreground/10"
        peerChecked="peer-checked:bg-surface"
        checkBoxRoundedValue="rounded-md"
      />
    );
  };
  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "مفعل":
        return "success";
      case "غير مفعل":
        return "danger";
      case "معلق":
        return "warning";
      default:
        return "info";
    }
  };
  const getSubscriptionSeverity = (subscription: string) => {
    switch (subscription) {
      case "مشترك/شهرية":
      case "مشترك/3شهور":
      case "مشترك/6شهور":
        return "success";
      case "غير مشترك":
        return "danger";
      default:
        return "warning";
    }
  };

  const handleEdit = (user: User) => {
    console.log("edit");
  };

  const handleDelete = (user: User) => {
    console.log("renove");
  };

  const statusBodyTemplate = (rowData: User) => {
    return (
      <Tag
        value={rowData.status}
        severity={getStatusSeverity(rowData.status)}
      />
    );
  };

  const subscriptionBodyTemplate = (rowData: User) => {
    return (
      <Tag
        value={rowData.subscription}
        severity={getSubscriptionSeverity(rowData.subscription)}
      />
    );
  };
  const actionBodyTemplate = (rowData: User) => {
    return (
      <div className="flex  items-center justify-center gap-3">
        <button
          className="text-surface bg-surface-light-800 rounded-md size-8"
          onClick={() => handleEdit(rowData)}
        >
          <i className="fa-regular fa-pen-to-square text-lg"></i>
        </button>
        <button
          className="bg-red-100/65 text-red-500/80 rounded-md size-8"
          onClick={() => handleDelete(rowData)}
        >
          <span className="mdi mdi-delete-outline text-lg"></span>
        </button>
      </div>
    );
  };
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  return (
    <div className="card">
      <DataTable
        value={users}
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
      >
        <Column
          header={headerCheckbox}
          body={checkboxTemplate}
          style={{ width: "3rem"}}
        />
        <Column field="id" header="ID" sortable></Column>
        <Column field="name" header="الاسم" sortable></Column>
        <Column field="mobile" header="رقم الموبايل" sortable></Column>
        <Column field="area" header="المنطقة" sortable></Column>
        <Column
          field="subscription"
          header="الاشتراك"
          body={subscriptionBodyTemplate}
          sortable
        ></Column>
        <Column field="renewalDate" header="تاريخ التجديد" sortable></Column>
        <Column
          field="status"
          header="الحالة"
          body={statusBodyTemplate}
          sortable
        />
        <Column
          field="actions"
          header="الاجراءات"
          sortable
          body={actionBodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
}

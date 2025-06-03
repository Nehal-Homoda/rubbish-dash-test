"use client";
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CheckBox from "../ui/form/CheckBox";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import BaseModal from './../ui/BaseModal';
interface User {
  id: number;
  name: string;
  mobile: string;
  area: string;
  subscription: string;
  renewalDate: string;
  status: string;
}

export default function UsersDataTable() {
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
        border="border-transparent"
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
        border="border-transparent"
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
  const actionsBodyTemplate = () => {
    return (
      <div className="flex items-center justify-center gap-3">
        <BaseModal
          title={"تعديل عنصر"}
          actionBtn={"حفظ"}
          openBtnIcon={"fa-regular fa-pen-to-square text-lg"}
          iconType="mdi"
          style="text-surface-light-200 bg-surface-light-800/50 px-2 py-1 rounded-lg"
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
            vero!
          </p>
        </BaseModal>
        <BaseModal
          title={"حذف عنصر"}
          actionBtn={"تأكيد"}
          iconType="mdi"
          openBtnIcon={"mdi mdi-delete-outline text-lg"}
          style="text-red-600 bg-red-50 px-2 py-1 rounded-lg"
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
            vero!
          </p>
        </BaseModal>
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
          header={headerCheckbox()}
          body={checkboxTemplate}
          style={{ textAlign: "center" }}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          field="id"
          header="ID"
          sortable
          style={{ textAlign: "center" }}
          headerStyle={{ textAlign: "center" }}
        ></Column>
        <Column
          field="name"
          header="اسم المستخدم"
          sortable
          style={{ textAlign: "center" }}
          headerStyle={{ textAlign: "center" }}
        ></Column>
        <Column
          field="mobile"
          header="رقم الموبايل"
          style={{ textAlign: "center" }}
          headerStyle={{ textAlign: "center" }}
        ></Column>
        <Column
          field="area"
          header="المنطقة"
          style={{ textAlign: "center" }}
          headerStyle={{ textAlign: "center" }}
        ></Column>
        <Column
          field="subscription"
          header="الاشتراك"
          body={subscriptionBodyTemplate}
          style={{ textAlign: "center" }}
          headerStyle={{ textAlign: "center" }}
        ></Column>
        <Column
          field="renewalDate"
          header="ميعاد التجديد"
          sortable
          style={{ textAlign: "center" }}
          headerStyle={{ textAlign: "center" }}
        ></Column>
        <Column
          field="status"
          header="الحالة"
          body={statusBodyTemplate}
          style={{ textAlign: "center" }}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          field="actions"
          header="الاجراءات"
          sortable
          body={actionsBodyTemplate}
          style={{ textAlign: "center" }}
          headerStyle={{ textAlign: "center" }}
        ></Column>
      </DataTable>
    </div>
  );
}

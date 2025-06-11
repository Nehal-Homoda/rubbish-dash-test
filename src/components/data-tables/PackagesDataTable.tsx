"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CheckBox from "../ui/form/CheckBox";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import BaseModal from "../ui/BaseModal";
import { getPackagesService } from "@/services/packagesOffersService";
import { PackageOffer } from "@/types/packagesOffer.interface";
interface Packages {
  id: number;
  name: string;
  serviceType: string;
  unitPrice: string;
  duration: string;
  subscriptionsNumber: string;
  status: string;
}

export default function PackagesDataTable() {
  const [packagesOffer, setPackagesOffer] = useState<PackageOffer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPackages = async () => {

    setLoading(true)
    getPackagesService()
    .then((response) => {
      
      setPackagesOffer(response.data);
      console.log(response.data)
    })
    .catch((error) => {
      
      console.log('fetch packages error ', error.message)
    })
    .finally(() => {

      setLoading(false)
    })

  }
 
  useEffect(() => {
getPackagesService();

  }, [])

  const checkboxTemplate = (rowData: Packages) => {
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

  const statusBodyTemplate = (rowData: Packages) => {
    return (
      <Tag
        value={rowData.status}
        severity={getStatusSeverity(rowData.status)}
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
          style="text-surface bg-surface-light-800/50 px-2 py-1 rounded-lg"
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
        value={packagesOffer}
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
        />
        <Column
          field="name"
          header="اسم الباقة"
          style={{ textAlign: "center" }}
          sortable
        />
        <Column
          field="serviceType"
          header="نوع الخدمة"
          style={{ textAlign: "center" }}
        />
        <Column
          field="unitPrice"
          header="سعر الوحدة"
          style={{ textAlign: "center" }}
          sortable
        />
        <Column
          field="duration"
          header="مدة الباقة"
          style={{ textAlign: "center" }}
          sortable
        />
        <Column
          field="subscriptionsNumber"
          header="عدد الاشتراكات"
          sortable
          style={{ textAlign: "center" }}
        />
        <Column
          field="status"
          header="الحالة"
          body={statusBodyTemplate}
          style={{ textAlign: "center" }}
        />
        <Column
          field="actions"
          header="الإجراءات"
          body={actionsBodyTemplate}
          style={{ textAlign: "center" }}
        />
      </DataTable>
    </div>
  );
}

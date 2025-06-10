"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import alert from "@/assets/images/alert.png";
import { Tag } from "primereact/tag";
import BaseModal from "@/components/ui/BaseModal";
import { useLangAndDictionary } from "@/utils/lang";
import TextFieldNada from "../ui/form/TextFieldNada";
import BaseDropdown from "../ui/form/Dropdown";
import FileInput from "../ui/form/FileInput";

export default function ServicesDataTable() {
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [arabicName, setArabicName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState<any[]>([
    {
      id: 1,
      name: "وحدات سكنية",
      imageUrl: alert.src,
      status: "مفعل",
      subscription: "10 مشترك",
    },
    {
      id: 2,
      name: "شقه",
      imageUrl: alert.src,
      status: "غير مفعل",
      subscription: "10 مشترك",
    },
    {
      id: 3,
      name: "محلات تجارية",
      imageUrl: alert.src,
      status: "معلق",
      subscription: "3 مشترك",
    },
    {
      id: 4,
      name: "مطاعم",
      imageUrl: alert.src,
      status: "مفعل",
      subscription: "3 مشترك",
    },
  ]);
  const {lang,dict} = useLangAndDictionary()
  const statusBodyTemplate = (data) => {
    return <Tag value={data.status} severity={getSeverity(data)}></Tag>;
  };
  const getSeverity = (data) => {
    switch (data.status) {
      case "مفعل":
        return "success";

      case "معلق":
        return "warning";

      case "غير مفعل":
        return "danger";

      default:
        return null;
    }
  };

  const imageBodyTemplate = (data) => {
    return (
      <div className="w-20 h-10 overflow-hidden">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  const actionsBodyTemplate = () => {
    return (
      <div className="flex items-center justify-center gap-2">
        <BaseModal
          title={dict.edit_service || "تعديل خدمة"}
          actionBtn={dict.save || "حفظ"}
          openBtnIcon={"mdi mdi-square-edit-outline"}
          iconType="mdi"
          style="text-surface-light-200 bg-surface-light-800/50 px-2 py-1 rounded-lg"
        >
          <div className="mt-10 mb-9">
          <FileInput state="edit" />
          </div>
          <TextFieldNada
            value={arabicName}
            label={"اسم الخدمة (عربي)"}
            prependIcon={"mdi mdi-package-variant-closed"}
            iconType="mdi"
            placeholder={dict.service_name || "اسم الخدمة"}
            name="service-name"
            type="text"
            required={true}
            handleChange={(e) => {
              setArabicName(e.target.value);
            }}
          />
          <div className="my-9">
            <TextFieldNada
              value={englishName}
              label={"اسم الخدمة (انجليزي)"}
              prependIcon={"mdi mdi-package-variant-closed"}
              iconType="mdi"
              placeholder={dict.service_name || "اسم الخدمة"}
              name="service-name"
              type="text"
              required={true}
              handleChange={(e) => {
                setEnglishName(e.target.value);
              }}
            />
          </div>
          <BaseDropdown
            style="relative text-foreground px-3 py-1.5 border border-surface-light-700 rounded-2xl mt-6"
            value={status}
            onChange={({ value }: { value: string }) => {
              setStatus(value);
            }}
            label="الحالة"
            placeholder="اختر الحالة"
            name="status"
            required={true}
            iconType="mdi"
            prependIcon="mdi mdi-account-outline"
            options={[
              { value: "active", label: "مفعل" },
              { value: "not-active", label: `غير مفعل` },
              { value: "pending", label: "معلق" },
            ]}
          />
        </BaseModal>
        <BaseModal
          title={"حذف عنصر"}
          actionBtn={"تأكيد"}
          openBtnIcon={"mdi mdi-trash-can-outline"}
          iconType="mdi"
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

  return (
    <>
      <div className="card mb-20">
        <DataTable
          paginator
          paginatorRight
          rows={3}
          value={data}
          selectionMode={rowClick ? null : "checkbox"}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id"
          tableStyle={{ minWidth: "50rem", textAlign: "center" }}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{
              width: "3rem",
              backgroundColor: "white",
              color: "rgb(var(--color-foreground))",
              opacity: ".5",
              borderBottom: "solid 1px #00000008",
            }}
            bodyStyle={{ borderBottom: "solid 1px #00000008" }}
            style={{ color: "red" }}
          ></Column>
          <Column
            style={{ textAlign: "center" }}
            sortable
            headerStyle={{
              textAlign: "center",
              backgroundColor: "white",
              color: "rgb(var(--color-foreground))",
              opacity: ".5",
              borderBottom: "solid 1px #00000008",
            }}
            bodyStyle={{ borderBottom: "solid 1px #00000008" }}
            field="id"
            header="ID"
          ></Column>
          <Column
            style={{ textAlign: "center" }}
            headerStyle={{
              textAlign: "center",
              backgroundColor: "white",
              color: "rgb(var(--color-foreground))",
              opacity: ".5",
              borderBottom: "solid 1px #00000008",
            }}
            bodyStyle={{ borderBottom: "solid 1px #00000008" }}
            header="صورة الخدمة"
            body={imageBodyTemplate}
          ></Column>
          <Column
            style={{ textAlign: "center" }}
            headerStyle={{
              textAlign: "center",
              backgroundColor: "white",
              color: "rgb(var(--color-foreground))",
              opacity: ".5",
              borderBottom: "solid 1px #00000008",
            }}
            bodyStyle={{ borderBottom: "solid 1px #00000008" }}
            field="name"
            header="اسم الخدمة"
          ></Column>
          <Column
            style={{ textAlign: "center" }}
            sortable
            headerStyle={{
              textAlign: "center",
              backgroundColor: "white",
              color: "rgb(var(--color-foreground))",
              opacity: ".5",
              borderBottom: "solid 1px #00000008",
            }}
            bodyStyle={{ borderBottom: "solid 1px #00000008" }}
            field="subscription"
            header="عدد الاشتراكات"
          ></Column>
          <Column
            style={{ textAlign: "center" }}
            headerStyle={{
              textAlign: "center",
              backgroundColor: "white",
              color: "rgb(var(--color-foreground))",
              opacity: ".5",
              borderBottom: "solid 1px #00000008",
            }}
            bodyStyle={{ borderBottom: "solid 1px #00000008" }}
            header="الحالة"
            body={statusBodyTemplate}
          ></Column>
          <Column
            style={{ textAlign: "center" }}
            headerStyle={{
              textAlign: "center",
              backgroundColor: "white",
              color: "rgb(var(--color-foreground))",
              opacity: ".5",
              borderBottom: "solid 1px #00000008",
            }}
            bodyStyle={{ borderBottom: "solid 1px #00000008" }}
            header="الاجراءات"
            body={actionsBodyTemplate}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

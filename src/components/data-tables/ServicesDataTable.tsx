"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Tag } from "primereact/tag";
import BaseModal from "@/components/ui/BaseModal";
import { useLangAndDictionary } from "@/utils/lang";
import TextFieldNada from "../ui/form/TextFieldNada";
import BaseDropdown from "../ui/form/Dropdown";
import FileInput from "../ui/form/FileInput";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";

export default function ServicesDataTable() {
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [arabicName, setArabicName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [data, setData] = useState<any[]>([
    {
      id: 1,
      name: "وحدات سكنية",
      status: "مفعل",
      subscription: "10 مشترك",
    },
    {
      id: 2,
      name: "شقه",
      status: "غير مفعل",
      subscription: "10 مشترك",
    },
    {
      id: 3,
      name: "محلات تجارية",
      status: "معلق",
      subscription: "3 مشترك",
    },
    {
      id: 4,
      name: "مطاعم",
      status: "مفعل",
      subscription: "3 مشترك",
    },
  ]);
  
  const { lang, dict } = useLangAndDictionary();

  const statusBodyTemplate = (data) => {
    return (
        <Tag value={data.status} severity={getSeverity(data)} className="w-fit">
          <i className="fa-solid fa-chevron-down ms-2"></i>
        </Tag>
    )};
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
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-20 h-10 bg-gray-200"></div>
        )}
      </div>
    );
  };

  const actionsBodyTemplate = () => {
    return (
      <div className="flex items-center justify-center gap-2">
        <BaseModal
          title={dict.edit_service || "تعديل خدمة"}
          actionBtn={dict.save || "حفظ"}
          openBtnIcon={"fa-regular fa-pen-to-square text-lg"}
          iconType="fa"
          style="text-surface bg-surface-light-800/50 px-2 py-1 rounded-lg"
        >
          <div className="my-10 flex justify-center">
            <FileInput state="edit" />
          </div>
          <TextFieldNada
            value={arabicName}
            label={"اسم الخدمة (عربي)"}
            prependIcon={"mdi mdi-layers-triple-outline"}
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
              prependIcon={"mdi mdi-layers-triple-outline"}
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
          openBtnIcon={"mdi mdi-delete-outline text-lg"}
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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  
  const renderHeader = () => {
    return (
      <div className="flex justify-between relative ">
        <IconField>
          <i className="fa-solid fa-magnifying-glass text-gray-500 absolute top-1/2 -translate-y-1/2 start-3"></i>
          <InputText
            className="focus:shadow-none bg-surface-light-800/50"
            style={{ outline: "none", border: "none", boxShadow: "none" }}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={dict.search}
          />
        </IconField>
        <div className="flex items-center gap-3">
          <div className="card flex justify-content-center items-center">
            <Dropdown
              pt={{
                root: "px-0 flex justify-center items-center btn-secondary border-none shadow-none w-fit text-surface",
                trigger: "text-surface",
                input: "text-surface pe-0",
              }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.value)}
              options={[
                { label: "مفعل", value: "مفعل" },
                { label: "غير مفعل", value: "غير مفعل" },
                { label: "معلق", value: "معلق" },
              ]}
              optionLabel="label"
              placeholder="الحالة"
            />
          </div>
          <button className="btn-secondary text-xl">
            <span className="mdi mdi-tray-arrow-down"></span>
          </button>
          <BaseModal
            title={dict.add_service}
            actionBtn={dict.save}
            openBtnLabel={dict.add_service}
            style="base-btn w-30"
          >
            <div className="mb-16 flex justify-center">
              <FileInput state="addToTable" />
            </div>
            <TextFieldNada
              value={arabicName}
              label={`${dict.service_name} (${dict.arabic})`}
              prependIcon={"mdi mdi-layers-triple-outline"}
              iconType="mdi"
              placeholder={dict.service_name}
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
                label={
                  `${dict.service_name} (${dict.english})` ||
                  "اسم الخدمة (انجليزي)"
                }
                prependIcon={"mdi mdi-layers-triple-outline"}
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
              label={dict.status}
              placeholder={`${dict.select} ${dict.status}`}
              name="status"
              required={true}
              iconType="mdi"
              prependIcon="mdi mdi-account-outline"
              options={[
                { value: "active", label: `${dict.active}` },
                { value: "not-active", label: `${dict.not_active}` },
                { value: "pending", label: `${dict.pending}` },
              ]}
            />
          </BaseModal>
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <>
      <div className="card mb-20">
        <DataTable
          pt={{
            header: {
              className: "bg-background border-none mb-5",
            },
          }}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["name", "id", "subscription"]}
          header={header}
          paginator
          paginatorRight
          rows={3}
          value={data}
          selectionMode={rowClick ? null : "checkbox"}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id"
          tableStyle={{ minWidth: "50rem", textAlign: "center" }}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{
              width: "3rem",
              backgroundColor: "white",
              borderBottom: "solid 1px #00000008",
            }}
            align="center"
            alignHeader="center"
            bodyStyle={{ borderBottom: "solid 1px #00000008" }}
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
            align="center"
            alignHeader="center"
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
            align="center"
            alignHeader="center"
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
            align="center"
            alignHeader="center"
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
            align="center"
            alignHeader="center"
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
            align="center"
            alignHeader="center"
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
            align="center"
            alignHeader="center"
            bodyStyle={{ borderBottom: "solid 1px #00000008" }}
            header="الاجراءات"
            body={actionsBodyTemplate}
          ></Column>
          
        </DataTable>
      </div>
    </>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import BaseModal from "@/components/ui/BaseModal";
import { useLangAndDictionary } from "@/utils/lang";
import TextFieldNada from "../ui/form/TextFieldNada";
import BaseDropdown from "../ui/form/Dropdown";
import FileInput from "../ui/form/FileInput";
import { FilterMatchMode } from "primereact/api";
import TableStatusDropdown from "../ui/TableStatusDropdown";
import { getCategories} from "@/services/categoriesService";
import { Dropdown } from "primereact/dropdown";

export default function ServicesDataTable() {
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [filters, setFilters] = useState({global: { value: null, matchMode: FilterMatchMode.CONTAINS },});
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [addFormDate, setAddFormData] = useState({
    name1: '',
    name2: '',
    status: '',
  })
  const [formDate, setformData] = useState({
    name1: "",
    name2: "",
    status: "",
  });
   const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     console.log("changed");
     console.log("changed name ", e.target.name);
     console.log("changed value ", e.target.value);
     setAddFormData((prev) => ({
       ...prev,
       [e.target.name]: e.target.value,
     }));
   };
   const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
     console.log("changed");
     console.log("changed name ", e.target.name);
     console.log("changed value ", e.target.value);
     setformData((prev) => ({
       ...prev,
       [e.target.name]: e.target.value,
     }));
   };
  const [data, setData] = useState<any[]>([
    {
      id: 1,
      name: "وحدات سكنية",
      status: "active",
      subscription: "10 مشترك",
    },
    {
      id: 2,
      name: "شقه",
      status: "not_active",
      subscription: "10 مشترك",
    },
    {
      id: 3,
      name: "محلات تجارية",
      status: "pending",
      subscription: "3 مشترك",
    },
    {
      id: 4,
      name: "مطاعم",
      status: "active",
      subscription: "3 مشترك",
    },
  ]);

  const { lang, dict } = useLangAndDictionary();

  const handleStatusChange = (newStatus: string, id: number) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );    
  };
  
  const statusBodyTemplate = (data) => {
    return (
      <TableStatusDropdown
        currentStatus={data.status}
        onStatusChange={(newStatus) =>
          handleStatusChange(newStatus, data.id)
        }
      />
    );
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
            value={formDate.name1}
            label={"اسم الخدمة (عربي)"}
            prependIcon={"mdi mdi-layers-triple-outline"}
            iconType="mdi"
            placeholder={dict.service_name || "اسم الخدمة"}
            name="name1"
            type="text"
            required={true}
            handleChange={inputChangeHandler}
          />
          <div className="my-9">
            <TextFieldNada
              value={formDate.name2}
              label={"اسم الخدمة (انجليزي)"}
              prependIcon={"mdi mdi-layers-triple-outline"}
              iconType="mdi"
              placeholder={dict.service_name || "اسم الخدمة"}
              name="name2"
              type="text"
              required={true}
              handleChange={inputChangeHandler}
            />
          </div>
          <BaseDropdown
            style="relative text-foreground px-3 py-1.5 border border-surface-light-700 rounded-2xl mt-6"
            value={formDate.status}
            onChange={inputChangeHandler}
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
        <IconField iconPosition={`${lang === "en" ? "left" : "right"}`}>
          <InputIcon className="pi pi-search" />
          <InputText
            className="focus:shadow-none bg-surface-light-800/50"
            style={{ outline: "none", border: "none", boxShadow: "none" }}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={dict.search}
          />
        </IconField>
        <div className="flex items-center gap-3">
          <Dropdown
                  pt={{
                    root: `px-0 flex justify-center items-center border-none shadow-none btn-secondary`,
                    trigger: "text-surface",
                    input: "pe-0",
                  }}
                  value={filteredStatus}
                  onChange={(e) => {setFilteredStatus(e.value)}}
                  options={[{
                    label: "مفعل",
                    value: "active",
                  },
                  {
                    label: "معلق",
                    value: "pending",
                  },
                  {
                    label: "غير مفعل",
                    value: "not_active",
                  },
                ]}
                  optionLabel="label"
                  placeholder={dict.status}
                />
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
              value={addFormDate.name1}
              label={`${dict.service_name} (${dict.arabic})`}
              prependIcon={"mdi mdi-layers-triple-outline"}
              iconType="mdi"
              placeholder={dict.service_name}
              name="name1"
              type="text"
              required={true}
              handleChange={handleAddFormChange}
            />
            <div className="my-9">
              <TextFieldNada
                value={addFormDate.name2}
                label={
                  `${dict.service_name} (${dict.english})` ||
                  "اسم الخدمة (انجليزي)"
                }
                prependIcon={"mdi mdi-layers-triple-outline"}
                iconType="mdi"
                placeholder={dict.service_name || "اسم الخدمة"}
                name="name2"
                type="text"
                required={true}
                handleChange={handleAddFormChange}
              />
            </div>
            <BaseDropdown
              style="relative text-foreground px-3 py-1.5 border border-surface-light-700 rounded-2xl mt-6"
              value={addFormDate.status}
              onChange={handleAddFormChange}
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

  // useEffect(() => {
  //   getCategories()
  //   }, []);

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

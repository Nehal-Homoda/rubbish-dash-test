"use client";
import React, { useState, useEffect } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import BaseModal from "../ui/BaseModal";
import TextField from "../ui/form/TextFieldNada";
import TimePicker from "../ui/form/TimePicker";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { FilterMatchMode } from "primereact/api";
import downloadIcon from "@/assets/images/icons/download-icon.png";
import Image from "next/image";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { getRegionsService } from "@/services/regionsServices";
import { getPackagesService } from "@/services/packagesOffersService";
import type { Region } from "@/types/regions.interface";
interface RegionsTableProps {
  lang?: "en" | "ar";
  dict?: { [key: string]: string };
}
interface regionNames {
  id: number;
  name: string;
  label: string;
}
interface TimeRange {
  from: Date | null;
  to: Date | null;
}
export default function RegionsDataTable({
  lang = "en",
  dict = {},
}: RegionsTableProps) {
  const [regionForm, setRegionForm] = useState<{
    nameAr: string;
    nameEn: string;
    timeRanges: TimeRange[];
  }>({
    nameAr: "",
    nameEn: "",
    timeRanges: [{ from: null, to: null }],
  });
  const [regions, setRegions] = useState<any>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    name_ar: { value: null, matchMode: FilterMatchMode.EQUALS },
    name_en: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    no_of_subscriptions: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  // const mockRegions = [
  //   {
  //     id: 1,
  //     areaName: "حي ثان طنطا",
  //     subscriptionsNumber: "25 مشترك",
  //     status: "مفعل",
  //   },
  //   {
  //     id: 2,
  //     areaName: "حي ثالث طنطا",
  //     subscriptionsNumber: "15 مشترك",
  //     status: "معلق",
  //   },
  //   {
  //     id: 3,
  //     areaName: "حي اول طنطا",
  //     subscriptionsNumber: "10 مشترك",
  //     status: "غير مفعل",
  //   },
  // ];
  const regionNames: regionNames[] = [
    { id: 1, name: "حي اول طنطا", label: "حي اول طنطا" },
    { id: 2, name: "حي ثان طنطا", label: "حي ثان طنطا" },
    { id: 3, name: "حي ثالث طنطا", label: "حي ثالث طنطا" },
  ];
  const handleNameArChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegionForm({ ...regionForm, nameAr: e.target.value });
  };

  const handleNameEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegionForm({ ...regionForm, nameEn: e.target.value });
  };

  const handleTimeChange = (
    index: number,
    field: "from" | "to",
    value: Date
  ) => {
    const updated = [...regionForm.timeRanges];
    updated[index][field] = value;
    setRegionForm({ ...regionForm, timeRanges: updated });
  };

  const handleAddTime = () => {
    setRegionForm({
      ...regionForm,
      timeRanges: [...regionForm.timeRanges, { from: null, to: null }],
    });
  };

  const handleRemoveTime = () => {
    setRegionForm({
      ...regionForm,
      timeRanges: regionForm.timeRanges.slice(0, -1),
    });
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

  const statusBodyTemplate = (rowData: any) => {
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
          title={dict.edit_region || "Edit Region"}
          actionBtn={dict.save || "Save"}
          openBtnIcon={"fa-regular fa-pen-to-square text-lg "}
          iconType="mdi"
          style=" bg-surface-light-800/50 text-surface rounded-lg px-2 py-1"
        >
          <div className="flex flex-col gap-12">
            <TextField
              handleChange={handleNameArChange}
              value={regionForm.nameAr}
              label={dict.region_name_arabic || "Region Name (Arabic)"}
              name="region_name_arabic"
              placeholder={
                dict.region_name_arabic_placeholder ||
                "Enter the region name in Arabic"
              }
              type="text"
              prependIcon="mdi mdi-map-marker-outline"
              iconType="mdi"
            />
            <TextField
              handleChange={handleNameEnChange}
              value={regionForm.nameEn}
              label={dict.region_name_english || "Region Name (English)"}
              name="region_name_english"
              placeholder={
                dict.region_name_english_placeholder ||
                "Enter the region name in English"
              }
              type="text"
              prependIcon="mdi mdi-map-marker-outline"
              iconType="mdi"
            />
            <div className="flex flex-col items-center gap-6">
              {regionForm.timeRanges.map((range, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <TimePicker
                    dict={dict}
                    label={dict.from || "From"}
                    value={range.from}
                    onChange={(val) => handleTimeChange(index, "from", val)}
                  />
                  <TimePicker
                    dict={dict}
                    label={dict.to || "To"}
                    value={range.to}
                    onChange={(val) => handleTimeChange(index, "to", val)}
                  />
                  {index === 0 && (
                    <button
                      onClick={handleAddTime}
                      disabled={regionForm.timeRanges.length > 2}
                      className="mdi mdi-plus outline-none border-none bg-surface px-[7px] py-1 rounded-md text-white hover:bg-surface-light-100 transition-all duration-300 cursor-pointer  disabled:bg-gray-400/50 disabled:text-white disabled:cursor-not-allowed"
                    ></button>
                  )}
                  {index > 0 && (
                    <button
                      onClick={handleRemoveTime}
                      className="mdi mdi-close outline-none border-none bg-rose-500 
 px-[7px] py-1 rounded-md text-white hover:opacity-85 transition-all duration-300 cursor-pointer"
                    ></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </BaseModal>
        <BaseModal
          title={dict.deleteItem || "Delete item"}
          actionBtn={dict.confirm || "Confirm"}
          iconType="mdi"
          openBtnIcon={"mdi mdi-delete-outline text-lg "}
          style="text-red-600 bg-red-50 rounded-lg px-2 py-1"
        >
          <p>Sure?</p>
        </BaseModal>
      </div>
    );
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <IconField iconPosition={`${lang === "en" ? "left" : "right"}`}>
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={dict.search}
            style={{
              color: "rgb(var(--color-foreground))",
              opacity: 0.6,
            }}
          />
        </IconField>
        <div className="flex items-center gap-3 overflow-x-auto ">
          <Dropdown
            value={filters.name_ar.value}
            options={regionNames}
            onChange={(e: DropdownChangeEvent) => {
              setFilters({
                ...filters,
                name_ar: { value: e.value, matchMode: FilterMatchMode.EQUALS },
              });
            }}
            optionLabel="label"
            optionValue="name"
            placeholder={dict.region}
            className="btn-secondary px-0 border-0 "
            showClear
          />

          <div className="btn-secondary flex-shrink-0 flex justify-center items-center">
            <Image src={downloadIcon} alt="download" width={20} height={20} />
          </div>
          <BaseModal
            openBtnLabel={dict.add_region}
            style="base-btn"
            title={dict.add_region}
            actionBtn={dict.add}
          >
            <div className="flex flex-col gap-12">
              <TextField
                handleChange={handleNameArChange}
                value={regionForm.nameAr}
                label={dict.region_name_arabic || "Region Name (Arabic)"}
                name="region_name_arabic"
                placeholder={
                  dict.region_name_arabic_placeholder ||
                  "Enter the region name in Arabic"
                }
                type="text"
                prependIcon="mdi mdi-map-marker-outline"
                iconType="mdi"
              />
              <TextField
                handleChange={handleNameEnChange}
                value={regionForm.nameEn}
                label={dict.region_name_english || "Region Name (English)"}
                name="region_name_english"
                placeholder={
                  dict.region_name_english_placeholder ||
                  "Enter the region name in English"
                }
                type="text"
                prependIcon="mdi mdi-map-marker-outline"
                iconType="mdi"
              />
              <div className="flex flex-col items-center gap-6">
                {regionForm.timeRanges.map((range, index) => (
                  <div key={index} className="flex gap-3 items-center w-full">
                    <TimePicker
                      dict={dict}
                      label={dict.from || "From"}
                      value={range.from}
                      onChange={(val) => handleTimeChange(index, "from", val)}
                    />
                    <TimePicker
                      dict={dict}
                      label={dict.to || "To"}
                      value={range.to}
                      onChange={(val) => handleTimeChange(index, "to", val)}
                    />
                    {index === 0 && (
                      <button
                        onClick={handleAddTime}
                        disabled={regionForm.timeRanges.length > 2}
                        className="mdi mdi-plus outline-none border-none bg-surface px-[7px] py-1 rounded-md text-white hover:bg-surface-light-100 transition-all duration-300 cursor-pointer  disabled:opacity-65  disabled:cursor-not-allowed"
                      ></button>
                    )}
                    {index > 0 && (
                      <button
                        onClick={handleRemoveTime}
                        className="mdi mdi-close outline-none border-none bg-rose-500 
                         px-[7px] py-1 rounded-md text-white hover:opacity-85 transition-all duration-300 cursor-pointer"
                      ></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </BaseModal>
        </div>
      </div>
    );
  };
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  useEffect(() => {
    getPackagesService()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error("Error while fetching regions:", err.message);
      });
  }, []);
  useEffect(() => {
    // setRegions(mockRegions); // dummy data (for test)

    getRegionsService()
      .then((res) => {
        console.log(res);
        setRegions(res.data);
      })
      .catch((err) => {
        console.error("Error while fetching regions:", err.message);
      });
  }, []);
  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={regions}
        header={header}
        removableSort
        paginator
        rows={5}
        filters={filters}
        selection={selectedRegions!}
        globalFilterFields={[
          "id",
          "name_ar",
          "name_en",
          "status",
          "no_of_subscriptions",
        ]}
        onSelectionChange={(e) => setSelectedRegions(e.value)}
        dataKey="id"
        emptyMessage={dict.regions_Empty_table_msg}
      >
        <Column
          selectionMode="multiple"
          style={{ textAlign: "center" }}
          align={"center"}
        />
        <Column
          field="id"
          header="ID"
          sortable
          style={{ textAlign: "center" }}
          align={"center"}
          headerStyle={{
            color: "rgb(var(--color-foreground))",
            opacity: 0.5,
            fontWeight: 500,
          }}
        ></Column>
        <Column
          field={lang === "en" ? "name_en" : "name_ar"}
          header="اسم المنطقة"
          style={{ textAlign: "center" }}
          align={"center"}
          headerStyle={{
            color: "rgb(var(--color-foreground))",
            opacity: 0.5,
            fontWeight: 500,
          }}
        />
        <Column
          field="no_of_subscriptions"
          header="عدد الاشتراكات"
          sortable
          style={{
            textAlign: "center",
          }}
          align={"center"}
          headerStyle={{
            color: "rgb(var(--color-foreground))",
            opacity: 0.5,
            fontWeight: 500,
          }}
        />
        <Column
          field="status"
          header="الحالة"
          body={statusBodyTemplate}
          style={{ textAlign: "center" }}
          align={"center"}
          headerStyle={{
            color: "rgb(var(--color-foreground))",
            opacity: 0.5,
            fontWeight: 500,
          }}
        />
        <Column
          field="actions"
          header="الإجراءات"
          body={actionsBodyTemplate}
          style={{ textAlign: "center" }}
          align={"center"}
          headerStyle={{
            color: "rgb(var(--color-foreground))",
            opacity: 0.5,
            fontWeight: 500,
          }}
        />
      </DataTable>
    </div>
  );
}

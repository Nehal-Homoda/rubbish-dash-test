"use client";
import React, { useState } from "react";
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
import downloadIcon from "../../assets/images/icons/download-icon.png";
import Image from "next/image";
interface Regions {
  id: number;
  areaName: string;
  subscriptionsNumber: string;
  status: string;
}
interface RgionTableProps {
  lang?: "en" | "ar";
  dict?: { [key: string]: string };
}
interface TimeRange {
  from: Date;
  to: Date;
}

export default function RegionsDataTable({
  lang = "en",
  dict = {},
}: RgionTableProps) {
  const [regionNameArabic, setRegionNameArabic] = useState<string>("");
  const [selectedRegions, setSelectedRegions] = useState<any>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    areaName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    subscriptionsNumber: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [regionNameEnglish, setRegionNameEnglish] = useState<string>("");
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
    { from: null, to: null },
  ]);
  const handleRegionNameArabicChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegionNameArabic(e.target.value);
  };

  const handleRegionNameEnglishChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegionNameEnglish(e.target.value);
  };

  const handleTimeChange = (
    index: number,
    field: "from" | "to",
    value: Date
  ) => {
    const updated = [...timeRanges];
    updated[index][field] = value;
    setTimeRanges(updated);
  };

  const handleAddTime = () => {
    setTimeRanges([...timeRanges, { from: null, to: null }]);
  };
  const handleRemoveTime = () => {
    setTimeRanges((prev) => prev.slice(0, -1));
  };

  const regions: Regions[] = [
    {
      id: 1,
      areaName: "حي ثان طنطا",
      subscriptionsNumber: "25 مشترك",
      status: "مفعل",
    },
    {
      id: 2,
      areaName: "حي ثالث طنطا",
      subscriptionsNumber: "15 مشترك",
      status: "معلق",
    },
    {
      id: 3,
      areaName: "حي اول طنطا",
      subscriptionsNumber: "10 مشترك",
      status: "غير مفعل",
    },
  ];

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

  const statusBodyTemplate = (rowData: Regions) => {
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
              handleChange={handleRegionNameArabicChange}
              value={regionNameArabic}
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
              handleChange={handleRegionNameEnglishChange}
              value={regionNameEnglish}
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
              {timeRanges.map((range, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <TimePicker
                    label={dict.from || "From"}
                    value={range.from}
                    onChange={(val) => handleTimeChange(index, "from", val)}
                  />
                  <TimePicker
                    label={dict.to || "To"}
                    value={range.to}
                    onChange={(val) => handleTimeChange(index, "to", val)}
                  />
                  {index === 0 && (
                    <button
                      onClick={handleAddTime}
                      disabled={timeRanges.length > 2}
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
          title={"حذف عنصر"}
          actionBtn={"تأكيد"}
          iconType="mdi"
          openBtnIcon={"mdi mdi-delete-outline text-lg "}
          style="text-red-600 bg-red-50 rounded-lg px-2 py-1"
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
            vero!
          </p>
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
        <div className="flex items-center gap-3">
          <button className="btn-secondary  ">
            <Image src={downloadIcon} alt="download" width={20} height={20}/>
          </button>
          <BaseModal
            openBtnLabel={dict.add_region}
            style="base-btn"
            title={dict.add_region}
            actionBtn={dict.add}
          >
            <div className="flex flex-col gap-12">
              <TextField
                handleChange={handleRegionNameArabicChange}
                value={regionNameArabic}
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
                handleChange={handleRegionNameEnglishChange}
                value={regionNameEnglish}
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
              {timeRanges.map((range, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <TimePicker
                    label={dict.from || "From"}
                    value={range.from}
                    onChange={(val) => handleTimeChange(index, "from", val)}
                  />
                  <TimePicker
                    label={dict.to || "To"}
                    value={range.to}
                    onChange={(val) => handleTimeChange(index, "to", val)}
                  />
                  {index === 0 && (
                    <button
                      onClick={handleAddTime}
                      disabled={timeRanges.length > 2}
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
        onSelectionChange={(e) => setSelectedRegions(e.value)}
        dataKey="id"
        emptyMessage="No regions found."
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
          field="areaName"
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
          field="subscriptionsNumber"
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

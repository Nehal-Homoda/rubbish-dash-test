"use client";
import React, { useEffect, useState } from "react";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import { successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import { getCategoriesService } from "@/services/categoriesService";
import { Category } from "@/types/categories.interface";
import { Visit } from "@/types/visits.interface";
import {
  deleteVisitsService,
  getVisitsByIdService,
  getVisitsService,
  updateVisitsService,
} from "@/services/visitService";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import moment, { months } from "moment";
import { District } from "@/types/district.interface";
import { getDistrictService } from "@/services/districtService";
import { Collector } from "@/types/collectors.interface";
import { getCollectorsService } from "@/services/collectorsService";

type FormDataType = {
  name_ar: string;
  name_en: string;
  category_id: number | string;
  is_active: number;
  price_per_unit: number | string;
  order: number;
  days_count: number | string;
};

export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<Visit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " المنطقة ", name: "address" },
    { text: " نوع الخدمة", name: "category_name" },
    { text: "المستخدم", name: "user_name" },
    { text: "جامع القمامة", name: "collector_name" },
    { text: "تاريخ الزيارة", name: "created_at" },
    { text: "الحالة", name: "is_active" },
    { text: "ملاحظة", name: "user_note" },
    { text: "الاجراءات", name: "procedures" },
  ];
  const statusList = [
    { is_active: "pending", name: "قيد الانتظار" },
    { is_active: "in_progress", name: "قيد التنفيذ" },
    { is_active: "collected", name: "مجمع" },
    { is_active: "not_collected", name: "غير مجمع" },
  ];

  const visitList = [
    { name: "الكل", archive: "" },
    {
      name: "الزيارات القديمة",
      archive: "1",
    },

    {
      name: "الزيارات الحديثة",
      archive: "0",
    },
  ];
  const [currentType, setCurrentType] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedDataItem, setSelectedDataItem] = useState<Visit | null>(null);
  const [updateFormData, setUpdateFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    category_id: "",
    is_active: 0,
    price_per_unit: "",
    order: 0,
    days_count: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>("");
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(
    undefined,
  );
  const [collectorFilter, setCollectorFilter] = useState<number | undefined>(
    undefined,
  );
  const [districtFilter, setDistrictFilter] = useState<number | undefined>(
    undefined,
  );
  const [archiveFilter, setArchiveFilter] = useState<number | undefined>(
    undefined,
  );
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isShowDialogOpen, setIsShowDialogOpen] = useState<boolean>(false);
  const [distrects, setDistrects] = useState<District[]>([]);
  const [collector, setCollector] = useState<Collector[]>([]);

  const fetchDataList = ({
    search = searchTerm,
    status = statusFilter,
    category_id = categoryFilter,
    collector_id = collectorFilter,
    district_id = districtFilter,
    from_date = startDate,
    end_date = endDate,
    archive = archiveFilter,
    pageNum = page,
  }: {
    search?: string;
    status?: string;
    category_id?: number | undefined;
    collector_id?: number | undefined;
    district_id?: number | undefined;
    archive?: number | undefined;
    from_date?: Date | null;
    end_date?: Date | null;
    pageNum?: number | undefined;
  } = {}) => {
    const statusParam = status != undefined ? "&status=" + status : "";
    const category =
      category_id != undefined ? "&category_id=" + category_id : "";
    const collector =
      collector_id != undefined ? "&collector_id=" + collector_id : "";
    const district =
      district_id != undefined ? "&district_id=" + district_id : "";
    const isArchive = archive != undefined ? "&archived=" + archive : "";
    const hasSearch = search ? "&search=" + search : "";
    const hasDateFrom = from_date
      ? "&from_date=" + moment(from_date).format("YYYY-MM-DD")
      : "";
    const hasDateTo = end_date
      ? "&to_date=" + moment(end_date).format("YYYY-MM-DD")
      : "";
    const query = `?page=${pageNum}${hasSearch}${statusParam}${category}${isArchive}${hasDateFrom}${hasDateTo}${category}${district}`;
    getVisitsService(query)
      .then((response) => {
        setDataList(response.data);
        setTotalPages(response.meta.last_page);
      })
      .catch(() => {});
  };

  const fetchDistrects = () => {
    getDistrictService()
      .then((response) => {
        setDistrects(response.data);
      })
      .catch((error) => {});
  };

  const fetchCollectors = () => {
    getCollectorsService().then((response) => {
      setCollector(response.data);
    });
  };

  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setPage(1);
    fetchDataList({ search: val, pageNum: 1 });
    // fetchDataList({ search: e.target.value });
  };
  const handleStatusFilter = (value: string | undefined) => {
    setStatusFilter(value);
    setPage(1);
    fetchDataList({ status: value, pageNum: 1 });
  };

  const handleArchiveFilter = (item: any) => {
    console.log("item is", item);
    setCurrentType(item.archive);
    setArchiveFilter(item.archive);
    setPage(1);
    fetchDataList({ archive: item.archive, pageNum: 1 });
  };
  const handleCategoryFilter = (value: number | undefined) => {
    setCategoryFilter(value);
    setPage(1);
    fetchDataList({ category_id: value, pageNum: 1 });
  };

  const updateDataItemActive = (value: any, index: number) => {
    const service = dataList.find((item, i) => {
      return index == i;
    });

    if (!service) return;

    const body = JSON.stringify({
      status: value,
    });

    updateVisitsService(service.id, body)
      .then((response) => {
        const arr = [...dataList];
        arr[index].status = value;

        setDataList(arr);

        console.log(response);
      })
      .catch((error) => {});
  };

  const deleteSubmit = (item: Visit, selectedIndex: number) => {
    deleteVisitsService(item.id)
      .then((response) => {
        const updatedArr = [...dataList];
        updatedArr.splice(selectedIndex, 1);
        setDataList(updatedArr);
        successDialog(true);
      })
      .catch((error) => {});
  };

  const updateDataItem = (item: Visit) => {
    setSelectedDataItem(item);
    getVisitsByIdService(item.id).then((response) => {
      console.log("response is", response.data);
      setSelectedDataItem(response.data);
    });
  };

  const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDataItem) return;

    const body = JSON.stringify({
      ...updateFormData,
    });

    updateVisitsService(selectedDataItem.id, body)
      .then((response) => {
        fetchDataList();
        successDialog(true);
      })
      .catch((error) => {});
  };

  const updateFormChangeHander = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
  ) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    console.log(e.target.name, e.target.value);
  };

  const statusDropdownColor = (name: string) => {
    if (name === "not_collected")
      return "bg-red-100 text-red-600 hover:bg-text-red-200";
    if (name === "in_progress")
      return "bg-blue-100 text-blue-600 hover:bg-text-blue-200";
    if (name === "collected") return "bg-green-100 text-green-500 ";
    if (name === "pending")
      return "bg-yellow-100 text-yellow-600 hover:bg-text-yellow-200";
  };
  const statusDropdownName = (name: string) => {
    return statusList.find((item) => item.is_active === name)?.name ?? "";
  };

  const handleDateRange = (date: [Date | null, Date | null]) => {
    const [start, end] = date;
    setStartDate(start ?? undefined);
    setEndDate(end ?? undefined);
    if (!startDate && !endDate) return;
    //@ts-ignore
    if (start > end) return;
    fetchDataList({ from_date: start, end_date: end, pageNum: 1 });
    setStartDate(undefined);
    setEndDate(undefined);
  };
  const tableHeadActionsSlot = () => {
    return (
      <>
        <div className="relative">
          <DatePicker
            className="w-full max-w-32   text-[#009414] py-3 px-5 rounded-lg bg-surface-light-800 text-surface-light hover:bg-surface-light-700 cursor-pointer "
            selected={startDate}
            onChange={(date) => handleDateRange(date)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            placeholderText="التاريخ"
          />
          <span className="mdi mdi-chevron-down absolute text-[#009414] top-[0.7em] left-[1em]"></span>
        </div>
        <UIPrimaryDropdown
          items={[{ id: undefined, name_ar: "الكل" }, ...categories]}
          itemName="name_ar"
          itemValue="id"
          onSelected={handleCategoryFilter}
        >
          نوع الخدمة
        </UIPrimaryDropdown>
        <UIPrimaryDropdown
          items={[{ is_active: undefined, name: "الكل" }, ...statusList]}
          itemName="name"
          itemValue="is_active"
          onSelected={handleStatusFilter}
        >
          الحالة
        </UIPrimaryDropdown>

        <UIPrimaryDropdown
          items={[{ id: undefined, name_ar: "الكل" }, ...distrects]}
          itemName="name_ar"
          itemValue="id"
          onSelected={handleRegionFilter}
        >
          المنطقة
        </UIPrimaryDropdown>
        <UIPrimaryDropdown
          items={[{ id: undefined, name_ar: "الكل" }, ...collector]}
          itemName="name_ar"
          itemValue="id"
          onSelected={handleCollectorFilter}
        >
          جامع القمامة
        </UIPrimaryDropdown>
      </>
    );
  };

  const tableVisitsFilteration = () => {
    return (
      <>
        <div className="py-5 md:flex  ">
          {visitList.map((item, index) => (
            <button
              onClick={() => handleArchiveFilter(item)}
              key={index}
              className={`${item.archive == currentType ? "border-b-2 border-[#009414]" : ""} w-40 pb-3 font-bold text-[#38433B]`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </>
    );
  };
  const fetchCategories = () => {
    getCategoriesService()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {});
  };

  const handleRegionFilter = (value: number | undefined) => {
    setPage(1);
    setDistrictFilter(value);
    setPage(1);
    fetchDataList({ district_id: value, pageNum: 1 });
  };
  const handleCollectorFilter = (value: number | undefined) => {
    setPage(1);
    setCollectorFilter(value);
    setPage(1);
    fetchDataList({ collector_id: value, pageNum: 1 });
  };

  useEffect(() => {
    fetchDataList();
    fetchCategories();
    fetchDistrects();
    fetchCollectors();
  }, [page]);

  return (
    <>
      <div className="py-20">
        <BaseDataTable
          items={dataList}
          headItems={headerArr}
          onPageChange={setPage}
          totalPages={totalPages}
          onSearchChange={tableSearchHandler}
          headerActionsSlot={tableHeadActionsSlot()}
          headerVisitsSlot={tableVisitsFilteration()}
          renderers={{
            is_active: (item, index: number) => (
              <UIPrimaryDropdown
                tiny
                itemName="name"
                itemValue="is_active"
                btnColorTailwindClass={statusDropdownColor(item.status)}
                items={statusList}
                onSelected={(value) => updateDataItemActive(value, index)}
              >
                {statusDropdownName(item.status)}
              </UIPrimaryDropdown>
            ),
            procedures: (item, index: number) => (
              <div className="flex justify-center gap-3">
                <UIDialogConfirm
                  danger
                  title="هل انت متأكد من حذف العنصر"
                  confirmHandler={() => {
                    deleteSubmit(item, index);
                  }}
                >
                  <button className="bg-[#F9285A0A] p-1 rounded-lg">
                    <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                  </button>
                </UIDialogConfirm>

                <button
                  onClick={() => {
                    updateDataItem(item);
                    setIsShowDialogOpen(true);
                  }}
                  className="bg-blue-100 p-1 px-2 text-sm rounded-lg"
                >
                  <span className="mdi mdi-eye-outline text-blue-500"></span>
                </button>
              </div>
            ),
          }}
        ></BaseDataTable>

        <UIBaseDialog
          open={isShowDialogOpen}
          onClose={() => setIsShowDialogOpen(false)}
          hideConfirmBtn
          title="تفاصيل الزيارة "
          confirmHandler={() => {}}
          confirmText="اضافة"
          form="update-form"
        >
          <form onSubmit={updateSubmit} id="update-form">
            <div className="space-y-10">
              <div className={`flex justify-start items-center `}>
                <div
                  className={`text-start w-full py-3  px-4  rounded-lg  ${statusDropdownColor(
                    selectedDataItem?.status ?? "",
                  )}`}
                >
                  {selectedDataItem
                    ? statusDropdownName(selectedDataItem.status)
                    : ""}
                </div>
              </div>
              <div className="relative py-3 px-5 border border-surface-light-700 rounded-2xl">
                <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 text-sm font-semibold">
                  <label>ملاحظة المستخدم</label>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-start w-full py-2 ">
                    {selectedDataItem?.user_note
                      ? selectedDataItem?.user_note
                      : "لا يوجد ملاحظة"}
                  </div>
                </div>
              </div>
              <div className="relative py-3 px-5 border border-surface-light-700 rounded-2xl">
                <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 text-sm font-semibold">
                  <label>سبب تعذر التجميع</label>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-start w-full py-2 ">
                    {selectedDataItem?.collector_note
                      ? selectedDataItem?.collector_note
                      : "لا يوجد سبب"}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </UIBaseDialog>
      </div>
    </>
  );
}

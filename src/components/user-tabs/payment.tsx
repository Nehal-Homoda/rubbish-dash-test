"use client";
import React, { useEffect, useState } from "react";
import { getDistrictService } from "@/services/districtService";
import { District } from "@/types/district.interface";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import SelectInput from "@/components/ui/form/SelectInput";
import { successDialog } from "@/utils/shared";
import UIDialogConfirm from "@/components/ui/UIDialogConfirm";
import { Payment } from "@/types/payment.interface";
import {
  addPaymentService,
  deletePaymentService,
  getPaymentsService,
  updatePaymentService,
} from "@/services/paymentsService";
import { AppUser } from "@/types/user.interface";
import { Users } from "@/types/auth.interface";

type Props = {
  user: Users;
};

export default function rubbush_collectors({ user }: Props) {
  const [dataList, setDataList] = useState<Payment[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " اسم المستخدم", name: "name_ar" },
    { text: " رقم الاستلام", name: "name_ar" },
    { text: " السعر الكلي", name: "name_ar" },
    { text: " تاريخ الدفع", name: "name_ar" },
    { text: "الحالة", name: "is_active" },
    { text: " اسم طريقة الدفع", name: "name_ar" },
    { text: "طريقة الدفع", name: "is_active" },
    { text: "صورة التحويل", name: "image" },
  ];
  const statusList = [
    { is_active: "pending", name: "قيد الانتظار" },
    { is_active: "accepted", name: "مقبولة" },
    { is_active: "rejected", name: "مرفوضة" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [selectedDataItem, setSelectedDataItem] = useState<Payment | null>(
    null
  );
  type FormDataType = {
    name_ar: string;
    name_en: string;
    order: number;
    is_active: number;
    available_days: string[];
    available_times: string[];
  };

  const fetchDataList = ({
    search = "",
    is_active = undefined,
  }: { search?: string; is_active?: boolean | undefined } = {}) => {
    console.log(is_active);
    const isActive = is_active ? "&status=" + is_active : "";
    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${page}${hasSearch}${isActive}&user_id=${user.id}`;

    getPaymentsService(query)
      .then((response) => {
        //@ts-ignore
        setDataList(response.data);
      })
      .catch(() => {});
  };

  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetchDataList({ search: e.target.value });
  };

  const updateDataItemActive = (value: any, index: number) => {
    const service = dataList.find((item, i) => {
      return index == i;
    });

    if (!service) return;

    const body = JSON.stringify({
      status: value,
    });

    updatePaymentService(service.id, body)
      .then((response) => {
        const arr = [...dataList];
        arr[index].status = value;

        setDataList(arr);

        console.log(response);
      })
      .catch((error) => {});
  };

  const deleteSubmit = (item: Payment, selectedIndex: number) => {
    deletePaymentService(item.id)
      .then((response) => {
        const updatedArr = [...dataList];
        updatedArr.splice(selectedIndex, 1);
        setDataList(updatedArr);
        successDialog(true);
      })
      .catch((error) => {});
  };

  const statusDropdownColor = (name: string) => {
    if (name === "rejected")
      return "bg-red-100 text-red-600 hover:bg-text-red-200";
    if (name === "accepted") return undefined;
    if (name === "pending")
      return "bg-yellow-100 text-yellow-600 hover:bg-text-yellow-200";
  };
  const statusDropdownName = (name: string) => {
    return statusList.find((item) => item.is_active === name)?.name ?? "";
  };

  const resetForm=()=>{

  }

  const tableHeadActionsSlot = () => {
    return (
      <>
        <UIBaseDialog
          confirmCloseHandler={resetForm}
          title="اضافة دفع"
          confirmHandler={() => {}}
          confirmText="اضافة"
          form="update-form"
          btn={
            <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
              <button className="bg-[#0094140D] p-1 rounded-lg">
                اضافة دفع
              </button>
            </div>
          }
        ></UIBaseDialog>
      </>
    );
  };
  useEffect(() => {
    fetchDataList();
  }, [page]); // runs every time `page` changes

  return (
    <>
      <div className="py-20">
        <BaseDataTable
          headItems={headerArr}
          onPageChange={setPage}
          totalPages={totalPages}
          onSearchChange={tableSearchHandler}
          headerActionsSlot={tableHeadActionsSlot()}
        >
          {dataList.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4">{item.id}</td>
              <td className="py-2 px-4">{item.user_name}</td>
              <td className="py-2 px-4">{item.receiving_number}</td>
              <td className="py-2 px-4">{item.total_price}</td>
              <td className="py-2 px-4">{item.created_at}</td>
              <td className="py-2 px-4">
                <UIPrimaryDropdown
                  tiny={true}
                  itemName="name"
                  itemValue="is_active"
                  btnColorTailwindClass={statusDropdownColor(item.status)}
                  onSelected={(value) => {
                    updateDataItemActive(value, index);
                  }}
                  items={statusList}
                >
                  {statusDropdownName(item.status)}
                </UIPrimaryDropdown>
              </td>
              <td className="py-2 px-4">
                {item.payment_method?.name_ar ?? "-"}
              </td>
              <td className="py-2 px-4">
                <div className="w-10 h-10 overflow-hidden">
                  <img
                    src={item.payment_method.image}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              </td>

              <td className="">
                <div className="flex justify-center gap-3">
                  <UIDialogConfirm
                    danger
                    title="هل انت متأكد من حذف العنصر"
                    confirmHandler={() => {
                      deleteSubmit(item, index);
                    }}
                  >
                    <button className="bg-[#F9285A0A] p-1 px-2 rounded-lg">
                      <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                    </button>
                  </UIDialogConfirm>
                  {/* <button className="bg-green-100 p-1 px-2 rounded-lg">
                                        <span className="mdi mdi-download text-green-600"></span>
                                    </button> */}
                </div>
              </td>
            </tr>
          ))}
        </BaseDataTable>
      </div>
    </>
  );
}

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
import { updateSubscriptionStatusService } from "@/services/subscriptionService";
import { getPaymentMethodService } from "@/services/paymentMethodService";
import { Payment_methods } from "@/types/paymentMethod.interface";
import { paymentMethodListService } from "@/services/sharedService";
import FileInputImg from "@/components/ui/form/FileInputImg";

export default function rubbush_collectors() {
  const [dataList, setDataList] = useState<Payment[]>([]);
  const [paymentMethodList, setPaymentMethodList] = useState<Payment_methods[]>(
    []
  );
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " اسم المستخدم", name: "name_ar" },
    { text: " عدد الوحدات", name: "name_ar" },
    { text: " السعر الكلي", name: "name_ar" },
    { text: " تاريخ الدفع", name: "name_ar" },
    { text: "الحالة", name: "is_active" },
    // { text: " اسم الباقة", name: "name_ar" },
    { text: "طريقة الدفع", name: "is_active" },
    { text: "صورة التحويل", name: "image" },
    { text: "الاجراءات", name: "image" },
  ];
  const statusList = [
    { is_active: "pending", name: "قيد الانتظار" },
    { is_active: "accepted", name: "مقبولة" },
    { is_active: "rejected", name: "مرفوضة" },
  ];

  const status = [
    { status: "pending", name: "قيد الانتظار" },
    { status: "accepted", name: "مقبولة" },
    { status: "rejected", name: "مرفوضة" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [districtDays, setDistrictDays] = useState<string[]>([]);
  const [districtTime, setDistrictTime] = useState<string[]>([]);
  const [selectedDataItem, setSelectedDataItem] = useState<Payment | null>(
    null
  );

  const [isOpenImg, setIsOpenImg] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");

  type FormDataType = {
    name_ar: string;
    name_en: string;
    order: number;
    is_active: number;
    available_days: string[];
    available_times: string[];
  };
  const [formData, setFormData] = useState<FormDataType>({
    name_ar: "",
    name_en: "",
    order: 0,
    is_active: 0,
    available_days: [],
    available_times: [],
  });

  const [updateFormData, setUpdateFormData] = useState({
    status: "",
    total_price: "",
    receiving_number: "",
    payment_method_id: 0,
    // user_id: 0,
    payment_verification: "",
  });

  const fetchPaymentMethodList = () => {
    paymentMethodListService().then((response) => {
      console.log("payment list", response);
      setPaymentMethodList(response.data);
    });
  };

  const fetchDataList = ({
    search = "",
    is_active = undefined,
  }: { search?: string; is_active?: boolean | undefined } = {}) => {
    console.log(is_active);
    const isActive = is_active ? "&status=" + is_active : "";
    const hasSearch = search ? "&search=" + search : "";

    const query = `?page=${page}${hasSearch}${isActive}`;

    getPaymentsService(query)
      .then((response) => {
        //@ts-ignore
        setDataList(response.data);
        setTotalPages(response.meta.last_page);
      })
      .catch(() => {});
  };
  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetchDataList({ search: e.target.value });
  };

  const updateDataItemActive = (value: any, index: number, item: Payment) => {
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

        console.log(value);

        if (value === "accepted") {
          setSubscriptionStatus(item, "accept");
        }
        if (value === "rejected") {
          setSubscriptionStatus(item, "reject");
        }
      })
      .catch((error) => {});
  };
  const setSubscriptionStatus = (
    payment: Payment,
    status: "reject" | "accept"
  ) => {
    if (!payment.subscription?.id) return;

    updateSubscriptionStatusService(payment.subscription.id, status)
      .then((response) => {})
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

  const updateDataItem = (item: Payment) => {
    setSelectedDataItem(item);
    // console.log('payment recieved number', item.receiving_number)

    setUpdateFormData({
      status: item.status,
      total_price: item.total_price.toString(),
      receiving_number: item.receiving_number,
      payment_method_id: item.payment_method.id,
      user_id: item.user_id,
      //@ts-ignore
      payment_verification: item.payment_verification,
    });
  };

  const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDataItem) return;

    const body = JSON.stringify({
      ...updateFormData,
    });

    updatePaymentService(selectedDataItem.id, body)
      .then((response) => {
        fetchDataList();
        successDialog(true);
      })
      .catch((error) => {});
  };

  const addFormChangeHander = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    console.log(e.target.name, e.target.value);
  };
  const updateFormChangeHander = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    console.log(e.target.name, e.target.value);
  };

  const createSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name_ar", formData.name_ar);
    fd.append("name_en", formData.name_en);
    fd.append("order", formData.order.toString());
    formData.available_days.forEach((day, index) =>
      fd.append(`available_days[${index}]`, day)
    );
    formData.available_days.forEach((time, index) =>
      fd.append(`available_times[${index}]`, time)
    );
    fd.append("is_active", formData.is_active.toString());

    addPaymentService(fd)
      .then((response) => {
        fetchDataList();
        //@ts-ignore
        successDialog(true);
        setFormData({
          name_ar: "",
          name_en: "",
          order: 0,
          is_active: 0,
          available_days: [],
          available_times: [],
        });
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

  const handleOpenImage = (e: any) => {
    // console.log('image is', e.target.src)
    setSelectedImg(e.target.src);
    setIsOpenImg(true);
  };

  useEffect(() => {
    fetchPaymentMethodList();
  }, []);

  const tableHeadActionsSlot = () => {
    return (
      <>
        <UIPrimaryDropdown
          items={[{ is_active: undefined, name: "الكل" }, ...statusList]}
          itemName="name"
          itemValue="is_active"
          onSelected={(value) => {
            fetchDataList({ is_active: value });
          }}
        >
          الحالة
        </UIPrimaryDropdown>
      </>
    );
  };
  useEffect(() => {
    fetchDataList();
  }, [page]); // runs every time `page` changes

  return (
    <>
      <div className="py-20 relative ">
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
              <td className="py-2 px-4">{item.subscription?.units ?? "-"}</td>
              <td className="py-2 px-4">{item.total_price}</td>
              <td className="py-2 px-4">{item.created_at}</td>
              <td className="py-2 px-4">
                <UIPrimaryDropdown
                  tiny={true}
                  itemName="name"
                  itemValue="is_active"
                  btnColorTailwindClass={statusDropdownColor(item.status)}
                  onSelected={(value) => {
                    updateDataItemActive(value, index, item);
                  }}
                  items={statusList}
                >
                  {statusDropdownName(item.status)}
                </UIPrimaryDropdown>
              </td>
              {/* <td className="py-2 px-4">
                                {item.subscription?.package.name ?? '-'}
                            </td> */}
              {/* <td className="py-2 px-4">
                                {item.payment_method?.name_ar ?? "-"}
                            </td> */}
              <td className="py-2 px-4">
                <div className="w-10 h-10 overflow-hidden ">
                  <img
                    src={item.payment_method.image}
                    alt=""
                    className="w-full h-full object-contain "
                  />
                </div>
              </td>
              <td className="py-2 px-4">
                <div className="w-10 h-10 overflow-hidden cursor-pointer">
                  <img
                    onClick={(item) => handleOpenImage(item)}
                    src={item.payment_verification}
                    alt=""
                    className="w-full h-full object-contain cursor-pointer"
                  />
                </div>
              </td>

              <td className="">
                <div className="flex  gap-3">
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

                  <UIBaseDialog
                    title="تعديل المدفوعات"
                    confirmHandler={() => {}}
                    confirmText="تعديل"
                    form="update-form"
                    btn={
                      <button
                        onClick={() => {
                          updateDataItem(item);
                        }}
                        className="bg-[#0094140D] p-1 rounded-lg"
                      >
                        <span className="mdi mdi-folder-edit-outline text-[#009414]"></span>
                      </button>
                    }
                  >
                    <form onSubmit={updateSubmit} id="update-form">
                      <div className="space-y-7">
                        <div className="w-full flex justify-center mb-20">
                          <FileInputImg
                            state="edit"
                            fileUrl={item.payment_verification}
                            onFileChange={(arg) => {
                              setUpdateFormData((prev) => ({
                                ...prev,
                                ["payment_verification"]: arg?.file64 ?? null,
                              }));
                            }}
                          ></FileInputImg>
                        </div>

                        <TextFieldNada
                          name="total_price"
                          type="number"
                          prependIcon="mdi mdi-notebook-edit-outline"
                          iconType="mdi"
                          handleChange={updateFormChangeHander}
                          value={updateFormData.total_price}
                          label="السعر الكلي "
                          placeholder="ادخل السعر الكلي  "
                        ></TextFieldNada>

                        <SelectInput
                          value={updateFormData.status}
                          items={statusList}
                          itemName="name"
                          itemValue="is_active"
                          label="الحالة"
                          placeholder="لختر الحالة"
                          name="is_active"
                          required={true}
                          onChange={(value) => {
                            setUpdateFormData((prev) => ({
                              ...prev,
                              ["status"]: value,
                            }));
                          }}
                        ></SelectInput>

                        <SelectInput
                          value={updateFormData.payment_method_id}
                          items={paymentMethodList}
                          itemName="name_ar"
                          itemValue="id"
                          label="طريقة الدفع"
                          placeholder=""
                          name="is_active"
                          required={true}
                          onChange={(value) => {
                            setUpdateFormData((prev) => ({
                              ...prev,
                              ["payment_method_id"]: value,
                            }));
                          }}
                        ></SelectInput>
                      </div>
                    </form>
                  </UIBaseDialog>

                  {/* {!!item.payment_verification && (
                                        <a
                                            href={item.payment_verification}
                                            target="_blank"
                                            className="bg-green-100 p-1 px-2 rounded-lg"
                                        >
                                            <span className="mdi mdi-download text-green-600"></span>
                                        </a>
                                    )} */}
                </div>
              </td>
            </tr>
          ))}
        </BaseDataTable>

        {isOpenImg && (
          <div onClick={()=>setIsOpenImg(false)} className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center py-10 z-50 ">
            <div className="relative bg-transparent max-w-full max-h-full ">
              <img
                className="w-full h-full object-contain"
                src={selectedImg}
                alt=""
              />

              <button
                onClick={() => setIsOpenImg(false)}
                className="absolute top-3 right-5 text-white bg-[#009414] rounded-full p-1 transition"
                aria-label="Close image overlay"
              >
                <span className="mdi mdi-close text-xl"></span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Checkbox, Label } from "flowbite-react";
import { Radio } from "flowbite-react";
import CustomDataTable from "@/components/data-tables/customDataTable";
import {
  activateVisitsService,
  addVisitsService,
  deleteVisitsService,
  updateVisitsService,
} from "@/services/visitService";
import DropDown from "@/components/shared/StateDropDown";
import BaseDropDown from "@/components/shared/BaseDropDown";

import { getVisitsService } from "@/services/visitService";
import { Visits } from "@/types/visits.interface";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import FileInput from "@/components/ui/form/FileInput";
import { Categories } from "@/types/categories.interface";
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import UIPrimaryDropdown from "@/components/ui/UIPrimaryDropdown";
import UIBaseDialog from "@/components/ui/UIBaseDialog";

export default function rubbush_collectors() {
  const [visitsList, setVisitsList] = useState<Visits[]>([]);
  const headerArr = [
    { text: "ID", name: "id" },
    { text: " نوع الخدمة", name: "category_name" },
    { text: " اسم المستخدم", name: "user_name" },
    { text: "  المنطقة", name: "name_ar" },
    { text: "الحالة", name: "status" },
    { text: "جامع القمامة", name: "collector_name" },
    { text: "تاريخ الزياره", name: "created_at" },
    { text: "الاجراءات", name: "image" },
  ];

  const statusList = [
    { status: 'collected', name: "مجمع" },
    { status: 'not_collected', name: "غير مجمع" },
    { status: 'pending', name: "معلق" },
    { status: 'in_progress', name: "قيد التنفيذ" },
  ];

  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [districtDays, setVisitsDays] = useState<string[]>([]);
  const [districtTime, setVisitsTime] = useState<string[]>([]);
  const [selectedVisitsDays, setSelectedVisitsDays] = useState<string[]>(
    []
  );


  const [selectedItemToUpdate, setSelectedItemToUpdate] =
    useState<Visits | null>(null);
  const router = useRouter();




  const [formData, setFormData] = useState<Visits>({
    id: 0,
    category_name: '',
    user_name: '',
    collector_name: '',
    status: '',
    user_note: '',
    collector_note: null,
    day: '',
    time_from: '',
    time_to: '',
    collected_at: null,
    address: '',
    created_at: ''
  });

  const [updateFormData, setUpdateFormData] = useState({
    id: 0,
    category_name: '',
    user_name: '',
    collector_name: '',
    status: '',
    user_note: '',
    collector_note: null,
    day: '',
    time_from: '',
    time_to: '',
    collected_at: null,
    address: '',
    created_at: ''
  });

  // const onCloseModal = () => {
  //   setOpenModal(false);

  //   setFormData({
  //     id: 0,
  //     category_name: '',
  //     user_name: '',
  //     collector_name: '',
  //     status: '',
  //     user_note: '',
  //     collector_note: null,
  //     day: '',
  //     time_from: '',
  //     time_to: '',
  //     collected_at: null,
  //     address: '',
  //     created_at: ''
  //   });
  // };

  const fetchVisitsList = ({
    search = "",
    // is_active = undefined,
    status = "",
  }: { search?: string; status?: string } = {}) => {
    // console.log(is_active);
    // const isActive =
    // is_active != undefined
    //   ? is_active
    //     ? "&is_active=" + 1
    //     : "&is_active=" + 0
    //   : "";
    const hasSearch = search ? "&search=" + search : "";
    const hasStatus = status ? "&status=" + status : "";

    const query = `?page=${page}${hasSearch}${hasStatus}`;

    getVisitsService(query).then((response) => {
      setVisitsList(response.data);
      // response.data.map((item, index) => {
      //   setVisitsDays(item.available_days);
      //   setVisitsTime(item.available_times);
      // });
      setTotalPages(response.meta.last_page);
    });
  };
  const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetchVisitsList({ search: e.target.value });
  };

  // const updateVisitsActive = (value: any, index: number) => {
  //   const service = visitsList.find((item, i) => {
  //     return index == i;
  //   });

  //   if (!service) return;

  //   const body = JSON.stringify({
  //     is_active: value,
  //   });

  //   updateVisitsService(service.id, body)
  //     .then((response) => {
  //       const arr = [...districtList];
  //       arr[index].is_active = value;

  //       setVisitsList(arr);

  //       console.log(response);
  //     })
  //     .catch((error) => { });
  // };

  // const deleteVisits = (item, selectedIndex) => {
  //   console.log(item);
  //   deleteVisitsService(item.id).then((response) => {
  //     const updatedArr = [...visitsList];
  //     updatedArr.splice(selectedIndex, 1);
  //     setVisitsList(updatedArr);
  //   });
  // };

  // const updateVisitsItem = (item: Visits) => {
  //   setUpdateFormData({
  //     id: item.id,
  //     name_ar: item.name_ar,
  //     name_en: item.name_en,
  //     order: item.order,
  //     is_active: item.is_active ? 1 : 0,
  //     //   image: item.image,
  //   });
  // };

  const updateVisitsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = JSON.stringify({
      ...updateFormData,
    });

    updateVisitsService(updateFormData.id, body)
      .then((response) => {
        fetchVisitsList();
      })
      .catch((error) => { });
  };

  const takeFormValue = (e, formName: string, name: string) => {
    if (formName == "formData") {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    } else {
      setUpdateFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    }
  };

  const takeSelectedState = (e, formName: string) => {
    const value = Number(e.target.value);
    if (formName == "formData") {
      setFormData((prev) => ({
        ...prev,
        is_active: value,
      }));
    } else {
      setUpdateFormData((prev) => ({
        ...prev,
        is_active: value,
      }));
    }
  };

  const deleteVisits = (item, selectedIndex) => {
    console.log(item);
    deleteVisitsService(item.id).then((response) => {
      const updatedArr = [...visitsList];
      updatedArr.splice(selectedIndex, 1);
      setVisitsList(updatedArr);
    });
  };

  const  toggleRubbishCollector=(item,selectedIndex)=>{
    const obj=visitsList.find((item,index)=>{
      return index==selectedIndex
    })
    if(!obj) return
    console.log('ddd',item)
    activateVisitsService(obj.id,item).then((response)=>{
console.log(response)
    })

  }
  // const addVisitsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   console.log("hiiii");
  //   e.preventDefault();
  //   const fd = new FormData();
  //   fd.append("name_ar", formData.name_ar);
  //   fd.append("name_en", formData.name_en);
  //   fd.append("order", formData.order);
  //   formData.available_days.forEach(day => fd.append("available_days[]", day));
  //   formData.available_times.forEach(time => fd.append("available_times[]", time))
  //   fd.append("is_active", formData.is_active);
  //   addVisitsService(fd).then((response) => {
  //     // setVisitsList(response.data)
  //     fetchVisitsList();
  //     onCloseModal();
  //   });
  // };

  // const handleSelectedDays = (e, selectedIndex) => {
  //   console.log(e.target.value)
  //   const selectedItem = districtDays.find((item, index) => {
  //     return index == selectedIndex;
  //   });
  //   console.log(selectedItem)
  //   if (e.target.checked && selectedItem) {
  //     const daysToAdd = selectedItem.split(',').map(day => day.trim());
  //     setSelectedVisitsDays((prev) => [...prev, ...daysToAdd]);
  //     setFormData((prev) => ({
  //       ...prev,
  //       available_days: [...prev.available_days, ...daysToAdd],
  //     }));
  //   } else {
  //     setSelectedVisitsDays((prev) =>
  //       prev.filter((item) => item !== selectedItem)
  //     );
  //   }
  //   console.log(formData);
  // };

  // const handleSelectedTime = (e, item) => {
  //   // setVisitsTime(item)
  //   setFormData((prev) => ({ ...prev, available_times: [...prev.available_times, item] }));
  // };

  const tableHeadActionsSlot = () => {
    return (
      <>
        <UIPrimaryDropdown
          itemName="name"
          itemValue="status"
          onSelected={(value) => {
            fetchVisitsList({ status: value });
          }}
          items={statusList}
        >
          الحالة
        </UIPrimaryDropdown>



        <UIBaseDialog
          title="اضافة منطقه"
          confirmHandler={() => { }}
          confirmText="اضافة"
          form="update-form"
          btn={
            <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
              <button className="bg-[#0094140D] p-1 rounded-lg">
                اضافة منطقة
              </button>
            </div>
          }
        >
          {/* <form onSubmit={addVisitsSubmit} id="update-form"> */}
          <div className="space-y-6">
            {/* <div>
                <TextFieldNada
                  name="name"
                  type="text"
                  handleChange={(e) => takeFormValue(e, "formData", "name_ar")}
                  value={formData.name_ar}
                  label=" اسم المنطقة ( عربي ) *"
                  placeholder=" اسم المنطقة  *"
                ></TextFieldNada>
              </div> */}
            <div>
              <TextFieldNada
                name="name"
                type="text"
                handleChange={(e) => takeFormValue(e, "formData", "name_en")}
                value={formData.name_en}
                label=" اسم المنطقة ( انجليزي ) *"
                placeholder=" اسم المنطقة  *"
              ></TextFieldNada>
            </div>

            <div className="relative p-2 border border-surface-light-700 rounded-2xl">
              <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                <label htmlFor="district">الحالة</label>
              </div>

              <select
                onChange={(e) => takeSelectedState(e, "formData")}
                value={formData.is_active}
                className="w-full h-full"
                id="district"
                required
              >
                {statusList.map((item, index) => (
                  <option key={index} value={item.is_active}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
                <div className="flex max-w-md flex-col gap-4" id="checkbox">
                  {districtDays.map((item, index) => (
                    <>
                      <div key={index} className="flex items-center gap-2">
                        <Checkbox
                          value={formData.available_days}
                          onChange={(e) => handleSelectedDays(e, index)}
                          id="accept"
                        />
                        <Label htmlFor="accept" className="flex">
                          {item}
                        </Label>
                      </div>
                    </>
                  ))}
                </div>
              </div> */}

            {/* <div>
                <div className="flex max-w-md flex-col gap-4">
                  {districtTime.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Radio
                        onChange={(e) => handleSelectedTime(e, item)}
                        id={item}
                        name={item}
                        value={formData.available_times}
                      />
                      <Label htmlFor={item}>{item}</Label>
                    </div>
                  ))}
                </div>
              </div> */}
          </div>
          {/* </form> */}
        </UIBaseDialog>
      </>
    );
  };
  useEffect(() => {
    fetchVisitsList();
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
          {visitsList.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4">{item.id}</td>

              <td className="py-2 px-4">{item.category_name}</td>
              <td className="py-2 px-4">{item.user_name}</td>
              <td className="py-2 px-4">{item.collector_name}</td>


              <td className="">

                <UIPrimaryDropdown
                btnColorTailwindClass={`rounded-xl text-center   ${item.status == 'collected' ? 'bg-[#31D00012] text-[#31D000]' : 'bg-[#F9285A12] text-[#F9285A]'} `}
                  itemName="name"
                  itemValue="status"
                  onSelected={(item) => {
                   toggleRubbishCollector(item,index)
                  }}
                  items={statusList}
                >
                   <span> {item.status}</span>

                </UIPrimaryDropdown>

              </td>




              <td className="py-2 px-4">{item.user_note}</td>
              <td className="py-2 px-4">{item.created_at}</td>
              {/* <td className="py-2 px-4">{item.collector_note}</td> */}
              {/* <td className="py-2 px-4">{item.day}</td> */}
              {/* <td className="py-2 px-4">{item.time_from}</td>
              <td className="py-2 px-4">{item.time_to}</td> */}
              {/* <td className="py-2 px-4">{item.collected_at}</td> */}

              <td className="">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => deleteVisits(item, index)}
                    className="bg-[#F9285A0A] p-1 rounded-lg"
                  >
                    <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                  </button>
                  <UIBaseDialog
                    title="تعديل منطقه"
                    confirmHandler={() => { }}
                    confirmText="اضافة"
                    form="update-form"
                    btn={
                      <button
                        onClick={() => {
                          updateVisitsItem(item);
                        }}
                        className="bg-[#0094140D] p-1 rounded-lg"
                      >
                        <span className="mdi mdi-folder-edit-outline text-[#009414]"></span>
                      </button>
                    }
                  >
                    <form onSubmit={updateVisitsSubmit} id="update-form">
                      <div className="space-y-6">
                        {/* <div className="mx-auto text-center">
                          <FileInput
                            fileUrl={updateFormData.image}
                            state="edit"
                            onFileChange={(file) => {
                              console.log("Received base64 in parent:", file);
                              setUpdateFormData((prev) => ({
                                ...prev,
                                image: file,
                              }));
                            }}
                          />
                        </div> */}
                        <div>
                          <TextFieldNada
                            name="name"
                            type="text"
                            handleChange={(e) =>
                              takeFormValue(e, "updateFormData", "name_ar")
                            }
                            value={updateFormData.name_ar}
                            label=" اسم المنطقة ( عربي ) *"
                            placeholder=" اسم المنطقه  *"
                          ></TextFieldNada>
                        </div>
                        <div>
                          <TextFieldNada
                            name="name"
                            type="text"
                            handleChange={(e) =>
                              takeFormValue(e, "updateFormData", "name_en")
                            }
                            value={updateFormData.name_en}
                            label=" اسم المنطقة ( انجليزي ) *"
                            placeholder=" اسم المنطقه  *"
                          ></TextFieldNada>
                        </div>

                        <div className="relative p-2 border border-surface-light-700 rounded-2xl">
                          <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
                            <label htmlFor="district">الحالة</label>
                          </div>

                          <select
                            onChange={(e) =>
                              takeSelectedState(e, "updateFormData")
                            }
                            value={Number(updateFormData.is_active)}
                            className="w-full h-full"
                            id="district"
                            required
                          >
                            {statusList.map((item, index) => (
                              <option key={index} value={item.is_active}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>
                  </UIBaseDialog>
                </div>
              </td>
            </tr>
          ))}
        </BaseDataTable>


      </div>
    </>
  );
}

"use client";
import { ReactNode, useState } from "react";
import TextFieldNada from "./form/TextFieldNada";
import MultiCheckbox from "./form/MultiCheckbox";
import RadioDropdown from "./form/RadioDropdown";
import Dropdown from "./form/Dropdown";
import BaseModal from "@/components/ui/BaseModal";
import AlertModal from "./AlertModal";
import alert from "@/assets/images/alert.png";

export default function CardNada({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    console.log(inputValue);
  };

  const addService = () => {
    console.log("submitted");
  };

  return (
    <>
      <div className="bg-background px-6 py-7 rounded-3xl shadow-[0_0_40px_0_rgb(0,0,0,0.07)] w-3/4 ms-32">
        {title ? (
          <div className="title w-fit text-foreground ">
            <p className="font-bold text-lg">{title}</p>
          </div>
        ) : (
          ""
        )}

        <div className="content mt-5">
          <BaseModal
            title={"تعديل خدمة"}
            actionBtn={"حفظ"}
            action={addService}
            openBtnLabel={"تعديل خدمة"}
            style="base-btn"
          >
            <TextFieldNada
              value={inputValue}
              handleChange={handleChange}
              label={"اسم المستخدم"}
              placeholder={"ادخل اسم المستخدم"}
              name={"user-name"}
              preIcon={"mdi mdi-account-outline"}
              type={"password"}
              required={true}
              appendIcon={"mdi mdi-account-outline"}
              iconType={"mdi"}
            />
            <MultiCheckbox
              options={[
                { value: "السبت", label: "السبت" },
                { value: "الاحد", label: "الاحد" },
                { value: "الاثنين", label: "الاثنين" },
                { value: "الثلاثاء", label: "الثلاثاء" },
                { value: "الاربعاء", label: "الاربعاء" },
                { value: "الخميس", label: "الخميس" },
              ]}
              label={"اليوم"}
              placeholder={"اختر اليوم"}
              name={"day"}
              preIcon={"mdi mdi-account-outline"}
              required={true}
              appendIcon={"mdi mdi-chevron-down"}
              iconType={"mdi"}
            />
          </BaseModal>
          <AlertModal message={"ليس لديك اذن للوصول الى هذه الصفحة"} visibility={true} />
          
          <TextFieldNada
            value={inputValue}
            handleChange={handleChange}
            label={"اسم المستخدم"}
            placeholder={"ادخل اسم المستخدم"}
            name={"user-name"}
            preIcon={"mdi mdi-account-outline"}
            type={"password"}
            required={true}
            appendIcon={"mdi mdi-account-outline"}
            iconType={"mdi"}
          />
          <MultiCheckbox
            options={[
              { value: "السبت", label: "السبت" },
              { value: "الاحد", label: "الاحد" },
              { value: "الاثنين", label: "الاثنين" },
              { value: "الثلاثاء", label: "الثلاثاء" },
              { value: "الاربعاء", label: "الاربعاء" },
              { value: "الخميس", label: "الخميس" },
            ]}
            label={"اليوم"}
            placeholder={"اختر اليوم"}
            name={"day"}
            preIcon={"mdi mdi-account-outline"}
            required={true}
            appendIcon={"mdi mdi-chevron-down"}
            iconType={"mdi"}
          />
          <RadioDropdown
            value={selectedDay}
            onChange={(val: string) => setSelectedDay(val)}
            label="الوقت"
            placeholder="اختر الوقت"
            name="time"
            required={true}
            iconType="mdi"
            preIcon="mdi mdi-account-outline"
            appendIcon="mdi mdi-chevron-down"
            options={[
              { value: "11:00", label: "11:00 م" },
              { value: "10:00", label: "10:00 ص" },
              { value: "8:00", label: "8:00 م" },
              { value: "5:00", label: "5:00 ص" },
            ]}
          />
          <MultiCheckbox
            options={[
              { value: "السبت", label: "السبت" },
              { value: "الاحد", label: "الاحد" },
              { value: "الاثنين", label: "الاثنين" },
              { value: "الثلاثاء", label: "الثلاثاء" },
              { value: "الاربعاء", label: "الاربعاء" },
              { value: "الخميس", label: "الخميس" },
            ]}
            label={"اليوم"}
            placeholder={"اختر اليوم"}
            name={"day"}
            preIcon={"mdi mdi-account-outline"}
            required={true}
            appendIcon={"mdi mdi-chevron-down"}
            iconType={"mdi"}
          />
          <Dropdown
            style="relative text-foreground p-3 border border-surface-light-700 rounded-2xl mt-6"
            dropStyle="top-[70px] start-0 z-10 w-full pe-8 ps-4 py-6"
            iconStyle="flex justify-between items-center w-full text-foreground/45"
            value={selectedItem}
            onChange={(val: string) => {
              setSelectedItem(val);
              console.log(selectedItem);
            }}
            label="الوقت"
            placeholder="اختر الوقت"
            name="time"
            required={true}
            iconType="mdi"
            preIcon="mdi mdi-account-outline"
            appendIcon="mdi mdi-chevron-down"
            options={[
              { value: "11:00", label: "11:00 م" },
              { value: "10:00", label: "10:00 ص" },
              { value: "8:00", label: "8:00 م" },
              { value: "5:00", label: "5:00 ص" },
            ]}
          />

          <div className="text-white">{children}</div>
        </div>
      </div>
    </>
  );
}

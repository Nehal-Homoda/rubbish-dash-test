"use client";
import React, { useState } from "react";
import Input from "./form/TextFieldYara";
import RadioButtonWithImg from "./form/RadioButtonWithImg";
import cashImg from "@/assets/images/cash-img.jpg";
import img from "../../assets/images/sky-night.jpg";
import instaPay from "@/assets/images/instapay.png";
import FileInput from "./form/FileInput";
import BaseRadioButton from "./form/BaseRadioButton";
import CheckBoxField from "./form/CheckBox";
import DatePicker from "./form/DatePicker";
import TimePicker from "./form/TimePicker";
import UITable from "./UITable";
import Image from "next/image";

interface UIDashCardProps {
  title?: string;
  children: React.ReactNode;
  shadowClassName?: string;
  lang: "en" | "ar";
  dict: any;
}
export default function UIDashCard({
  title,
  children,
  shadowClassName = "shadow-[0_0_0.25rem_0.5625rem_rgb(0,0,0,0.07)]",
  lang,
  dict,
}: UIDashCardProps) {
  // !inputs will be removed
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [radioBtnWithImg, setRadionBtnWithImg] = useState("");
  const [baseRadioBtn, setBaseRadioBtn] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  const users = [
    {
      id: 1,
      name: "حبيبة احمد",
      mobile: "01201988345",
      area: "حي ثان طنطا",
      subscription: "مشترك/شهرية",
      renewalDate: "21 مايو 2025",
      status: "مفعل",
    },
    {
      id: 2,
      name: "يمنى يوسف",
      mobile: "01201988345",
      area: "حي ثالث طنطا",
      subscription: "مشترك/3شهور",
      renewalDate: "21 مايو 2025",
      status: "مفعل",
    },
    {
      id: 3,
      name: "محمد احمد",
      mobile: "01201988345",
      area: "حي اول طنطا",
      subscription: "غير مشترك",
      renewalDate: "غير محدد",
      status: "مفعل",
    },
    {
      id: 4,
      name: "مريم ابراهيم",
      mobile: "01201988345",
      area: "حي ثالث طنطا",
      subscription: "مشترك/6شهور",
      renewalDate: "21 مايو 2025",
      status: "غير مفعل",
    },
    {
      id: 5,
      name: "هاجر ربيع",
      mobile: "01201988345",
      area: "حي اول طنطا",
      subscription: "غير مشترك",
      renewalDate: "غير محدد",
      status: "معلق",
    },
  ];

  const allKeys = Object.keys(users[0]);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleFile = (file: File | null) => {
    setSelectedFile(file);
  };
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);
  };
  const handleEdit = (rowData: any) => {
    console.log("Edit", rowData);
  };

  const handleDelete = (rowData: any) => {
    console.log("Delete", rowData);
  };

  const handleView = (rowData: any) => {
    console.log("View", rowData);
  };

  const handleDownload = (rowData: any) => {
    console.log("Download", rowData);
  };
  return (
    <>
      <div
        className={`rounded-2xl bg-background p-5 w-full ${shadowClassName}`} //handling various shadows
      >
        <UITable
          values={users}
          headers={allKeys}
          lang={lang}
          dict={dict}
          loading={false}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onDownload={handleDownload}
        />
      </div>

      {/* <div
        className={`rounded-2xl bg-background p-5 w-full ${shadowClassName}`} //handling various shadows
      > */}
      {/* {title && (
          <div className="card-title text-foreground text-lg font-semibold capitalize mb-4">
            {title}
          </div>
        )}
        <div className="mb-7">{children}</div> */}
      {/* inputs will be removed */}
      {/* <div className="inputs ">
          <Input
            label="اسم المستخدم"
            type="text"
            iconType="mdi"
            // appendIcon="mdi-account-outline"
            prependIcon="mdi-account-outline"
            required={true}
            placeholder="ادخل اسمك"
            value={name}
            onChange={handleNameChange}
            // errorMessage="error"
          />
          
      <CheckBoxField
        text="السبت"
        id="1"
        checked={isChecked}
        onChange={setIsChecked}
        boxSize="size-4"
        border="border-2 border-foreground/65"
        peerChecked="peer-checked:border-surface"
        checkStyle="text-surface text-[10px] "
        checkBoxRoundedValue="rounded-[4px]"
      />

          <Input
            label="الرقم السري"
            type="password"
            iconType="mdi"
            prependIcon="mdi-lock-outline"
            openedEye="mdi-eye-outline"
            closedEye=" mdi-eye-off-outline"
            required={false}
            placeholder="ادخل رقمك السري"
            value={password}
            onChange={handlePasswordChange}
            // errorMessage="error"
          />
        </div>
        <div className="inputs ">
          <RadioButtonWithImg
            image={cashImg}
            radioName="payment"
            title="محفظة"
            radioValue="cash"
            value={radioBtnWithImg}
            onChange={setRadionBtnWithImg}
          />
          <RadioButtonWithImg
            image={instaPay}
            radioName="payment"
            title="انستا باي"
            value={radioBtnWithImg}
            radioValue="instapay"
            onChange={setRadionBtnWithImg}
          />
        </div>
        <FileInput
          onFileChange={handleFile}
          title="صورة التحويل"
          // fileUrl="file:///C:/Users/XPRISTO/Downloads/Yara-Asal-Frontend-CV.pdf"
        />
        <BaseRadioButton
          text="10:00  -  11:00"
          radioName="time"
          id="1"
          radioValue="10-11"
          value={baseRadioBtn}
          onChange={setBaseRadioBtn}
        />
      

        <DatePicker
          label={dict.start}
          value={selectedDate}
          onChange={handleDateChange}
          lang={lang}
        />
        <TimePicker
          label={dict.from}
          value={selectedTime}
          onChange={handleTimeChange}
          lang={lang}
        /> */}

      {/* <p>القيمة المختارة: {radioBtnWithImg}</p>
        <p>الاسم: {name}</p>
        <p>الرقم السري: {password}</p>
        <p>فايل: {selectedFile?.name}</p>
        <p>{isChecked ? "checked " : "not checked"}</p>
        <p>{baseRadioBtn}</p>
        <p>
          {selectedDate
            ? selectedDate.toLocaleDateString()
            : "No date selected"}
        </p>
        <p>
          {selectedTime
            ? selectedTime.toLocaleTimeString()
            : "No time selected"}
        </p> */}
      {/* </div> */}
    </>
  );
}

"use client";
import React, { useState } from "react";
import Input from "./form/TextFieldYara";
import RadioButtonWithImg from "./form/RadioButtonWithImg";
import cashImg from "@/assets/images/cash-img.jpg";
import instaPay from "@/assets/images/instapay.png";
import FileInput from "./form/FileInput";
import BaseRadioButton from "./form/BaseRadioButton";
import CheckBoxField from "./form/CheckBoxField";

interface UIDashCardProps {
  title?: string;
  children: React.ReactNode;
  shadowClassName?: string;
}
export default function UIDashCard({
  title,
  children,
  shadowClassName = "shadow-[0_0_0.25rem_0.5625rem_rgb(0,0,0,0.07)]",
}: UIDashCardProps) {
  // !inputs will be removed
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [radioBtn, setRadionBtn] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleFile = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <>
      <div
        className={`rounded-2xl bg-background p-5 w-full ${shadowClassName}`} //handling various shadows
      >
        {title && (
          <div className="card-title text-foreground text-lg font-semibold capitalize mb-4">
            {title}
          </div>
        )}
        <div className="mb-7">{children}</div>
        {/* inputs will be removed */}
        <div className="inputs ">
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
            value={radioBtn}
            onChange={setRadionBtn}
          />
          <RadioButtonWithImg
            image={instaPay}
            radioName="payment"
            title="انستا باي"
            value={radioBtn}
            radioValue="instapay"
            onChange={setRadionBtn}
          />
        </div>
        <FileInput onFileChange={handleFile} />
        <BaseRadioButton text='10:00  -  11:00' radioName="time"/>
        <CheckBoxField text='السبت' />
        {/* <p>القيمة المختارة: {radioBtn}</p>
        <p>الاسم: {name}</p>
        <p>الرقم السري: {password}</p>
        <p>فايل: {selectedFile?.name}</p> */}
      </div>
    </>
  );
}

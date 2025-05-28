"use client";
import { ReactNode, useEffect, useState } from "react";
import TextFieldNada from "./form/TextFieldNada";
import MultiCheckbox from "./form/MultiCheckbox";

export default function CardNada({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    console.log(inputValue);
  };

  return (
    <>
      <div className="bg-background px-6 py-7 rounded-3xl shadow-lg w-1/2 ms-32">
        {title ? (
          <div className="title w-fit text-foreground ">
            <p className="font-bold text-lg">{title}</p>
          </div>
        ) : (
          ""
        )}

        <div className="content mt-5">
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
              { value: "red", label: "red" },
              { value: "green", label: "green" },
              { value: "blue", label: "blue" },
              { value: "yellow", label: "yellow" },
              { value: "purple", label: "purple" },
              { value: "black", label: "black" },
            ]}
            label={"نوع الخدمة"}
            placeholder={"اختر الخدمة"}
            name={"service"}
            preIcon={"mdi mdi-account-outline"}
            required={true}
            appendIcon={"mdi mdi-chevron-down"}
            iconType={"mdi"}
          />
 
          {children}
        </div>
      </div>
    </>
  );
}

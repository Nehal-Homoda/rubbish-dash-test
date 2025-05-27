"use client";
import { ReactNode, useEffect, useState } from "react";
import TextFieldNada from "./form/TextFieldNada";
import Dropdown from "./form/Dropdown";
import DatePicker from "./form/DatePicker";

export default function CardNada({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    console.log(inputValue);
  };
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    console.log(selectedOption);
  }, [selectedOption]);
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
          <Dropdown
            options={[
              { value: "red", label: "red" },
              { value: "green", label: "green" },
            ]}
            value={selectedOption}
            handleSelect={handleDropdownChange}
            label={"نوع الخدمة"}
            placeholder={"اختر الخدمة"}
            name={"service"}
            preIcon={"mdi mdi-account-outline"}
            required={true}
            appendIcon={"mdi mdi-chevron-down"}
            iconType={"mdi"}
          />
          <DatePicker
            value={inputValue}
            handleChange={handleChange}
            label={"اليوم"}
            placeholder={"اختر اليوم"}
            name={"date"}
            preIcon={"mdi mdi-calendar-month-outline"}
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

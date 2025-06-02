import React, { useRef } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
// import  "flatpickr/dist/themes/dark.css";
import { Arabic } from "flatpickr/dist/l10n/ar.js";
import { english } from "flatpickr/dist/l10n/default.js";

interface DatePickerFieldProps {
  label: string;
  required?: boolean;
  errorMessage?: string;
  value: Date;
  onChange: (date: Date) => void;
  lang?: "en" | "ar";
}

export default function DatePickerTest(props: DatePickerFieldProps) {
  const datePickerRef = useRef<any>(null);

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.flatpickr.open();
    }
  };

  return (
    <div className="border-[1px] mt-9  border-surface-light-600 bg-background relative p-3 rounded-xl">
      <label
        htmlFor=""
        className="absolute bg-background -top-4 capitalize text-base text-foreground px-2"
      >
        {props.label}
        {props.required && <span className="text-red-600 text-lg">*</span>}
      </label>
      <div className="w-full datePicker flex items-center">
        <span
          className="mdi mdi-calendar-month-outline text-lg text-foreground/50 cursor-pointer"
          onClick={handleIconClick}
        ></span>
        <Flatpickr
          value={props.value}
          onChange={(dates: Date[]) => props.onChange(dates[0] || null)}
          options={{
            dateFormat: "d F Y",
            locale: props.lang === "ar" ? Arabic : english,
          }}
          ref={datePickerRef}
          className={`border-none outline-none w-full bg-transparent ps-1 text-sm 
    dark:flatpickr-dark`}
        />
        <span
          className="mdi mdi-chevron-down text-foreground/50 text-lg cursor-pointer"
          onClick={handleIconClick}
        ></span>
      </div>
    </div>
  );
}

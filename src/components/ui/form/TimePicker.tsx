import { Calendar } from "primereact/calendar";
import React, { useRef } from "react";

interface TimePickerFieldProps {
  value: Date;
  onChange: (time: Date) => void;
  label: string;
  required?: boolean;
  errorMessage?: string;
  lang?: "en" | "ar";
}
export default function TimePicker(props: TimePickerFieldProps) {
  const timePickerRef = useRef<any>(null);

  const handleIconClick = () => {
    if (timePickerRef.current) {
      timePickerRef.current.show();
    }
  };

  return (
    <>
      <div className="border-[1px] border-surface-light-600 bg-background relative p-3 rounded-xl w-full">
        <label
          htmlFor=""
          className="absolute bg-background -top-4 capitalize text-base text-foreground px-2"
        >
          {props.label}
          {props.required && <span className="text-red-600 text-lg">*</span>}
        </label>
        <div className="flex items-center timePicker">
          <span
            className="mdi mdi-clock-time-four-outline text-lg text-foreground/50 cursor-pointer"
            onClick={handleIconClick}
          ></span>
          <Calendar
            value={props.value}
            ref={timePickerRef}
            onChange={(e) => props.onChange(e.value as Date)}
            timeOnly
            readOnlyInput
            hourFormat="12"
            placeholder="ادخل الوقت"
            className={`w-full  ps-1 `}
            inputStyle={{
              boxShadow: "none",
              border: "none",
              backgroundColor: "transparent",
              padding: "0",
              fontSize: "14px",
            }}
          />
        </div>
      </div>
      {props.errorMessage && (
        <p className="err-msg text-red-600 text-sm">{props.errorMessage}</p>
      )}
    </>
  );
}

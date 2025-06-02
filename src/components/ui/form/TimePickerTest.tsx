'use client';
import React, { useRef } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Arabic } from "flatpickr/dist/l10n/ar.js";
import { english } from "flatpickr/dist/l10n/default.js";

interface TimePickerFieldProps {
  value: Date;
  onChange: (time: Date) => void;
  label: string;
  required?: boolean;
  errorMessage?: string;
  lang: "en" | "ar";
}

export default function TimePickerTest(props: TimePickerFieldProps) {
  const timePickerRef = useRef<any>(null);

  const handleIconClick = () => {
    if (timePickerRef.current) {
      timePickerRef.current.flatpickr.open();
    }
  };

  return (
    <>
      <div className="border-[1px] mt-9 border-surface-light-600 bg-background relative p-3 rounded-xl">
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

          <Flatpickr
            ref={timePickerRef}
            value={props.value}
            onChange={(dates: Date[]) => props.onChange(dates[0] || null)}
            options={{
              enableTime: true,
              noCalendar: true,
              dateFormat: "h:i K",
              time_24hr: false,
              locale: props.lang === "ar" ? Arabic : english,
            }}
            className="border-none outline-none w-full bg-transparent ps-1 text-sm"
            placeholder={props.lang === "ar" ? "ادخل الوقت" : "Enter time"}
          />
        </div>
      </div>
      {props.errorMessage && (
        <p className="err-msg text-red-600 text-sm">{props.errorMessage}</p>
      )}
    </>
  );
}

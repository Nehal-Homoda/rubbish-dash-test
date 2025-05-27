"use client";

import { useState } from "react";

type Props = {
  value: string;
  label: string;
  placeholder: string;
  name: string;
  preIcon?: string;
  appendIcon?: string;
  errorMessage?: string;
  required?: boolean;
  iconType: "mdi" | "fa";
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function DatePicker({
  value,
  label,
  placeholder,
  name,
  preIcon,
  appendIcon,
  errorMessage,
  required,
  iconType,
  handleChange,
}: Props) {

    const [isEditing, setIsEditing] = useState(false);
    const formattedDate = value
      ? new Date(value).toLocaleDateString("ar-EG", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";
  return (
    <>
      <div className="relative px-3 py-4 border border-surface-light-700 rounded-2xl mt-4">
        <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
          <label htmlFor={name}>{label}</label>
          {required && <span className="text-red-600">*</span>}
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            {preIcon && iconType === "mdi" && (
              <span className={`${preIcon} text-2xl text-foreground/45`}></span>
            )}
            {preIcon && iconType === "fa" && (
              <i className={`${preIcon} text-2xl text-foreground/45`}></i>
            )}
            <input
              type={isEditing ? "date" : "text"}
              name={name}
              id={name}
              value={isEditing ? value : formattedDate}
              placeholder={placeholder}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setTimeout(() => setIsEditing(false), 200)}
              onChange={handleChange}
              className=" appearance-none outline-none bg-transparent w-full"
            />
            <div className="absolute end-0">
              {appendIcon && iconType === "mdi" && (
                <span
                  className={`${appendIcon} text-2xl text-foreground/45`}
                ></span>
              )}
              {appendIcon && iconType === "fa" && (
                <i className={`${appendIcon} text-2xl text-foreground/45`}></i>
              )}
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="err-msg mt-2 text-red-600 font-semibold ps-2">
          * {errorMessage}
        </div>
      )}
    </>
  );
}

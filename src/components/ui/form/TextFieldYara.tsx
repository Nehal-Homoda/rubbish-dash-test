"use client";
import React, { useState } from "react";
interface InputProps {
  label: string;
  type: "text" | "password" | "email" | "number" | "tel";
  placeholder: string;
  prependIcon: string;
  appendIcon?: string;
  closedEye?: string;
  openedEye?: string;
  value: string;
  iconType: "mdi" | "fa";
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}
export default function Input({
  label,
  type,
  placeholder,
  prependIcon,
  appendIcon,
  iconType,
  closedEye,
  openedEye,
  required,
  value,
  errorMessage,
  onChange,
}: InputProps) {
  const [inputType, setInputType] = useState(type);
  const [showPassword, setshowPassword] = useState(false);
  const handleShowPassword = () => {
    setshowPassword((prev) => !prev);
    inputType === "password" ? setInputType("text") : setInputType("password");
  };
  if (type === "password" && (!closedEye || !openedEye)) {
    console.error(
      "For password input type, both 'closedEye' and 'openedEye' icons must be provided."
    );
  }

  //!inputs are used in UICardYara
  return (
    <>
      <div>
        <div className="border-[1px] border-surface-light-600 bg-background relative p-3 rounded-xl">
          <label
            htmlFor=""
            className="absolute bg-background -top-4 capitalize text-base text-foreground px-2"
          >
            {label}{" "}
            {required && <span className="text-red-600 text-lg">*</span>}
          </label>
          <div className="flex items-center justify-between gap-2">
            <div className="prepend-icon text-foreground/65 text-xl">
              {iconType === "mdi" && (
                <span className={`mdi ${prependIcon} `}></span>
              )}
              {iconType === "fa" && <i className={`fa ${prependIcon} `}></i>}
            </div>
            <input
              type={inputType}
              className="w-full bg-background border-none outline-none text-sm placeholder:text-foreground/65"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
            <div className="append-icon text-foreground/65 text-xl">
              {iconType === "mdi" && (
                <>
                  {type !== "password" && appendIcon && (
                    <span className={`mdi ${appendIcon}`}></span>
                  )}

                  {type === "password" && closedEye && openedEye && (
                    <span
                      className={`mdi ${
                        showPassword ? openedEye : closedEye
                      }  cursor-pointer`}
                      onClick={handleShowPassword}
                    ></span>
                  )}
                </>
              )}
              {iconType === "fa" && (
                <>
                  {type !== "password" && appendIcon && (
                    <i className={`fa ${appendIcon}`}></i>
                  )}

                  {type === "password" && closedEye && openedEye && (
                    <i
                      className={`fa ${
                        showPassword ? openedEye : closedEye
                      }  cursor-pointer`}
                      onClick={handleShowPassword}
                    ></i>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {errorMessage && (
          <p className="err-msg text-red-600 text-sm">{errorMessage}</p>
        )}
      </div>
    </>
  );
}

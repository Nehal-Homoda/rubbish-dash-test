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
export default function TextField(props: InputProps) {
  const [inputType, setInputType] = useState(props.type);
  const [showPassword, setshowPassword] = useState(false);
  const handleShowPassword = () => {
    setshowPassword((prev) => !prev);
    inputType === "password" ? setInputType("text") : setInputType("password");
  };
  if (props.type === "password" && (!props.closedEye || !props.openedEye)) {
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
            {props.label}{" "}
            {props.required && <span className="text-red-600 text-lg">*</span>}
          </label>
          <div className="flex items-center justify-between gap-2">
            <div className="prepend-icon text-foreground/50 text-xl">
              {props.iconType === "mdi" && (
                <span className={`mdi ${props.prependIcon} `}></span>
              )}
              {props.iconType === "fa" && (
                <i className={`fa ${props.prependIcon} `}></i>
              )}
            </div>
            <input
              type={inputType}
              className="w-full bg-background border-none outline-none text-sm placeholder:text-foreground/65"
              placeholder={props.placeholder}
              value={props.value}
              onChange={props.onChange}
            />
            <div className="append-icon text-foreground/50 text-xl">
              {props.iconType === "mdi" && (
                <>
                  {props.type !== "password" && props.appendIcon && (
                    <span className={`mdi ${props.appendIcon}`}></span>
                  )}

                  {props.type === "password" &&
                    props.closedEye &&
                    props.openedEye && (
                      <span
                        className={`mdi ${
                          showPassword ? props.openedEye : props.closedEye
                        }  cursor-pointer`}
                        onClick={handleShowPassword}
                      ></span>
                    )}
                </>
              )}
              {props.iconType === "fa" && (
                <>
                  {props.type !== "password" && props.appendIcon && (
                    <i className={`fa ${props.appendIcon}`}></i>
                  )}

                  {props.type === "password" &&
                    props.closedEye &&
                    props.openedEye && (
                      <i
                        className={`fa ${
                          showPassword ? props.openedEye : props.closedEye
                        }  cursor-pointer`}
                        onClick={handleShowPassword}
                      ></i>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
        {props.errorMessage && (
          <p className="err-msg text-red-600 text-sm">{props.errorMessage}</p>
        )}
      </div>
    </>
  );
}

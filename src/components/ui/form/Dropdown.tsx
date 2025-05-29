import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  label: string;
  placeholder: string;
  name: string;
  options: Option[];
  preIcon?: string;
  appendIcon?: string;
  errorMessage?: string;
  required?: boolean;
  iconType: "mdi" | "fa";
  onChange: (value: string) => void;
};

export default function Dropdown({
  value,
  label,
  placeholder,
  name,
  options,
  preIcon,
  appendIcon,
  errorMessage,
  required,
  iconType,
  onChange,
}: Props) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label || "";

  return (
    <div className="relative p-3 border border-surface-light-700 rounded-2xl mt-6">
      <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
        <label htmlFor={name}>{label}</label>
        {required && <span className="text-red-600">*</span>}
      </div>

      <Listbox value={value} onChange={onChange}>
        <Listbox.Button className="w-full text-start flex items-center justify-between gap-2 bg-transparent outline-none">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              {preIcon && iconType === "mdi" && (
                <span className={`${preIcon} text-2xl text-foreground/45`} />
              )}
              {preIcon && iconType === "fa" && (
                <i className={`${preIcon} text-2xl text-foreground/45`} />
              )}

              {selectedLabel ? (
                <span className="text-foreground line-clamp-1">
                  {selectedLabel}
                </span>
              ) : (
                <span className="text-foreground/45">{placeholder}</span>
              )}
            </div>
            {appendIcon && iconType === "mdi" && (
              <span className={`${appendIcon} text-2xl text-foreground/45`} />
            )}
            {appendIcon && iconType === "fa" && (
              <i className={`${appendIcon} text-2xl text-foreground/45`} />
            )}
          </div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute top-[70px] start-0 z-10 w-full rounded-xl bg-white shadow-[0_0_40px_0_rgb(0,0,0,0.06)] overflow-hidden focus-visible:outline-none pe-8 ps-4 py-6">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className="cursor-pointer text-foreground font-semibold text-lg w-full mb-1 px-2 py-1 rounded-lg hover:bg-surface-light-100 hover:text-white transition-all"
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
      {errorMessage && (
        <div className="err-msg mt-2 text-red-600 font-semibold ps-2">
          * {errorMessage}
        </div>
      )}
    </div>
  );
}

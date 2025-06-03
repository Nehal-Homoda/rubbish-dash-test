"use client";
import { MultiSelect } from "primereact/multiselect";

type Option = {
  value: string;
  label: string;
};
type Props = {
  value: string[];
  label: string;
  placeholder: string;
  name: string;
  options: Option[];
  prependIcon?: string;
  errorMessage?: string;
  required?: boolean;
  iconType?: "mdi" | "fa";
  handleChange?: (value: string[]) => void;
};

export default function MultiCheckbox({
  value,
  label,
  placeholder,
  name,
  options,
  prependIcon,
  errorMessage,
  required,
  iconType,
  handleChange,
}: Props) {

  return (
    <>
      <div className="relative p-1.5 border border-surface-light-700 rounded-2xl mt-6">
        <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
          <label htmlFor={name}>{label}</label>
          {required && <span className="text-red-600">*</span>}
        </div>
        <div className="card flex justify-content-center items-center">
          {prependIcon && (
            <>
              {iconType === "mdi" && (
                <span
                  className={`${prependIcon} text-2xl text-foreground/45`}
                />
              )}
              {iconType === "fa" && (
                <i className={`${prependIcon} text-2xl text-foreground/45`} />
              )}
            </>
          )}

          <MultiSelect
            value={value}
            onChange={(e) => handleChange(e.value)}
            options={options}
            optionLabel="label"
            placeholder={placeholder}
            className="w-full md:w-14rem shadow-none border-none"
            panelHeaderTemplate={() => ""}
            pt={{
              panel: {
                className: "mt-3",
              },
              list: {
                className: "grid grid-cols-2 gap-3",
              },
              item: {
                className: "hover:bg-transparent bg-transparent font-semibold",
              },
              checkboxContainer: {
                className:
                  "inline-flex cursor-pointer select-none align-bottom relative me-4",
              },
            }}
          />
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

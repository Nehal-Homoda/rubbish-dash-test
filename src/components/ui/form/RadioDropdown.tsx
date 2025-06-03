import { Dropdown } from "primereact/dropdown";
import BaseRadioButton from "./BaseRadioButton";

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  label?: string;
  placeholder?: string;
  name: string;
  options: Option[];
  prependIcon?: string;
  errorMessage?: string;
  required?: boolean;
  iconType?: "mdi" | "fa";
  onChange?: (value: string) => void;
};

export default function RadioDropDown({
  value,
  label,
  placeholder,
  name,
  options,
  prependIcon,
  errorMessage,
  required,
  iconType,
  onChange,
}: Props) {

  const countryOptionTemplate = (option) => {
    return (
      <BaseRadioButton
        key={option.value}
        id={option.value}
        text={option.label}
        radioName={name}
        value={value}
        radioValue={option.value}
        onChange={onChange}
      />
    );
  };

  return (
    <div className="relative p-1.5 border border-surface-light-700 rounded-2xl mt-6">
      {label && (
        <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 font-semibold">
          <label htmlFor={name}>{label}</label>
          {required && <span className="text-red-600">*</span>}
        </div>
      )}

      <div className="card flex justify-content-center items-center">
        {prependIcon && (
          <>
            {iconType === "mdi" && (
              <span className={`${prependIcon} text-2xl text-foreground/45`} />
            )}
            {iconType === "fa" && (
              <i className={`${prependIcon} text-2xl text-foreground/45`} />
            )}
          </>
        )}
        <Dropdown
          value={value}
          onChange={onChange}
          options={options}
          optionLabel="label"
          placeholder={placeholder}
          itemTemplate={countryOptionTemplate}
          className="w-full md:w-14rem shadow-none border-none"
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
          }}
        />
      </div>
      {errorMessage && (
        <div className="err-msg mt-2 text-red-600 font-semibold ps-2">
          * {errorMessage}
        </div>
      )}
    </div>
  );
}

import { Dropdown } from "primereact/dropdown";

type Option = {
  value: string;
  label: string;
};

type Props = {
  style: string;

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

export default function BaseDropdown({
  style,
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

  return (
    <div className={style}>
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
          className="w-full md:w-14rem shadow-none border-none"
          pt={{
            panel: {
              className: "mt-3 p-2",
            },
            item: {
              className:
                "hover:bg-surface hover:text-white rounded-lg p-2 bg-transparent font-semibold ",
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

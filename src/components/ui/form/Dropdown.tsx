"use client";
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
  handleSelect?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
  handleSelect,
}: Props) {
  return (
    <>
      <div className="relative px-3 py-4 border border-surface-light-700 rounded-2xl mt-6">
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
            <select
              value={value}
              onChange={handleSelect}
              name={name}
              id={name}
              className="focus-visible:outline-none cursor-pointer appearance-none bg-transparent w-full"
            >
              {/* <option value="" disabled>
                {placeholder}
              </option> */}
              {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
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

import React from "react";
interface CheckBoxProps {
  text?: string;
  checked: boolean;
  id: string;
  onChange: (checked: boolean) => void;
  boxSize?: string;
  checkStyle?: string;
  checkBoxBg?: string;
  checkBoxRoundedValue?: string;
  border?: string;
  peerChecked?: string;
}
export default function CheckBox({
  text,
  checked,
  id,
  onChange,
  boxSize = "size-4",
  checkStyle = "text-surface text-[10px] ",
  checkBoxBg="bg-transparent",
  checkBoxRoundedValue = "rounded-[4px]",
  border = "border-2 border-foreground/65",
  peerChecked = "peer-checked:border-surface",
}: CheckBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };
  return (
    <>
      <label
        htmlFor={id}
        className="text-foreground w-fit relative flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          onChange={handleChange}
          checked={checked}
          id={id}
          className="w-5 h-4 opacity-0 peer z-40 right-0 cursor-pointer absolute"
        />
        <div
          className={`custom-checkbox ${boxSize} ${checkBoxBg}  flex justify-center items-center ${checkBoxRoundedValue} ${border} ${peerChecked}`}
        >
          {checked && (
            <span className={`mdi mdi-check ${checkStyle}  leading-none`} />
          )}
        </div>
        {text}
      </label>
    </>
  );
}

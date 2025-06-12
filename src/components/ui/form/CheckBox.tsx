import React from "react";
interface CheckBoxProps {
  text?: string;
  checked: boolean;
  id: string;
  onChange: (checked: boolean) => void;
  inverted?: boolean;
}
export default function CheckBox({
  text = "",
  checked,
  id,
  onChange,
  inverted = false,
}: CheckBoxProps) {
  return (
    <>
      <label
        htmlFor={id}
        className="text-foreground w-fit relative gap-2 cursor-pointer flex justify-center items-center "
      >
        <input
          type="checkbox"
          onChange={(e) => onChange(e.target.checked)}
          checked={checked}
          id={id}
          className="size-0 opacity-0 peer  absolute"
        />
        <div
          className={`custom-checkbox flex justify-center items-center transition-all duration-200 ${
            inverted
              ? " size-6 bg-foreground/10 peer-checked:bg-surface rounded-md "
              : " peer-checked:border-surface border-2 border-foreground/65 rounded-[4px] bg-transparent size-4"
          }`}
        ></div>
        <span
          className={`mdi mdi-check ${
            inverted ? "text-white" : "text-surface text-[10px]"
          } leading-none opacity-0 peer-checked:opacity-100 transition-opacity absolute `}
        />
        {text && <span>{text}</span>}
      </label>
    </>
  );
}

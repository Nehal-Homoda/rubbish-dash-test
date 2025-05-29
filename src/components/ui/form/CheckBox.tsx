import React from "react";
interface CheckBoxProps {
  text?: string;
  checked: boolean;
  id: string;
  onChange: (checked: boolean) => void;
  boxSize: string;
  checkStyle: string;
  checkBoxBg?: string;
  checkBoxRoundedValue?: string;
  border?: string;
  peerChecked?: string;
}
export default function CheckBox(props: CheckBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.checked);
  };
  return (
    <>
      <label
        htmlFor={props.id}
        className="text-foreground w-fit relative flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          onChange={handleChange}
          checked={props.checked}
          id={props.id}
          className="w-5 h-4 opacity-0 peer z-40 right-0 cursor-pointer absolute"
        />
        <div
          className={`custom-checkbox ${props.boxSize} ${props.checkBoxBg}  flex justify-center items-center ${props.checkBoxRoundedValue} ${props.border} ${props.peerChecked}`}
        >
          {props.checked && (
            <span
              className={`mdi mdi-check ${props.checkStyle}  leading-none`}
            />
          )}
        </div>
        {props.text}
      </label>
    </>
  );
}

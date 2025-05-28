import React from "react";
interface CheckBoxProps {
  text: string;
  checked: boolean;
  id: string;
  onChange: (checked: boolean) => void;
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
          className="  w-5 h-4 opacity-0 peer z-40  absolute"
        />
        <div
          className={`size-4 peer-checked:border-surface flex justify-center items-center  rounded-[4px] border-2 border-foreground/65`}
        >
          {props.checked && (
            <span
              className={`mdi mdi-check text-surface text-[10px]  leading-none `}
            />
          )}
        </div>
        {props.text}
      </label>
    </>
  );
}

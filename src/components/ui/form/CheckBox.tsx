import React, { ChangeEvent } from "react";
interface CheckBoxProps {
  text: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export default function CheckBox(props: CheckBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.checked);
  };
  return (
    <>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          onChange={handleChange}
          className=" outline-none accent-surface scale-110"
        />
        <span className="text-foreground">{props.text}</span>
      </div>
    </>
  );
}

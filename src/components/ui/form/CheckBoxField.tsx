import React from "react";
interface CheckBoxProps {
  text: string;
}
export default function CheckBoxField(props: CheckBoxProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <input type="checkbox" name="" className="accent-surface scale-110" id="" />
        <span className="text-foreground">{props.text}</span>
      </div>
    </>
  );
}

import React from "react";
interface BaseRadioProps {
  text: string;
  radioName: string;
}
export default function BaseRadioButton(props: BaseRadioProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name={props.radioName}
          className="accent-surface scale-150  "
        />
        <span className="text-foreground">{props.text}</span>
      </div>
    </>
  );
}

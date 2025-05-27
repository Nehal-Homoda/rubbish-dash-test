import React from "react";
interface BaseRadioProps {
  text: string;
  radioName: string;
  value: string;
  radioValue: string;
  onChange: (value: string) => void;
}
export default function BaseRadioButton(props: BaseRadioProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  };
  return (
    <>
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name={props.radioName}
          value={props.radioValue}
          checked={props.value === props.radioValue}
          onChange={handleChange}
          className="accent-surface scale-150 "
        />
        <span className="text-foreground">{props.text}</span>
      </div>
    </>
  );
}

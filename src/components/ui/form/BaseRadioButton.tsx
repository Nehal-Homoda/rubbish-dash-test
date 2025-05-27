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
    <>  <label className="text-foreground flex items-center gap-3 cursor-pointer">
        <input
          type="radio"
          name={props.radioName}
          value={props.radioValue}
          checked={props.value === props.radioValue}
          onChange={handleChange}
          className="accent-surface scale-150 "
        />
      {props.text}</label>
    </>
  );
}

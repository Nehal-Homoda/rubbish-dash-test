import React from "react";
interface BaseRadioProps {
  text: string;
  radioName: string;
  value: string;
  radioValue: string;
  id:string;
  onChange: (value: string) => void;
}
export default function BaseRadioButton(props: BaseRadioProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  };
  return (
    <>  <label htmlFor={props.id} className="text-foreground flex items-center gap-3 cursor-pointer">
        <input
          type="radio"
          id={props.id}
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

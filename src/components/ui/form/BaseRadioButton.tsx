import React from "react";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
interface BaseRadioProps {
  text: string;
  radioName: string;
  value: string;
  radioValue: string;
  id: string;
  onChange: (value: string) => void;
}
export default function BaseRadioButton(props: BaseRadioProps) {
  const handleChange = (e: RadioButtonChangeEvent) => {
    props.onChange(e.target.value);
  };
  return (
    <>
      <div className="flex items-center gap-3 cursor-pointer">
        <RadioButton
          inputId={props.id}
          name={props.radioName}
          value={props.radioValue}
          onChange={handleChange}
          checked={props.value === props.radioValue}
          pt={{
            box: {
              className: `border-2 rounded-full transition-all duration-200
        ${
          props.value === props.radioValue
            ? "border-surface bg-background "
            : "border-gray-400 bg-background"
        }`,
            },
            icon: {
              className: `${
                props.value === props.radioValue
                  ? "bg-surface"
                  : "bg-background"
              } rounded-full w-3 h-3 `,
            }
          }}
        />
        <label htmlFor={props.id} className="text-foreground cursor-pointer">
          {props.text}
        </label>
      </div>
    </>
  );
}

import Image, { StaticImageData } from "next/image";
import React from "react";

interface RadionButtonProps {
  image?: StaticImageData;
  title: string;
  value: string;
  radioValue: string;
  radioName: string;
  onChange: (value: string) => void;
  errorMessage?: string;
}

export default function RadioButtonWithImg(props: RadionButtonProps) {
  return (
    <>
      <div>
        <div className="flex items-center border-[1px] border-surface bg-foreground/5 justify-between w-full rounded-xl py-2 px-4">
          <div className="content flex items-center gap-3">
            {props.image && (
              <Image
                src={props.image}
                alt=""
                className=" object-cover rounded-full shadow-[0_0_1px_6px_rgb(0,0,0,0.04)] size-10"
              />
            )}
            <span>{props.title}</span>
          </div>
          <input
            type="radio"
            name={props.radioName}
            value={props.radioValue}
            checked={props.value === props.radioValue}
            onChange={() => props.onChange(props.radioValue)}
            className="accent-surface scale-150 border-2 "
          />
        </div>
        {props.errorMessage && (
          <p className="err-msg text-red-600 text-sm">{props.errorMessage}</p>
        )}
      </div>
    </>
  );
}

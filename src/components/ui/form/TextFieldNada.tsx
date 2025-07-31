"use client";
import moment from "moment";
import { useState } from "react";

type Props = {
    value: any;
    label: string;
    placeholder: string;
    name: string;
    type: "text" | "password" | "number" | "tel" | "email" | "time" | "date";
    prependIcon?: string;
    appendIcon?: string;
    eyeOpen?: string;
    eyeClosed?: string;
    errorMessage?: string;
    required?: boolean;
    iconType?: "mdi" | "fa";
    disabled?: boolean;
    isPrice?: boolean;
    isPercentage?:boolean;
    isDays?:boolean;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextFieldNada({
    value,
    label,
    placeholder,
    name,
    type,
    prependIcon,
    appendIcon,
    eyeOpen,
    eyeClosed,
    errorMessage = "",
    required = true,
    iconType = "mdi",
    disabled = false,
    isPrice = false,
    isPercentage = false,
    isDays=false,
    handleChange,
}: Props) {
    const [inputType, setInputType] = useState(type);
    const startDate = moment().format('YYYY-MM-DD');

    const togglePasswordVisibility = () => {
        setInputType((prev) => (prev === "password" ? "text" : "password"));
    };

    return (
        <>
            <div className="">
                <div className="relative py-3 px-5 border border-surface-light-700 rounded-2xl">
                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 text-sm font-semibold">
                        <label htmlFor={name}>{label}</label>
                        {required && <span className="text-red-600">*</span>}
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 w-full">
                            {prependIcon && (
                                <>
                                    {iconType === "mdi" && (
                                        <span
                                            className={`${prependIcon} text-2xl text-foreground/45`}
                                        />
                                    )}
                                    {iconType === "fa" && (
                                        <i
                                            className={`${prependIcon} text-2xl text-foreground/45`}
                                        />
                                    )}
                                </>
                            )}

                            <input
                                value={value}
                                onChange={handleChange}
                                name={name}
                                id={name}
                                type={inputType}
                                placeholder={placeholder}
                                className="outline-none bg-transparent w-full"
                                min={type === 'date' ? startDate : undefined}
                                readOnly={disabled}
                            />

                            {isPrice && <div className="px-4 h-full flex justify-center items-center absolute top-0 left-0  border-r ">
                                جنيه
                            </div>}
                            {isPercentage && <div className="px-4 h-full flex justify-center items-center absolute top-0 left-0  border-r ">
                                %
                            </div>}
                            {isDays && <div className="px-4 h-full flex justify-center items-center absolute top-0 left-0  border-r ">
                                يوم
                            </div>}
                        </div>

                        {type === "password" ? (
                            <div
                                className="pass-icon cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {inputType === "text" ? (
                                    iconType === "fa" ? (
                                        <i
                                            className={`${eyeOpen || "fa-regular fa-eye"
                                                } text-2xl text-foreground/45`}
                                        />
                                    ) : (
                                        <span
                                            className={`${eyeOpen || "mdi mdi-eye-outline"
                                                } text-2xl text-foreground/45`}
                                        />
                                    )
                                ) : iconType === "fa" ? (
                                    <i
                                        className={`${eyeClosed ||
                                            "fa-regular fa-eye-slash"
                                            } text-2xl text-foreground/45`}
                                    />
                                ) : (
                                    <span
                                        className={`${eyeClosed ||
                                            "mdi mdi-eye-off-outline"
                                            } text-2xl text-foreground/45`}
                                    />
                                )}
                            </div>
                        ) : (
                            appendIcon && (
                                <>
                                    {iconType === "mdi" && (
                                        <span
                                            className={`${appendIcon} text-2xl text-foreground/45`}
                                        />
                                    )}
                                    {iconType === "fa" && (
                                        <i
                                            className={`${appendIcon} text-2xl text-foreground/45`}
                                        />
                                    )}
                                </>
                            )
                        )}
                    </div>
                </div>

                {errorMessage && (
                    <div className="err-msg text-red-600 text-xs text-start font-semibold ps-2">
                        {errorMessage}
                    </div>
                )}
            </div>
        </>
    );
}

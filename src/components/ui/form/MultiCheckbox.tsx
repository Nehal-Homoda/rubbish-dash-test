"use client";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";

type Props = {
    value: string[];
    label: string;
    placeholder: string;
    name: string;
    items: any[];
    itemName?: string;
    itemValue?: string;
    prependIcon?: string;
    errorMessage?: string;
    required?: boolean;
    disbaled?: boolean;
    iconType?: "mdi" | "fa";
    onChange: (value: any[]) => void;
};

export default function MultiCheckbox({
    value,
    label,
    placeholder,
    name,
    items,
    itemName,
    itemValue,
    prependIcon,
    errorMessage,
    required,
    disbaled= false,
    iconType,
    onChange,
}: Props) {
    const [selected, setSelected] = useState<any[]>(value || []);
    const [displayedValue, setDisplayedValue] = useState("");

    const checkedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;

        const arr = checked
            ? [...selected, value]
            : [...selected.filter((v) => v !== value)];

        // @ts-ignore
        setSelected(arr);

        onChange(arr);
    };

    useEffect(() => {
        console.log("in value", value);
        if (!value || !value.length) {
            setDisplayedValue(placeholder);
            return;
        }

        if (itemValue && itemName) {
            const data = [...items].filter((item) =>
                value.includes(item[itemValue].toString())
            );

            if (data.length) {
                setDisplayedValue(data.map((d) => d[itemName]).join(", "));
            }
            return;
        }

        setDisplayedValue(value.join(", "));
    }, [value]);

    return (
        <>
            <div className="">
                <Menu as="div" className="w-full relative inline-block">
                    <div className="w-full">
                        <MenuButton disabled={disbaled}
                            className={`w-full  focus:outline-none outline-none border-none `}
                        >
                            <div className="w-full relative p-1.5 border border-surface-light-700 rounded-2xl">
                                <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 text-sm font-semibold">
                                    <label htmlFor={name}>{label}</label>
                                    {required && (
                                        <span className="text-red-600">*</span>
                                    )}
                                </div>
                                <div className="card h-8 realtive flex  items-center">
                                    {prependIcon && (
                                        <div className="mt-1">
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
                                        </div>
                                    )}
                                    <div className="px-2 truncate">
                                        {displayedValue}
                                    </div>

                                    <div className="absolute left-3">
                                        <span className="mdi mdi-chevron-down"></span>
                                    </div>
                                </div>
                            </div>
                        </MenuButton>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <MenuItems className="absolute w-full z-50 ltr:left-0 rtl:right-0 mt-2 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div className="py-5 px-1">
                                <div className="grid gap-2 grid-cols-2">
                                    {items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="hover:bg-surface-light-800 rounded-md item-box col-span-1 w-full flex gap-3 item-center py-1 px-3"
                                        >
                                            <input
                                                id={
                                                    itemValue
                                                        ? item[
                                                              itemValue
                                                          ].toString()
                                                        : item.toString()
                                                }
                                                type="checkbox"
                                                name={name}
                                                className="accent-surface w-5 h-5 mt-1"
                                                value={
                                                    itemValue
                                                        ? item[
                                                              itemValue
                                                          ].toString()
                                                        : item.toString()
                                                }
                                                checked={selected.includes(
                                                    itemValue
                                                        ? item[
                                                              itemValue
                                                          ].toString()
                                                        : item.toString()
                                                )}
                                                onChange={checkedHandler}
                                            />
                                            <label
                                                className="inline-block w-full text-start cursor-pointer select-none"
                                                htmlFor={
                                                    itemValue
                                                        ? item[
                                                              itemValue
                                                          ].toString()
                                                        : item.toString()
                                                }
                                            >
                                                {itemName
                                                    ? item[itemName]
                                                    : item}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </MenuItems>
                    </Transition>
                </Menu>

                {errorMessage && (
                    <div className="err-msg text-xs text-start text-red-600 font-semibold ps-2">
                        * {errorMessage}
                    </div>
                )}
            </div>
        </>
    );
}

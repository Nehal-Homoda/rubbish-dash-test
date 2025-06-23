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
    value: any;
    label: string;
    placeholder: string;
    name: string;
    items: any[];
    itemName?: string;
    itemValue?: string;
    prependIcon?: string;
    errorMessage?: string;
    required?: boolean;
    iconType?: "mdi" | "fa";
    onChange: (value: any) => void;
};

export default function SelectInput({
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
    iconType,
    onChange,
}: Props) {
    const [selected, setSelected] = useState<any>(value);

    const setItem = (item: any) => {
        // setSelected(itemName ? item[itemName] : item);
        onChange(itemValue ? item[itemValue] : item);
    };

    useEffect(() => {
        if (itemName && itemValue) {
            const item = items.find((item) => item[itemValue] == value);

            console.log("iteeeeee", item);

            if (item) {
                setSelected(item[itemName]);
            }
        } else {
            setSelected(value);
        }
    }, [value]);

    return (
        <>
            <Menu as="div" className="w-full relative inline-block">
                <div className="w-full">
                    <MenuButton
                        className={`w-full w-fullfocus:outline-none outline-none border-none `}
                    >
                        <div className="w-full relative  p-1.5 border border-surface-light-700 rounded-2xl">
                            <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3  text-sm font-semibold">
                                <label htmlFor={name}>{label}</label>
                                {required && (
                                    <span className="text-red-600">*</span>
                                )}
                            </div>
                            <div className="card h-8 flex justify-between items-center">
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
                                    {!!selected ? (
                                        <span className=""> {selected}</span>
                                    ) : (
                                        <span className="text-sm text-gray-400">
                                            {placeholder}
                                        </span>
                                    )}
                                </div>

                                <span className="mdi mdi-chevron-down text-2xl text-foreground/45"></span>
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
                    <MenuItems className="absolute z-50 w-full ltr:left-0 rtl:right-0 mt-2 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            {items.map((item, index) => (
                                <MenuItem key={index}>
                                    {({ active }) => (
                                        <div
                                            onClick={() => {
                                                setItem(item);
                                            }}
                                            className={` ${
                                                active
                                                    ? "bg-surface-light-800 text-surface"
                                                    : "text-gray-900"
                                            } group w-full whitespace-nowrap text-start cursor-pointer rounded-md px-5 py-3 text-sm`}
                                        >
                                            {itemName ? item[itemName] : item}
                                        </div>
                                    )}
                                </MenuItem>
                            ))}
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>

            {errorMessage && (
                <div className="err-msg mt-2 text-red-600 font-semibold ps-2">
                    * {errorMessage}
                </div>
            )}
        </>
    );
}

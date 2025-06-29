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
    searchPlaceholder?: string;
    showSearch?: boolean;
    name: string;
    items: any[];
    singleSelect?: boolean;
    itemName?: string;
    itemSubName?: string;
    itemValue?: string;
    prependIcon?: string;
    errorMessage?: string;
    required?: boolean;
    iconType?: "mdi" | "fa";
    onChange: (value: string) => void;
    onSearchChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MultiCheckboxWithSearch({
    value,
    label,
    placeholder,
    searchPlaceholder,
    showSearch = false,
    singleSelect = false,
    name,
    items,
    itemName,
    itemSubName,
    itemValue,
    prependIcon,
    errorMessage,
    required,
    iconType,
    onChange,
    onSearchChange = () => {},
}: Props) {
    const [selected, setSelected] = useState("");
    const [displayedValue, setDisplayedValue] = useState("");

    const checkedHandler = (value: any) => {
        console.log('00000000000', value)
        // @ts-ignore
        setSelected(value);

        onChange(value);
    };

    useEffect(() => {
        if (!value) {
            setDisplayedValue(placeholder);
            return;
        }

        if (itemValue && itemName) {
            const data = [...items].find((item) => item[itemValue] === value);

            if (data) {

                setDisplayedValue(data[itemName]);
            }
            return;
        }

        setDisplayedValue(value);
    }, [value]);

    return (
        <>
            <Menu as="div" className="w-full relative inline-block">
                <div className="w-full">
                    <MenuButton
                        className={`w-full w-fullfocus:outline-none outline-none border-none `}
                    >
                        <div className="w-full relative p-1.5 border border-surface-light-700 rounded-2xl">
                            <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3 text-sm font-semibold">
                                <label htmlFor={name}>{label}</label>
                                {required && (
                                    <span className="text-red-600">*</span>
                                )}
                            </div>
                            <div className="card h-8 flex justify-content-center items-center">
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
                    <MenuItems className="absolute w-full z-50 ltr:left-0 rtl:right-0 mt-2 origin-top-right divide-y max-h-[300px] overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="py-5 px-1">
                            {showSearch && (
                                <div className="input-search-wrap px-3 pb-4">
                                    <input
                                        type="text"
                                        className="w-full rounded-lg shadow-[0_0_0.5rem_#00000050] py-2 px-3 ring-1 ring-surface outline-none border-0"
                                        placeholder={searchPlaceholder}
                                        onChange={(e) => onSearchChange(e)}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                {items.map((item, index) => (
                                    <MenuItem key={index}>
                                        <div className="hover:bg-surface-light-800 rounded-md item-box col-span-1 w-full text-start py-1 px-3">
                                            <div
                                                onClick={() => {
                                                    checkedHandler(
                                                        itemValue
                                                            ? item[itemValue]
                                                            : item
                                                    );
                                                }}
                                                className="cursor-pointer flex flex-col"
                                            >
                                                {itemName
                                                    ? item[itemName]
                                                    : item}
                                                {itemSubName && (
                                                    <span className="text-gray-500 text-xs">
                                                        {item[itemSubName]}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </MenuItem>
                                ))}
                            </div>
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

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
    items: any[];
    itemName?: string;
    itemValue?: string;
    disabled?: boolean;
    btnSlot: any;
    iconType?: "mdi" | "fa";
    onChange: (value: any) => void;
};

export default function SelectInput({
    value,
    items,
    itemName,
    itemValue,
    btnSlot,
    disabled = false,
    onChange,
}: Props) {
    const [selected, setSelected] = useState<any>(value);

    const setItem = (item: any) => {
        // setSelected(itemName ? item[itemName] : item);
        onChange(itemValue ? item[itemValue] : item);
    };

    useEffect(() => {
        if (itemName && itemValue) {
            console.log('itemsss', items)
            const item = items.find((item) => {
                console.log('item issss', item)
                return item[itemValue] == value

            });

            console.log("iteeeeee", item);
            console.log("iteeeeee value", value);


            if (item) {
                setSelected(item[itemName]);
            }
        } else {
            setSelected(value);
        }
    }, [value, items]);

    return (
        <>
            <div>



                <Menu as="div" className="w-full relative inline-block">
                    <div className="w-full">
                        <MenuButton disabled={disabled}
                            className={`w-full w-fullfocus:outline-none outline-none border-none `}
                        >
                            {btnSlot}
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
                                                className={` ${active
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


              
            </div>
        </>
    );
}

import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import React, { Fragment } from "react";

type Props = {
    items: any[];
    children: React.ReactNode;
    itemName: string;
    itemValue: string;
    tiny?: boolean;
    btnColorTailwindClass?: string;
    onSelected: (value: any) => void;
};

export default function UIPrimaryDropdown({
    children,
    itemName,
    itemValue,
    items,
    tiny = false,
    btnColorTailwindClass = "bg-surface-light-800 text-surface-light hover:bg-surface-light-700",
    onSelected,
}: Props) {
    const selectHandler = (value: any) => {
        onSelected(value);
    };

    return (
        <div className="">
            <Menu as="div" className="relative inline-block">
                <div>
                    <MenuButton
                        className={`inline-flex w-full justify-center gap-1 rounded-lg text-nowrap   text-sm font-semibold focus:outline-none ${btnColorTailwindClass} ${tiny? 'py-1 px-2': 'py-3 px-5'}`}
                    >
                        {children}
                        <span className="mdi mdi-chevron-down"></span>
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
                    <MenuItems className="absolute z-50 ltr:left-0 rtl:right-0 mt-2 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            {items.map((item, index) => (
                                <MenuItem key={index}>
                                    {({ active }) => (
                                        <button
                                            onClick={() => {
                                                selectHandler(item[itemValue]);
                                            }}
                                            className={` ${
                                                active
                                                    ? "bg-surface-light-800 text-surface"
                                                    : "text-gray-900"
                                            } group w-full whitespace-nowrap text-center rounded-md px-5 py-2 text-sm`}
                                        >
                                            {item[itemName]}
                                        </button>
                                    )}
                                </MenuItem>
                            ))}
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>
        </div>
    );
}

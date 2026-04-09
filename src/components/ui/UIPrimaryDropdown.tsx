import React, { useState, useRef, useEffect } from "react";

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
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (value: any) => {
        setIsOpen(false);
        onSelected(value);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex w-full justify-center gap-1 rounded-lg text-nowrap text-sm font-semibold focus:outline-none ${btnColorTailwindClass} ${
                    tiny ? "py-1 px-2" : "py-3 px-5"
                }`}
            >
                {children}
                <span className="mdi mdi-chevron-down"></span>
            </button>

            {isOpen && (
                <div
                    className={`absolute z-50 ltr:left-0 rtl:right-0 mt-2 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none transition-all duration-100 ${
                        isOpen
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                    }`}
                >
                    <div className="px-1 py-1">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSelect(item[itemValue])}
                                className="text-gray-900 hover:bg-surface-light-800 hover:text-surface group w-full whitespace-nowrap text-center rounded-md px-5 py-2 text-sm transition-colors"
                            >
                                {item[itemName]}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

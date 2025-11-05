import React from 'react'

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState } from 'react'


type Props = {
    listItem: any[]
    itemName?: string
    itemValue?: string
    value: string
    onChange: (value: any) => void;
    label: string;
    onQueryChange?: (query: string) => void
    errorMessage: string
}

export default function ComboBoxNehal({ listItem,
    itemName,
    itemValue,
    value,
    label,
    errorMessage="",
    onChange,
    onQueryChange }: Props) {


    const [query, setQuery] = useState('')
    const filteredPeople =
        query === ''
            ? listItem
            : listItem.filter((item) => {
                return item.name.toLowerCase().includes(query.toLowerCase())
            })


    const handleSelectedItem = (item: any) => {
        setSelectedValue(item)
        if (!item) return
        onChange(itemValue ? item[itemValue] : item)
        console.log('select elemeint')


    }


    const handleInputChange = (e: any) => {
        setQuery(e.target.value)
        onQueryChange?.(e.target.value);
    }
    const [selectedValue, setSelectedValue] = useState()

    return (
        <>

            <Combobox value={selectedValue} onChange={(item) => handleSelectedItem(item)} onClose={() => setQuery('')}>
                <div className='relative'>

                    <ComboboxInput className="max-w-full w-full relative py-3 px-5 border border-surface-light-700 rounded-2xl"
                        aria-label="Assignee"
                        displayValue={(item) => {
                            if (!item) return '';
                            // @ts-ignore
                            return itemName ? item[itemName] : item;
                        }}
                        onChange={(e) => handleInputChange(e)}

                    />
                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3  text-sm font-semibold">
                        <label>{label}</label>
                    </div>
                    <div className="px-4 h-full flex justify-center items-center absolute top-0 left-0   ">
                        <span className="mdi mdi-magnify"></span>
                    </div>

                    <ComboboxOptions className="h-64 overflow-y-auto empty:invisible max-w-full px-5 py-3 cursor-pointer absolute z-50 w-full ltr:left-0 rtl:right-0 mt-2 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        {filteredPeople.map((item, index) => (
                            <ComboboxOption key={index} value={item} className="data-focus:bg-blue-100 py-4">
                                {itemName ? item[itemName] : item}
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>

                </div>
            </Combobox>

            {errorMessage && (
                <div className="err-msg text-red-600 text-xs text-start font-semibold ps-2">
                    {errorMessage}
                </div>
            )}

        </>




    )
}

import React from 'react'

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState } from 'react'


type Props = {
    listItem: any[]
    itemName?: string
    itemValue?: string
    value: string
    onChange: (value: any) => void;
    label: string
}

export default function ComboBoxNehal({ listItem,
    itemName,
    itemValue,
    value,
    label,
    onChange }: Props) {


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
    const [selectedValue,setSelectedValue]=useState(listItem[0])

    return (
        <>

            <Combobox value={selectedValue} onChange={(item) => handleSelectedItem(item)} onClose={() => setQuery('')}>
                <div className='relative'>

                    <ComboboxInput className="max-w-full w-full relative  p-1.5 border border-surface-light-700 rounded-2xl"
                        aria-label="Assignee"
                        displayValue={(item) => {
                            if (!item) return '';
                            return itemName ? item[itemName] : item;
                        }}
                        onChange={(event) => setQuery(event.target.value)}

                    />
                    <div className="label flex items-center gap-1 absolute -top-4 start-4 bg-background w-fit px-3  text-sm font-semibold">
                        <label>{label}</label>
                    </div>

                    <ComboboxOptions className="border empty:invisible max-w-full cursor-pointer">
                        {filteredPeople.map((item, index) => (
                            <ComboboxOption key={index} value={item} className="data-focus:bg-blue-100">
                                {itemName ? item[itemName] : item}
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>

                </div>
            </Combobox>

        </>




    )
}

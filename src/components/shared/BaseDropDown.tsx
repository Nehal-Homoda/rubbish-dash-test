import React from 'react'
import { Dropdown, DropdownItem } from "flowbite-react";


type Props = {
    listItem: any[],
    btnName: string
}
export default function

    ({ listItem, btnName }: Props) {
    return (
        <div>
            <Dropdown className='bg-transparent text-[#009414] hover:bg-transparent focus:outline-none ' label={btnName} dismissOnClick={false}>
                {listItem.map((item, index) => (<DropdownItem key={index}>

                    {item.text}
                </DropdownItem>))}
            </Dropdown>
        </div>
    )
}

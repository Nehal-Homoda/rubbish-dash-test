import React from 'react'
import { Dropdown, DropdownItem } from "flowbite-react";


type Props = {
    listItem: any[],
    btnName: string,
    handleFilterList?:(item,index)=>void
}
export default function

    ({ listItem, btnName,handleFilterList }: Props) {
    return (
        <div>
            <Dropdown className='bg-transparent text-[#009414] hover:bg-transparent focus:outline-none ' label={btnName} dismissOnClick={false}>
                {listItem.map((item, index) => (<DropdownItem onClick={()=>handleFilterList(item,index)} className='bg-white' key={index}>

                    {item.name_ar || item.name }
                </DropdownItem>))}
            </Dropdown>
        </div>
    )
}

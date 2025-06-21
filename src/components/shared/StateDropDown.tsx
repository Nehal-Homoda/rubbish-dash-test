'use client'

import { Dropdown, DropdownItem } from 'flowbite-react';
import React, { useEffect } from 'react'
// import 'flowbite';

// import { Dropdown, DropdownItem } from "flowbite-react";


type Props = {
    btnName: String,
    isActive: Boolean,
    handleIsActive: (item) => void

}


export default function

    ({ btnName, isActive, handleIsActive }: Props) {
    const statusList = [
        { is_active:1, text: "مفعل" },
        { is_active: 0, text: "غير مفعل" },
    ];
    useEffect(() => {
        // Dynamically import and initialize dropdown from Flowbite
        // import('flowbite').then(({ Dropdown }) => {
        //     const targetEl = document.getElementById('dropdownId');
        //     const triggerEl = document.getElementById('dropdownDefaultButton');

        //     if (triggerEl && targetEl) {
        //         new Dropdown(targetEl, triggerEl); // ✅ manually initialize it
        //     }
        // });
    }, []);

    return (
        <div>

            {/* <Dropdown label="Dropdown button" dismissOnClick={false}>
      <DropdownItem>Dashboard</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem>Earnings</DropdownItem>
      <DropdownItem>Sign out</DropdownItem>
    </Dropdown> */}

            {/* <button data-dropdown-toggle="dropdownId" id="dropdownDefaultButton" className="focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button"> {btnName} <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
            </button>

            <div id="dropdownId" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    {listItem.map((item, index) => (<li key={index}>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{item.text}</a>
                    </li>))}

                </ul>
            </div> */}

           
            <Dropdown className={` hover:bg-transparent focus:outline-none  ${isActive ? 'bg-[#0094140D] text-[#31D000]' : 'bg-[#F9285A12] text-[#F9285A]'}`} label={btnName} dismissOnClick={false}>
                {statusList.map((item) => (<DropdownItem className='bg-white' onClick={() => handleIsActive(item.is_active)}>{item.text}</DropdownItem>))}

            </Dropdown>


        </div>
    )
}

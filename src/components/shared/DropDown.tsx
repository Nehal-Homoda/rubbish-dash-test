import React from 'react'
type Props = {
    btnName: String,
    listItem: Array<any>
}
export default function

    ({ btnName, listItem }: Props) {
    return (
        <div>

            <button  id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button"> {btnName} <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
            </button>

            <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    {listItem.map((item,index) => (<li key={index}>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{item.text}</a>
                    </li>))}

                </ul>
            </div>


        </div>
    )
}

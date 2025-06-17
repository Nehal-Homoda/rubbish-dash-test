

'use client'
import React, { useState } from 'react'

type Props = {
  tableHead: string[],
  children: React.ReactNode,
  tRow: React.ReactNode,
  sendValueToParent: (value: string) => void

}
export default function
  ({ tableHead, children, tRow, sendValueToParent }: Props) {
  const [searchInput, setSearchInput] = useState('')
  const handleChangeValue = (e) => {
    setSearchInput(e.target.value)
      sendValueToParent(e.target.value)


  }
  return (
    <>
      <div className='container py-20'>
        <div className="relative px-5 py-5 overflow-x-auto shadow-md sm:rounded-lg ">

          <div className='flex justify-between mb-10 '>

            <div>
              <form className=" ">
                <div className="relative lg:min-w-96">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input value={searchInput} onChange={(e) => handleChangeValue(e)} type="search" id="default-search" className="focus:outline-none  block w-full p-4 ps-10 text-sm text-gray-900  rounded-lg bg-[#ADAAAA11]  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white " placeholder="بحث" required />
                </div>

              </form>
            </div>


            <div className='flex justify-center items-center gap-2'>
              <div className='bg-[#0094140D] cursor-pointer   py-2 text-center rounded-xl px-5 flex items-center justify-content-center '>
                <i className='mdi mdi-tray-arrow-down text-[#009414] text-xl'></i>
              </div>



              {children}
            </div>


          </div>






          <table id="default-table" className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="  text-[#38433B8F] uppercase  dark:bg-gray-700 dark:text-gray-400">

              <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 '>
                <th className="w-4 p-8">
                  <div className='flex items-center'>
                    <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-100 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>

                  </div>
                </th>

                {tableHead && tableHead.map((item, index) => (

                  <th key={index} scope="col" className="px-6 py-3">
                    {item}
                  </th>

                ))}


              </tr>
            </thead>
            <tbody>


              {/* <tr className="  bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"> */}



              {/* <td className="w-4 p-4">
                  <div className='flex items-center'>
                    <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                  </div>
                </td> */}

              {tRow}



              {/* </tr> */}

            </tbody>
          </table>

        </div>
      </div>

    </>
  )
}



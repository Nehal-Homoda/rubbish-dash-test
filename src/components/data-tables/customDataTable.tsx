"use client";
import React, { useEffect, useState } from "react";
import arrowImage from "@/assets/images/icons/arrow-left.png";

interface HeaderItem {
    text: string;
    name: string;
}

type Props = {
    tableHead: HeaderItem[];
    children: React.ReactNode;
    tRow: React.ReactNode;
    sendValueToParent: (value: string) => void;
    handleAllCheck: (e) => void;
    handleSort: (item, type: String) => void;
};

export default function ({
    tableHead,
    children,
    tRow,
    sendValueToParent,
    handleAllCheck,
    handleSort,
}: Props) {
    const [searchInput, setSearchInput] = useState("");
    const [isUpActive, setIsUpActive] = useState(false);
    const [isDownActive, setIsDownActive] = useState(false);
    const handleChangeValue = (e) => {
        setSearchInput(e.target.value);
        sendValueToParent(e.target.value);
    };

    return (
        <>
            <div className="relative px-7 py-10 overflow-x-auto shadow-[0_0_1rem_#00000015] sm:rounded-xl ">
                <div className="flex justify-between mb-10 ">
                    <div>
                        <form className=" ">
                            <div className="relative lg:min-w-96">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    value={searchInput}
                                    onChange={(e) => handleChangeValue(e)}
                                    type="search"
                                    id="default-search"
                                    className="focus:outline-none  block w-full p-4 ps-10 text-sm text-gray-900  rounded-lg bg-[#ADAAAA11]  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                                    placeholder="بحث"
                                    required
                                />
                            </div>
                        </form>
                    </div>

                    <div className="flex justify-center items-center gap-2 flex-shrink-0">
                        {children}
                        <div className="bg-[#0094140D] cursor-pointer   py-2 text-center rounded-xl px-5 flex items-center justify-content-center ">
                            <i className="mdi mdi-tray-arrow-down text-[#009414] text-xl"></i>
                        </div>
                    </div>
                </div>

                <table
                    id="default-table"
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                    <thead className="  text-[#38433B8F] uppercase  dark:bg-gray-700 dark:text-gray-400">
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 ">
                            {tableHead &&
                                tableHead.map((item, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="px-4 py-5 "
                                    >
                                        <div className="flex gap-2 text-nowrap font-bold">
                                            <div className="flex flex-col cursor-pointer space-y-0 justify-center items-center leading-none ">
                                                {/* <span
                            onClick={() => handleSort(item, 'asc')}
                            className="mdi mdi-menu-up m-0 p-0  "
                          ></span> */}
                                                {/* <span onClick={() => handleSort(item, 'desc')} className="mdi mdi-menu-down m-0 p-0  "></span> */}

                                                <div
                                                    onClick={() => [
                                                        handleSort(item, "asc"),
                                                        setIsUpActive(true),
                                                        setIsDownActive(false),
                                                    ]}
                                                    className={`arrow-img-wrap w-2 h-2  ${
                                                        !isUpActive
                                                            ? "opacity-40"
                                                            : "opacity-90"
                                                    }`}
                                                >
                                                    <img
                                                        className="arrow-img w-full h-full object-contain rotate-180"
                                                        src={arrowImage.src}
                                                        alt=""
                                                    />
                                                </div>

                                                <div
                                                    onClick={() => [
                                                        handleSort(
                                                            item,
                                                            "desc"
                                                        ),
                                                        setIsDownActive(true),
                                                        setIsUpActive(false),
                                                    ]}
                                                    className={`arrow-img-wrap w-2 h-2  ${
                                                        !isDownActive
                                                            ? "opacity-40"
                                                            : "opacity-90"
                                                    }`}
                                                >
                                                    <img
                                                        className="arrow-img w-full h-full object-contain"
                                                        src={arrowImage.src}
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <span className="cursor-pointer">
                                                {item.text}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>{tRow}</tbody>
                </table>
            </div>
        </>
    );
}

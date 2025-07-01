"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/assets/images/logo.png";
import type { ListItem } from "@/types/sidebarListItem";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Routes from "@/core/manager/route.manager";
import { useLangAndDictionary } from "@/utils/lang";

interface Props {
    isOpen: boolean;
    toggleSidebarHandler: () => void;
}

export default function DashSidebar({isOpen, toggleSidebarHandler}: Props) {
    // const [isOpen, setIsOpen] = useState(true);
    const { lang, dict } = useLangAndDictionary();
    const ListItems: ListItem[] = [
        {
            icon: "mdi-view-dashboard-outline",
            name: "home",
            path: Routes.home,
            iconType: "mdi",
        },
        {
            icon: "mdi-layers-triple-outline",
            name: "services",
            path: Routes.services,
            iconType: "mdi",
        },
        {
            icon: "mdi-image-marker-outline",
            name: "regions",
            path: Routes.regions,
            iconType: "mdi",
        },
        {
            icon: " mdi-account-multiple-outline",
            name: "users",
            path: Routes.users,
            iconType: "mdi",

            // subLinks: [
            //     // { name: "all", path: Routes.users },
            //     { name: "users", path: Routes.users },
            //     { name: "deleted", path: Routes.deletedUsers },
            // ],
        },
        {
            icon: "mdi-format-list-checkbox",
            name: "packages",
            path: Routes.packages,
            iconType: "mdi",
        },
        {
            icon: "mdi-dolly",
            name: "rubbush_collectors",
            path: Routes.rubbushCollectors,
            iconType: "mdi",
        },
        {
            icon: "mdi-truck-outline",
            name: "visits",
            path: Routes.visits,
            iconType: "mdi",
        },
        {
            icon: "mdi-wallet-bifold-outline",
            name: "payments",
            path: Routes.payments,
            iconType: "mdi",
        },
        {
            icon: "mdi-bell-outline",
            name: "notifications",
            path: Routes.notifications,
            iconType: "mdi",
        },
        {
            icon: "mdi-calendar-text-outline",
            name: "instructions",
            path: Routes.instructions,
            iconType: "mdi",
        },
        {
            icon: "mdi-book-outline",
            name: "signs",
            path: Routes.signs,
            iconType: "mdi",
        },
        {
            icon: "mdi-headset",
            name: "support",
            path: Routes.support,
            iconType: "mdi",
        },
        {
            icon: "mdi-cog-outline",
            name: "settings",
            path: Routes.settings,
            iconType: "mdi",
        },
    ];
    const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
    const toggleDropDown = (index: number) => {
        setDropdownIndex(dropdownIndex === index ? null : index);
    };
    const params = useParams();
    const pathname = usePathname();
    const langPrefix = params.lang ? `/${params.lang}` : "";
    const cleanPathname = pathname.replace(langPrefix, "") || "/";

    const openSidebar = () => {
      toggleSidebarHandler()
    };
    return (
        <div
            className={`side-bar z-50 bg-surface text-white/85 fixed top-0 md:flex duration-300 flex-col h-full
  ${
      isOpen
          ? "flex"
          : "md:translate-x-0 " +
            (params.lang === "ar" ? "translate-x-full" : "-translate-x-full")
  }
  `}
        >
            <span
                className="mdi mdi-close text-lg md:hidden py-2 px-3 cursor-pointer"
                onClick={() => openSidebar()}
            ></span>

            <div className="title uppercase flex items-center justify-start gap-2 ps-9 pt-4 md:pt-9 pb-5">
                <div className="size-7 relative bg-white rounded-full flex justify-center items-center">
                    <Image
                        src={logo}
                        alt="Logo"
                        className="size-5 object-contain"
                    />
                </div>
                <p className="font-semibold text-lg">rubbish</p>
            </div>
            <hr className="border-white/20" />
            <div className="list-items pr-5 pl-6 pt-5 overflow-y-auto flex-1 custom-scroll">
                {ListItems.map((item, index) => (
                    <div key={index}>
                        <Link
                            href={`${langPrefix}${item.path}`}
                            className={`relative flex items-center justify-between capitalize cursor-pointer text-lg hover:bg-white/10 rounded-2xl mb-2 w-60 h-12 transition-all px-4 ${
                                cleanPathname === item.path
                                    ? `bg-white/10 before:content-[''] before:absolute before:bg-white before:h-[85%] before:w-[6px] before:rounded-md ${
                                          params.lang === "en"
                                              ? "before:-left-4"
                                              : "before:-right-3"
                                      }`
                                    : ""
                            }`}
                            onClick={(e) => {
                                if (item.subLinks) e.preventDefault();
                                toggleDropDown(index);
                            }}
                        >
                            <div className="flex items-center">
                                {item.icon && item.iconType === "mdi" ? (
                                    <span
                                        className={`mdi ${item.icon}  me-2 text-2xl`}
                                    ></span>
                                ) : null}
                                {item.icon && item.iconType === "fa" ? (
                                    <i
                                        className={`fa ${item.icon}  me-2 text-2xl`}
                                    ></i>
                                ) : null}

                                <span>{dict[item.name] || item.name}</span>
                            </div>
                            {item.subLinks && (
                                <span
                                    className={`mdi mdi-chevron-down transition-all duration-200 ${
                                        dropdownIndex === index
                                            ? "-rotate-180"
                                            : "rotate-0"
                                    }`}
                                ></span>
                            )}
                        </Link>
                        <div
                            className={`drop-down flex  flex-col justify-between pr-5 pt-1 pb-3 text-sm overflow-hidden transition-all duration-500 gap-1 ${
                                dropdownIndex === index
                                    ? "max-h-[500px]"
                                    : "max-h-0 pointer-events-none "
                            }`}
                        >
                            {item.subLinks?.map((dropKey, index) => (
                                <Link
                                    href={`${langPrefix}${dropKey.path}`}
                                    key={index}
                                    className={`cursor-pointer hover:bg-white/10 py-2 px-3 rounded-xl 
                    ${cleanPathname === dropKey.path ? "text-white " : ""}
                    `}
                                >
                                    {dict[dropKey.name] || dropKey.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
// const handleFile = (file: File | null) => {
//   setSelectedFile(file);
// };
// <FileInput
//   onFileChange={handleFile}
//   title="صورة التحويل"
//   // fileUrl="file:///C:/Users/XPRISTO/Downloads/Yara-Asal-Frontend-CV.pdf"
// />;

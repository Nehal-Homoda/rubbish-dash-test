"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "@/assets/images/logo.png";
import type { ListItem } from "@/types/sidebarListItem";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useLangAndDictionary } from "@/utils/lang";
interface SideBarProps {
  isOpen: boolean;
  openSidebar: () => void;
  lang:'en'|'ar'
dict: { [key: string]: string };
}
export default function DashSidebar(props: SideBarProps) {

  const ListItems: ListItem[] = [
    {
      icon: "mdi-view-dashboard-outline",
      name: "home",
      path: "/",
      iconType: "mdi",
    },
    {
      icon: "mdi-layers-triple-outline",
      name: "services",
      path: "/services",
      iconType: "mdi",
    },
    {
      icon: "mdi-image-marker-outline",
      name: "regions",
      path: "/regions",
      iconType: "mdi",
    },
    {
      icon: " mdi-account-multiple-outline",
      name: "users",
      iconType: "mdi",

      subLinks: [
        { name: "all", path: "/all" },
        { name: "users", path: "/users2" },
        { name: "deleted", path: "/deleted" },
      ],
    },
    {
      icon: "mdi-format-list-checkbox",
      name: "packages",
      path: "/packages",
      iconType: "mdi",
    },
    {
      icon: "mdi-dolly",
      name: "rubbush_collectors",
      iconType: "mdi",
    },
    {
      icon: "mdi-truck-outline",
      name: "visits",
      path: "/visits",
      iconType: "mdi",
    },
    {
      icon: "mdi-wallet-bifold-outline",
      name: "payments",
      path: "/payments",
      iconType: "mdi",
    },
    {
      icon: "mdi-bell-outline",
      name: "notifications",
      path: "/notification",
      iconType: "mdi",
    },
    {
      icon: "mdi-calendar-text-outline",
      name: "instructions",
      path: "/instructions",

      iconType: "mdi",
    },
    {
      icon: "mdi-book-outline",
      name: "signs",
      path: "/signs",
      iconType: "mdi",
    },
    { icon: "mdi-headset", name: "support", path: "/support", iconType: "mdi" },
    {
      icon: "mdi-cog-outline",
      name: "settings",
      path: "/settings",
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

  return (
<div
  className={`side-bar z-50 bg-surface text-white fixed top-0 md:flex duration-300 flex-col h-full
  ${
    props.isOpen
      ? "flex"
      : "md:translate-x-0 " + (params.lang === "ar" ? "translate-x-full" : "-translate-x-full")
  }
  `}
>

      <span
        className="mdi mdi-close text-lg md:hidden py-2 px-3 cursor-pointer"
        onClick={() => props.openSidebar()}
      ></span>

      <div className="title uppercase flex items-center justify-start gap-2 ps-9 pt-4 md:pt-9 pb-5">
        <div className="size-7 relative bg-white rounded-full flex justify-center items-center">
          <Image src={logo} alt="Logo" className="size-5 object-contain" />
        </div>
        <p className="font-semibold text-lg">rubbish</p>
      </div>
      <hr className="border-white/20" />
      <div className="list-items pr-5 pl-6 pt-5 overflow-y-auto flex-1 custom-scroll">
        {ListItems.map((item, index) => (
          <div key={index}>
            <Link
              href={`${langPrefix}${item.path}`}
              className={`relative flex items-center justify-between capitalize cursor-pointer text-lg hover:bg-white/10 rounded-2xl mb-2 w-56 h-12 transition-all px-4 ${
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
                  <span className={`mdi ${item.icon}  me-2 text-2xl`}></span>
                ) : null}
                {item.icon && item.iconType === "fa" ? (
                  <i className={`fa ${item.icon}  me-2 text-2xl`}></i>
                ) : null}

                <span>{props.dict[item.name] || item.name}</span>
              </div>
              {item.subLinks && (
                <span
                  className={`mdi mdi-chevron-down transition-all duration-200 ${
                    dropdownIndex === index ? "-rotate-180" : "rotate-0"
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
                    ${cleanPathname === dropKey.path ? "bg-white/10 " : ""}
                    `}
                >
                  {props.dict[dropKey.name] || dropKey.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "@/assets/images/logo.png";
import type { ListItem } from "@/types/sidebarListItem";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

type DictionaryType = {
  [key: string]: string;
};
export default function DashSidebar({ dict }: { dict: DictionaryType }) {
  const ListItems: ListItem[] = [
    { icon: "mdi-view-dashboard-outline", name: "home", path: "/" },
    { icon: "mdi-layers-triple-outline", name: "services", path: "/services" },
    { icon: "mdi-image-marker-outline", name: "regions", path: "/regions" },
    {
      icon: " mdi-account-multiple-outline",
      name: "users",
      dropdown: [
        { name: "all", path: "/all" },
        { name: "users", path: "/users2" },
        { name: "deleted", path: "/deleted" },
      ],
    },
    { icon: "mdi-format-list-checkbox", name: "packages", path: "/packages" },
    { icon: "mdi-dolly", name: "rubbush_collectors", path: "/collectors" },
    { icon: "mdi-truck-outline", name: "visits", path: "/visits" },
    { icon: "mdi-wallet-bifold-outline", name: "payments", path: "/payments" },
    { icon: "mdi-bell-outline", name: "notifications", path: "/notification" },
    {
      icon: "mdi-calendar-text-outline",
      name: "instructions",
      path: "/instructions",
    },
    { icon: "mdi-book-outline", name: "signs", path: "/signs" },
    { icon: "mdi-headset", name: "support", path: "/support" },
    { icon: "mdi-cog-outline", name: "settings", path: "/settings" },
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
      className={`side-bar md:translate-x-0 z-50 bg-surface text-white fixed top-0 md:flex duration-300 flex-col h-full ${
        params.lang === "ar" ? " translate-x-full " : " -translate-x-full"
      }`}
    >
      <div className="title uppercase flex items-center justify-start gap-2 ps-9 pt-8 pb-5">
        <div className="size-7 relative bg-white rounded-full flex justify-center items-center">
          <Image src={logo} alt="Logo" className="size-5 object-contain" />
        </div>
        <p className="font-semibold text-lg">rubbish</p>
      </div>
      <hr className="border-background/20" />
      <div className="list-items pr-5 pl-6 pt-5 overflow-y-auto flex-1 custom-scroll">
        {ListItems.map((item, index) => (
          <div key={index}>
            <Link
              href={`${langPrefix}${item.path}`}
              className={`relative flex items-center justify-between capitalize cursor-pointer text-lg hover:bg-background/10 rounded-2xl mb-2 w-56 h-12 transition-all px-4 ${
                cleanPathname === item.path
                  ? `bg-background/10 before:content-[''] before:absolute before:bg-background before:h-[85%] before:w-[6px] before:rounded-md ${
                      params.lang === "en"
                        ? "before:-left-4"
                        : "before:-right-3"
                    }`
                  : ""
              }`}
              onClick={(e) => {
                if (item.dropdown) e.preventDefault();
                toggleDropDown(index);
              }}
            >
              <div className="flex items-center">
                {item.icon && (
                  <span className={`mdi ${item.icon}  me-2 text-2xl`}></span>
                )}

                <span>{dict[item.name] || item.name}</span>
              </div>
              {item.dropdown && (
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
              {item.dropdown?.map((dropKey, index) => (
                <Link
                  href={`${langPrefix}${dropKey.path}`}
                  key={index}
                  className={`cursor-pointer hover:bg-background/10 py-2 px-3 rounded-xl 
                    ${cleanPathname === dropKey.path ? "bg-background/10 " : ""}
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

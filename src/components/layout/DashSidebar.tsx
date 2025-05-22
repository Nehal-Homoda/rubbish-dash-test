import Image from "next/image";
import React from "react";
import logo from "@/assets/images/logo.png";
import type { ListItem } from "@/types/sidebarListItem";
import { getDictionary } from "@/app/dictionaries";
type DictionaryType = {
  [key: string]: string;
};
export default async function DashSidebar({
  params,
}: {
  params: { lang: "en" | "ar" };
}) {
  const ListItems: ListItem[] = [
    { icon: "", name: "home", path: "" },
    { icon: "", name: "services", path: "" },
    { icon: "", name: "regions", path: "" },
    {
      icon: "",
      name: "users",
      path: "",
      dropdown: ["الكل", "المستخدمين", "المحذوفين"],
    },
    { icon: "", name: "packages", path: "" },
    { icon: "", name: "rubbush_collectors", path: "" },
    { icon: "", name: "visits", path: "" },
    { icon: "", name: "payments", path: "" },
    { icon: "", name: "notifications", path: "" },
    { icon: "", name: "instructions", path: "" },
    { icon: "", name: "signs", path: "" },
    { icon: "", name: "support", path: "" },
    { icon: "", name: "settings", path: "" },
  ];

  const dict = await getDictionary(params.lang) as DictionaryType;
  console.log(dict);
  
  return (
    <div className="bg-surface text-white fixed top-0 right-0 h-full">
      <div className="uppercase flex items-center justify-start">
        <div className="size-7 relative bg-white rounded-full flex justify-center items-center">
          <Image src={logo} alt="Logo" className="size-6 object-contain" />
        </div>
        rubbish
      </div>
      <hr />
      {ListItems.map((item, index) => (
        <div key={index} className="capitalize cursor-pointer">
          {dict[item.name]}
          {item.dropdown && (
            <div className="drop-down">
              {item.dropdown.map((dropKey, index) => (
                <div key={index}>{dict[dropKey]}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

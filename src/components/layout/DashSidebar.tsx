import Image from "next/image";
import React from "react";
import logo from "@/assets/images/logo.png";
export default function DashSidebar() {
  const ListItems = [
    { icon: "", name: "الصفحة الرئيسية", path: "" },
    { icon: "", name: "الخدمات", path: "" },
    { icon: "", name: "المناطق", path: "" },
    { icon: "", name: "المستخدمين", path: "" },
    { icon: "", name: "الباقات", path: "" },
    { icon: "", name: "جامعي القمامة", path: "" },
    { icon: "", name: "الزيارات", path: "" },
    { icon: "", name: "المدفوعات", path: "" },
    { icon: "", name: "الاشعارات", path: "" },
    { icon: "", name: "الارشادات", path: "" },
    { icon: "", name: "اللافتات", path: "" },
    { icon: "", name: "الدعم", path: "" },
    { icon: "", name: "الاعدادات", path: "" },
  ];
  return (
    <div className="bg-surface text-white fixed top-0 right-0 h-full">
      <div className="uppercase flex items-center">
        rubbish
        <div className="size-8 relative bg-white rounded-full flex justify-center items-center">
          <Image src={logo} alt="Logo" className="size-7 object-contain" />
        </div>
      </div>
      {ListItems.map((item, index) => (
        <div key={index} className="capitalize">
          {item.name}
        </div>
      ))}
    </div>
  );
}

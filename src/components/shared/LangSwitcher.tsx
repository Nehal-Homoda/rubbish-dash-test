"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function LangSwitcher({ dict }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const toggleSwitcher = () => {
    setIsOpen(!isOpen);
  };
  const switchLang = (lang: string) => {
    toggleSwitcher();
    Cookies.remove("lang");
    Cookies.set("lang", lang, { path: "/" });
    router.replace(`/${lang}/${pathName.split("/").splice(2).join("/")}`);
  };
  return (
    <>
      <div className="relative">
        <div>
          <div
            onClick={toggleSwitcher}
            className="text-lg font-semibold text-gray-900 shadow-xs cursor-pointer"
          >
            <i className="fa-solid fa-globe"></i>
          </div>
        </div>

        {isOpen ? (
          <div className="absolute right-0 w-fit rounded-md bg-white shadow-lg">
            <div>
              <button
                onClick={() => switchLang("en")}
                className="w-full px-4 py-2 text-sm text-gray-700 rounded-md rounded-b-none hover:bg-gray-100 cursor-pointer"
              >
                {dict.english}
              </button>
              <button
                onClick={() => switchLang("ar")}
                className="w-full px-4 py-2 text-sm text-gray-700 rounded-md rounded-t-none hover:bg-gray-100 cursor-pointer"
              >
                {dict.arabic}
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

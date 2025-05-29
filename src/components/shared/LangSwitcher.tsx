"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function LangSwitcher({ dict }: { dict:any }) {
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
      <div className="relative w-fit">
        <div>
          <div
            onClick={toggleSwitcher}
            className="text-2xl font-semibold shadow-xs cursor-pointer"
          >
            <i className="fa-solid fa-globe text-foreground hover:text-surface transition-all"></i>
          </div>
        </div>

        {isOpen ? (
          <div className="absolute rtl:left-2 ltr:right-2 w-32 rounded-md bg-white shadow mt-2 z-50">
            <div>
              <button
                onClick={() => switchLang("en")}
                className="w-full px-4 py-2 font-bold text-sm text-gray-700 rounded-md rounded-b-none hover:bg-gray-100 cursor-pointer"
              >
                {dict.english}
              </button>
              <button
                onClick={() => switchLang("ar")}
                className="w-full px-4 py-2 font-bold text-sm text-gray-700 rounded-md rounded-t-none hover:bg-gray-100 cursor-pointer"
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

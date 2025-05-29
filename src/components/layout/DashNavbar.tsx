
import React from "react";
import UIThemeToggleBtn from "@/components/ui/UIThemeToggleBtn";
import LangSwitcher from "../shared/LangSwitcher";

export default async function DashNavbar({
  lang,
  dict,
}: {
  lang: "ar" | "en";
  dict: {};
}) {
  return (
    <>
      <nav className="">
        <div className="flex justify-between items-center py-6">
          <div className="title font-bold text-lg">صباح الخير</div>
          <div className="flex justify-center items-center gap-4">
            <UIThemeToggleBtn lang={lang} />
            <LangSwitcher dict={dict} />
            <button className="block md:hidden cursor-pointer">
              <span className="mdi mdi-menu text-2xl font-semibold text-foreground hover:text-surface transition-all"></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

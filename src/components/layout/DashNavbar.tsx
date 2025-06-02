import React from "react";
import UIThemeToggleBtn from "@/components/ui/UIThemeToggleBtn";
import LangSwitcher from "../shared/LangSwitcher";
import { useLangAndDictionary } from "@/utils/lang";
interface NavProps{
  isOpen:boolean;
  openSidebar:()=>void;
}
export default  function DashNavbar(props:NavProps) {
  const { lang, dict } = useLangAndDictionary();

  return (
    <>
      <nav className="">
        <div className="flex justify-between items-center py-6">
          <div className="title font-bold text-lg">صباح الخير</div>
          <div className="flex justify-center items-center gap-4">
            <UIThemeToggleBtn lang={lang} />
            <LangSwitcher dict={dict} />
            <button onClick={props.openSidebar} className="block md:hidden cursor-pointer">
              <span className="mdi mdi-menu text-2xl font-semibold text-foreground hover:text-surface transition-all"></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

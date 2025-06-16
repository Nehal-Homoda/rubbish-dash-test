"use client";
import DashSidebar from "@/components/layout/DashSidebar";
import UICard from "@/components/ui/UIDashCard";
// import DashNavbar from "@/components/layout/DashNavbar";
import { useState } from "react";
import { useLangAndDictionary } from "@/utils/lang";

type Props = {
  children: Readonly<React.ReactNode>;
};

export default function RootLayout({ children }: Props) {
  const { lang, dict } = useLangAndDictionary();

  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="dash-layout">
        <aside>
          <DashSidebar
            lang={lang}
            dict={dict}
            isOpen={isOpen}
            openSidebar={() => setIsOpen(!isOpen)}
          />
        </aside>

        <div className="md:ps-[293px] w-[97%] mx-auto">
          {/* <DashNavbar isOpen={isOpen} openSidebar={openSidebar} /> */}
          {children}
          {/* <UICard title={"الخريطة"}>example</UICard> */}
        </div>
      </div>
    </>
  );
}

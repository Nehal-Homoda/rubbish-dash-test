"use client";
import DashSidebar from "@/components/layout/DashSidebar";
import DashNavbar from "@/components/layout/DashNavbar";
import UIDialogAlert from "@/components/ui/UIDialogAlert";
import Template from "./template";
import { useState } from "react";

type Props = {
    children: Readonly<React.ReactNode>;
};

export default function RootLayout({ children }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const openSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Template>
                <div className="dash-layout">
                    <aside>
                        <DashSidebar isOpen={isOpen} toggleSidebarHandler={openSidebar} />
                    </aside>
                    <div className="md:ps-[293px] w-[97%] mx-auto">
                        <DashNavbar isOpen={isOpen} openSidebar={openSidebar} />
                        {children}
                    </div>
                    <UIDialogAlert></UIDialogAlert>
                </div>
            </Template>
        </>
    );
}

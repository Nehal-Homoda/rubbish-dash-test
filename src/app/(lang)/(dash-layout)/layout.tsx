"use client";
import DashSidebar from "@/components/layout/DashSidebar";
import DashNavbar from "@/components/layout/DashNavbar";
import UIDialogAlert from "@/components/ui/UIDialogAlert";
import Template from "./template";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { showTicketMessagesCountService } from "@/services/sharedService";

type Props = {
    children: Readonly<React.ReactNode>;
};

export default function RootLayout({ children }: Props) {
    const [loaded, setLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const openSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setLoaded(true);
    }, []);


    return (
        <>
            <Template>
                {!loaded && (
                    <div className="w-full h-[100vh] fixed z-[9999] bg-white flex items-center justify-center">
                        <div className="loader"></div>
                    </div>
                )}
                <div className="dash-layout">
                    <aside>
                        <DashSidebar
                            isOpen={isOpen}
                            toggleSidebarHandler={openSidebar}
                        />
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

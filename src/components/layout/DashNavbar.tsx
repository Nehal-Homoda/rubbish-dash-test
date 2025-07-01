import React from "react";
import UIThemeToggleBtn from "@/components/ui/UIThemeToggleBtn";
// import LangSwitcher from "../shared/LangSwitcher";
import { useLangAndDictionary } from "@/utils/lang";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores/store";
import { logout } from "@/stores/authSlice";
interface Props {
    isOpen: boolean;
    openSidebar: () => void;
}
export default function DashNavbar({ isOpen, openSidebar }: Props) {
    const { lang, dict } = useLangAndDictionary();
    const dispatch = useDispatch<AppDispatch>();

    const logoutHander = () => {
        dispatch(logout())
        window.location.reload()
    };

    return (
        <>
            <nav className="">
                <div className="flex justify-between items-center py-6 px-5">
                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={openSidebar}
                            className="block md:hidden cursor-pointer"
                        >
                            <span className="mdi mdi-menu text-2xl font-semibold text-foreground hover:text-surface transition-all"></span>
                        </button>
                        <div className="title font-bold text-lg">
                            صباح الخير 👋
                        </div>
                    </div>
                    <button onClick={logoutHander} className="cursor-pointer">
                        <span className="mdi mdi-logout text-2xl font-semibold text-surface"></span>
                    </button>
                    {/* <UIThemeToggleBtn lang={lang} /> */}
                    {/* <LangSwitcher dict={dict} /> */}
                </div>
            </nav>
        </>
    );
}

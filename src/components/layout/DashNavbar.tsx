"use client"

import React, { useEffect, useState } from "react";
import UIThemeToggleBtn from "@/components/ui/UIThemeToggleBtn";
// import LangSwitcher from "../shared/LangSwitcher";
import { useLangAndDictionary } from "@/utils/lang";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { logout } from "@/stores/authSlice";
    import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Props {
    isOpen: boolean;
    openSidebar: () => void;
}
export default function DashNavbar({ isOpen, openSidebar }: Props) {
    const { lang, dict } = useLangAndDictionary();
    const title = useSelector(
        (state: RootState) => state.authReducer.title
    );
    const dispatch = useDispatch<AppDispatch>();
    const router=useRouter()
   
    // const [title, setTitle] = useState('')

    const logoutHander = () => {
        dispatch(logout())
        // router.push('/auth/login') 
        window.location.reload()
    };


    useEffect(() => {
        // const storedTitle = Cookies.get("title");

        // setTitle(storedTitle ? JSON.parse(storedTitle) : null)
    }, [])

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
                            {title}
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

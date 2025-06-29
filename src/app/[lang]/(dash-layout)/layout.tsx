"use client";
import DashSidebar from "@/components/layout/DashSidebar";
import UICard from "@/components/ui/UIDashCard";
// import DashNavbar from "@/components/layout/DashNavbar";
import { useEffect, useState } from "react";
import { useLangAndDictionary, useLocalePath } from "@/utils/lang";
import UIDialogAlert from "@/components/ui/UIDialogAlert";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { useRouter } from "next/navigation";
import { enter } from "@/stores/authSlice";

type Props = {
    children: Readonly<React.ReactNode>;
};

export default function RootLayout({ children }: Props) {
    const { lang, dict } = useLangAndDictionary();
    const isLoggedIn = useSelector(
        (state: RootState) => state.authReducer.isLoggedIn
    );
    const isEnter = useSelector(
        (state: RootState) => state.authReducer.isEnter
    );
    const dispatch = useDispatch<AppDispatch>();

    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const localePath = useLocalePath();

    const openSidebar = () => {
        setIsOpen(true);
    };

    useEffect(() => {
        dispatch(enter());
    }, [dispatch]);

    useEffect(() => {
        // if (isEnter) {
        //     if (!isLoggedIn) {
        //         router.replace(localePath("/auth/login"));
        //     }
        // }
    }, [isEnter]);

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

                <UIDialogAlert></UIDialogAlert>
            </div>
        </>
    );
}

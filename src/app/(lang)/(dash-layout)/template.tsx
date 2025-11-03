"use client";
import { meService } from "@/services/authServices";
import { showTicketMessagesCountService } from "@/services/sharedService";
import { enter } from "@/stores/authSlice";
import { changeCount } from "@/stores/authSlice"
import { AppDispatch, RootState } from "@/stores/store";
import { useLocalePath } from "@/utils/lang";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
    children: React.ReactNode;
};

export default function Template({ children }: Props) {
    const isEnter = useSelector(
        (state: RootState) => state.authReducer.isEnter
    );
    const isLoggedIn = useSelector(
        (state: RootState) => state.authReducer.isLoggedIn
    );
    const count = useSelector(
        (state: RootState) => state.authReducer.count
    );
    const dispatch = useDispatch<AppDispatch>();
    const localePath = useLocalePath();
    const router = useRouter();

    // const getMe = async () => {

    //     // meService()
    //     //     .then(resposne => {

    //     //     })
    //     //     .catch(error => {
    //     //         router.push(localePath('/auth/login'))
    //     //     })

    //     if (!isEnter) {
    //         return <div className="loader"></div>
    //     }

    // }


    useEffect(() => {
        dispatch(enter());

    }, [dispatch]);

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         showTicketMessagesCountService().then((response) => {
    //             dispatch(changeCount(response.data.open_tickets_count))
    //         })
    //     }, 1000);

    //     return () => clearInterval(intervalId);
    // }, []);




    useEffect(() => {
        if (isEnter && !isLoggedIn) {
            router.push(localePath('/auth/login'))
        }

    }, [isEnter, isLoggedIn, localePath, router]);


    if (!isEnter) {
        return <div className="w-full h-[100vh] fixed z-[9999] bg-white flex items-center justify-center">
            <div className="loader"></div>
        </div>

    }
    if (!isLoggedIn) {
        return null
    }



    return <div>{children}</div>;
}

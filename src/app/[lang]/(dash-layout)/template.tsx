"use client";
import { meService } from "@/services/authServices";
import { enter } from "@/stores/authSlice";
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
    const dispatch = useDispatch<AppDispatch>();
    const localePath = useLocalePath();
    const router = useRouter();

    const getMe = async () => {

        meService()
        .then(resposne => {

        })
        .catch(error => {
            router.push(localePath('/auth/login'))
        })
    }

    useEffect(() => {
        console.log("recall");

        if (isEnter) {
            getMe();
        }
     }, [isEnter]);

    useEffect(() => {
        dispatch(enter());
    }, [dispatch]);


    return <div>{children}</div>;
}

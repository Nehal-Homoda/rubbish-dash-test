"use client";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import UIBtn from "@/components/ui/UIBtn";
import Link from "next/link";
import React, { useState } from "react";

export default function AuthLoginPage() {
    const [formDate, setFormData] = useState({
        email: "",
        password: "",
    });
    const [formDateError, setFormDataError] = useState({
        email: "",
        password: "",
    });

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <>
            <div className="w-full min-h-screen pt-20">
                <div className="container">
                    <div className="grid md:grid-cols-2">
                        <div className="col-span-1">
                            <h3 className="text-2xl font-bold">
                                مرحباً بعودتك مرة اخري 👋
                            </h3>
                            <p className="text-muted font-semibold">
                                قم بإدخال بياناتك لتسجيل الدخول
                            </p>
                            <form className="pt-20">
                                <div className="input-wrap mb-14">
                                    <TextFieldNada
                                        errorMessage={formDateError.email}
                                        label="الايميل"
                                        name="email"
                                        type="email"
                                        placeholder="example@mail.com"
                                        value={formDate.email}
                                        handleChange={inputChangeHandler}
                                    ></TextFieldNada>
                                </div>
                                <div className="input-wrap">
                                    <TextFieldNada
                                        errorMessage={formDateError.password}
                                        label="كلمة المرور"
                                        name="password"
                                        type="password"
                                        placeholder="ادخل كلمة المرور"
                                        value={formDate.password}
                                        handleChange={inputChangeHandler}
                                    ></TextFieldNada>
                                </div>

                                <div className="mt-1 mb-12 text-end">
                                    <Link className="text-surface underline" href={'/auth/reset-password'}>نسيت كلمة المرور؟</Link>
                                </div>


                                <button className="base-btn block w-full">
                                    سجل الدخول
                                </button>
                                
                            </form>
                        </div>
                        <div className="col-span-1"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

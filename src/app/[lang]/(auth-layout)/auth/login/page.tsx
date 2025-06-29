"use client";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import { loginService } from "@/services/authServices";
import React, { useState } from "react";
import logoImg from '@/assets/images/login-img.png'
import { useRouter } from "next/navigation";

export default function AuthLoginPage() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",


    });
    const [formDataError, setFormDataError] = useState({
        email: "",
        password: "",
    });
    const router=useRouter()

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleLoginSubmit = (e: any) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('email', formData.email)
        fd.append('password', formData.password)
        // fd.append('phone', formData.phone)

        loginService(fd).then((response) => {
            router.push('/')
            console.log('login', response)
        })

    }

    return (
        <>
            <div className="w-full min-h-screen pt-20">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-20">


                        <div className="col-span-1 pt-28">
                            <h3 className="text-2xl font-bold">
                                مرحباً بعودتك مرة اخري 👋
                            </h3>
                            <p className="text-muted font-semibold">
                                قم بإدخال بياناتك لتسجيل الدخول
                            </p>
                            <form onSubmit={handleLoginSubmit} className="pt-20">



                                <div className="input-wrap mb-14">
                                    <TextFieldNada
                                        errorMessage={formDataError.email}
                                        label="البريد الالكتروني"
                                        name="email"
                                        type="email"
                                        placeholder="ادخل البريد الالكتروني"
                                        value={formData.email}
                                        handleChange={inputChangeHandler}
                                    ></TextFieldNada>
                                </div>
                                <div className="input-wrap mb-14">
                                    <TextFieldNada
                                        errorMessage={formDataError.password}
                                        label="الرقم السري"
                                        name="password"
                                        type="password"
                                        placeholder="الرقم السري"
                                        value={formData.password}
                                        handleChange={inputChangeHandler}
                                    ></TextFieldNada>
                                </div>
                                {/* <div className="input-wrap mb-14">
                                    <TextFieldNada
                                        errorMessage={formDataError.phone}
                                        label="رقم الموبايل"
                                        name="phone"
                                        type="number"
                                        placeholder="رقم الموبايل"
                                        value={formData.phone}
                                        handleChange={inputChangeHandler}
                                    ></TextFieldNada>
                                </div> */}

                                {/* <div className="input-wrap">
                                    <TextFieldNada
                                        errorMessage={formDateError.password}
                                        label="كلمة المرور"
                                        name="password"
                                        type="password"
                                        placeholder="ادخل كلمة المرور"
                                        value={formDate.password}
                                        handleChange={inputChangeHandler}
                                    ></TextFieldNada>
                                </div> */}

                                {/* <div className="mt-1 mb-12 text-end">
                                    <Link className="text-surface underline" href={'/auth/reset-password'}>نسيت كلمة المرور؟</Link>
                                </div> */}


                                <button className="base-btn block w-full">
                                    سجل الدخول
                                </button>

                            </form>
                        </div>
                        <div className="col-span-1">

                            <div className="w-full h-full">
                                <img className="w-full h-full object-cover" src={logoImg.src} alt="" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

"use client";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import { loginService } from "@/services/authServices";
import React, { useState } from "react";
import logoImg from "@/assets/images/login-img.png";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores/store";
import { login } from "@/stores/authSlice";
import { successDialog, validateAllInputs, validateInput } from "@/utils/shared";
import * as Yup from "yup";



interface FormDataInputs {
    email: string;
    password: string;
}
interface FormDataInputErrors {
    email: string | null;
    password: string | null;
}

export default function AuthLoginPage() {
    const dispatch = useDispatch<AppDispatch>()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    // const [formDataError, setFormDataError] = useState({
    //     email: "",
    //     password: "",
    // });
    const router = useRouter();

    const formSchema = Yup.object().shape({
        email: Yup.string().required("البريد الإلكتروني هو حقل مطلوب").email("البريد الإلكتروني هو حقل مطلوب"),
        password: Yup.string().required("كلمة المرور هو حقل مطلوب").min(6, "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"),
    });

    const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
        email: "",
        password: "",
    });
    const [errorMsg, setErrorMsg] = useState("");


    const inputChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>, inputName: keyof FormDataInputs) => {

        const value = e.target.value
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        const message = await validateInput(formSchema, inputName, value);
        setFormErrors((prev) => ({
            ...prev,
            [inputName]: message ? message : "",
        }));
        console.log('message', message)
    };

    const handleLoginSubmit = async (e: any) => {
        e.preventDefault();
        const validateResult = await validateAllInputs<FormDataInputs>(
            formSchema,
            formData
        );
        if (!validateResult) return;
        setFormErrors({ ...validateResult.outputResult });
        if (validateResult.isInvalid) return;
        const fd = new FormData();
        fd.append("email", formData.email);
        fd.append("password", formData.password);
        // fd.append('phone', formData.phone)

        loginService(fd).then((response) => {
            successDialog(true)
            router.push("/");
            console.log("login", response);
            dispatch(login(response))

        })
            .catch(error => {
                setErrorMsg(error?.message);
            })
    };

    return (
        <>
            <div className="w-full h-screen overflow-hidden  pt-20 ">
                <div className="lg:grid grid-cols-2 gap-8">
                    <div className="lg:col-span-1 col-span-2  lg:pt-36 pt-40  lg:px-24 px-12 ">
                        <h3 className="text-2xl font-bold">
                            مرحباً بعودتك مرة اخري 👋
                        </h3>
                        <p className="text-[#ADAAAA]">
                            قم بإدخال بياناتك لتسجيل الدخول
                        </p>
                        <form
                            onSubmit={handleLoginSubmit}
                            className="pt-20"
                        >
                            {errorMsg && (
                                <div className="mb-5">
                                    <span className="text-red-800"> {errorMsg}</span>

                                </div>
                            )}

                            <div className="input-wrap mb-14">
                                <TextFieldNada
                                    errorMessage={formErrors.email || ""}
                                    label="البريد الالكتروني"
                                    name="email"
                                    type="email"
                                    placeholder="ادخل البريد الالكتروني"
                                    value={formData.email}
                                    handleChange={(e) => inputChangeHandler(e, 'email')}
                                ></TextFieldNada>
                            </div>
                            <div className="input-wrap mb-14">
                                <TextFieldNada
                                    errorMessage={formErrors.password || ""}
                                    label="الرقم السري"
                                    name="password"
                                    type="password"
                                    placeholder="الرقم السري"
                                    value={formData.password}
                                    handleChange={(e) => inputChangeHandler(e, 'password')}
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
                    <div className="  lg:col-span-1 lg:block hidden ">
                        <div className="w-full h-full ">
                            <img
                                className="w-full h-full object-contain"
                                src={logoImg.src}
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

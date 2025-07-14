import React, { useEffect, useState } from "react";
import TextFieldNada from "../ui/form/TextFieldNada";
import { Users } from "@/types/auth.interface";
import { updateUserService } from "@/services/userService";
import { AppUser } from "@/types/user.interface";
import { useRouter } from "next/navigation";
import { successDialog } from "@/utils/shared";

//@ts-ignore

type Props = {
    user: Users | null;
    // confirmHandler: () => void
};
export default function personalData({ user }: Props) {
    useEffect(() => {
        console.log("user", user);
    });

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });

    const router = useRouter();

    useEffect(() => {
        setFormData({
            //@ts-ignore
            name: user.name,
            //@ts-ignore
            phone: user.phone,
        });
    }, []);

    const updateUser = () => {
        const body = JSON.stringify({
            name: formData.name,
            phone: formData.phone,
        });
        //@ts-ignore
        updateUserService(user.id, body).then((response) => {
            successDialog(true);
            // router.push('/users')

            console.log(response);
        });
    };

    const reset = () => {
        setFormData({
            //@ts-ignore
            name: user.name,
            //@ts-ignore
            phone: user.phone,
        });
    };

    return (
        <div className="container">
            <div className="bg-white rounded-xl  px-3 ">
                <h3 className="font-bold py-14">الملف الشخصي</h3>

                <div className="grid grid-cols-2 lg:gap-5">
                    <div className="lg:col-span-1 col-span-2 input-wrap mb-14">
                        <TextFieldNada
                            label="اسم المستخدم"
                            name="phone"
                            type="text"
                            placeholder="اسم المستخدم"
                            value={formData.name}
                            handleChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    ["name"]: e.target.value,
                                }));
                            }}
                        ></TextFieldNada>
                    </div>
                    <div className="lg:col-span-1 col-span-2 input-wrap mb-14">
                        <TextFieldNada
                            label="رقم الموبايل"
                            name="phone"
                            type="number"
                            placeholder="رقم الموبايل"
                            value={formData.phone}
                            handleChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    ["phone"]: e.target.value,
                                }));
                            }}
                        ></TextFieldNada>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-4">
                    <button
                        type="submit"
                        className="base-btn min-w-[200px]"
                        onClick={updateUser}
                    >
                        حفظ التغييرات
                    </button>
                    <button
                        onClick={() => {
                            reset();
                        }}
                        type="button"
                        className="btn-secondary px-10"
                    >
                        الغاء
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";
import Payment from "@/components/user-tabs/payment";
import PersonalData from "@/components/user-tabs/personalData";
import Subscription from "@/components/user-tabs/subscription";
import { getUserByIdService } from "@/services/userService";
import { User, Users } from "@/types/auth.interface";
import { AppUser } from "@/types/user.interface";
import React, { useEffect, useState } from "react";
import header_bg_img from "@/assets/images/bg/profile-header-bg.jpg";
import { useParams } from "next/navigation";
import { getQueryParam } from "@/utils/shared";
import AddNewSubscription from "@/components/user-tabs/AddNewSubscription";

// type Props = {
//   params: { id: number }
// }

type Btn = {
    name: string;
    type: string;
};

export default function page() {
    const id = () => {
        return getQueryParam("id") || "";
    };
    const [user, setUser] = useState<Users | null>(null);
    const [selectedBtn, setSelectedBtn] = useState<Btn | null>(null);
    const [type, setType] = useState("personal-data");
    const [showAddSubscription, setShowAddSubscription] = useState(false);
    const fetchUserById = () => {
        getUserByIdService(id()).then((response) => {
            //@ts-ignore
            setUser(response.data);
        })
        .catch(() => {

        })
    };
    const btnTabs = [
        { name: "الملف الشخصي", type: "personal-data" },
        { name: "الاشتراك", type: "subscription" },
        { name: "المدفوعات", type: "payment" },
    ];
    //@ts-ignore
    const handleChangeBtnType = (item) => {
        setType(item);
    };
    

    useEffect(() => {
        if (selectedBtn) {
            selectedBtn.type = "personal-data";
        }
    }, []);
    useEffect(() => {
        fetchUserById();
    }, []);
    return (
        <>
            <div className="container py-20">
                <div
                    className="profile-header relative w-full  bg-cover overflow-hidden rounded-2xl "
                    style={{
                        background: `url(${header_bg_img.src}) no-repeat center center`,
                    }}
                >
                    <div className=" rounded-xl  text-white  bg-surface/90 py-8 px-7">
                        <div className="mb-10">
                            <h4 className="mb-1 font-bold ">{user?.name}</h4>
                            <p>
                                {!!user &&
                                    (user.subscription_name
                                        ? user?.subscription_name
                                        : "غير مشترك")}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {btnTabs.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        handleChangeBtnType(item.type)
                                    }
                                    className={`relative ${
                                        type == item.type
                                            ? "before:absolute  before:w-full before:h-[0.5] before:-bottom-3 before:bg-white "
                                            : ""
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    {type == "personal-data" && user && (
                        <PersonalData user={user} />
                    )}

                    {type == "subscription" && user && (
                        // 
                        !user.has_subscription ? <>
                            <div className="py-5 text-end">
                                <button onClick={() => {setShowAddSubscription(true)}} className="delete-subscription-btn text-nowrap  px-7 py-2 bg-surface-light-800 hover:bg-surface-light-700 ring-1 ring-surface duration-150 text-surface rounded-md">
                                    <span className="">
                                        اضافة اشتراك
                                    </span>
                                    <span className="mdi mdi-plus ms-2"></span>
                                </button>
                            </div>
                            {
                                showAddSubscription && <AddNewSubscription getNewUser={(value) => {setUser(value)}} user={user} />
                            }
                            
                        </> : <>
                        <Subscription user={user} />
                        </>
                    )}
                    {type == "payment" && user && <Payment user={user} />}
                </div>
            </div>
        </>
    );
}

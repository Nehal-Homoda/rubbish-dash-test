"use client";
import {
    showCollectorService,
} from "@/services/collectorsService";
import { Collector } from "@/types/collectors.interface";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import header_bg_img from "@/assets/images/bg/profile-header-bg.jpg";
import Link from "next/link";
import { useLocalePath } from "@/utils/lang";
import { getQueryParam } from "@/utils/shared";



export default function CollectorHeader() {
    const id = () => {
        return getQueryParam('id') || '';
    };
    const [collector, setCollector] = useState<Collector | null>(null);
    const router = useRouter();
    const btnTabs = [
        { name: "الملف الشخصي", type: "personal-data" },
        { name: " الزيارات", type: "visits" },
    ];
    const pathname = usePathname();
    const currentTab = pathname.includes("visits")
        ? "visits"
        : "personal-data";
    const [type, setType] = useState("personal-data");
    const fetchCollector = async () => {

        showCollectorService(id())
            .then((response) => {
                setCollector(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    };
    const handleChangeBtnType = (item: string) => {
        if (item === "visits") {
            router.push(`/rubbush-collectors/details/visits?id=${collector?.id}`);
            setType(item)
        } else {
            setType(item);
        }
    };

    useEffect(() => {
        fetchCollector();
    }, []);
    return (
        <div className="py-20">
            <div
                className="profile-header relative w-full  bg-cover overflow-hidden rounded-2xl mb-10"
                style={{
                    background: `url(${header_bg_img.src}) no-repeat center center`,
                }}
            >
                <div className="w-full h-full bg-surface/90 py-10 px-7 text-white">
                    <div className="">
                        <h5 className="text-2xl font-bold mb-3">
                            {collector?.name ?? "****"}
                        </h5>
                        <p className="">
                            {collector && collector.districts && collector.districts.length ? collector.districts
                                .map((item) => item.name)
                                .join(" | ") : "***"}
                        </p>
                    </div>
                    <div className="flex flex-col-reverse lg:flex-row gap-5 items-center lg:items-end justify-between mt-20">
                        <div className="flex items-center gap-4">

                            {btnTabs.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        handleChangeBtnType(item.type)
                                    }
                                    className={`relative ${currentTab == item.type
                                            ? "before:absolute before:w-full before:h-[0.5] before:-bottom-3 before:bg-white"
                                            : ""
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}

                        </div>

                        <div className="flex gap-5">
                            <div className="bg-white/20 py-3 px-3 text-center rounded-xl">
                                <h5 className="font-semibold mb-1 text-nowrap">
                                    الطلبات المجمعة
                                </h5>
                                <h5 className="font-bold">
                                    {collector?.count_collected ?? 0}
                                </h5>
                            </div>
                            <div className="bg-white/20 py-3 px-3 text-center rounded-xl">
                                <h5 className="font-semibold mb-1 text-nowrap">
                                    الطلبات الغير المجمعة
                                </h5>
                                <h5 className="font-bold">
                                    {collector?.count_not_collected ?? 0}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

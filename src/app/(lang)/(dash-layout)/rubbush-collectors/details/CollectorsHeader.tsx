"use client";
import {
    showCollectorService,
} from "@/services/collectorsService";
import { Collector } from "@/types/collectors.interface";
import { usePathname } from "next/navigation";
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
    const localePath = useLocalePath();
    const pathname = usePathname();

    const fetchCollector = async () => {
        
        showCollectorService(id())
            .then((response) => {
                setCollector(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
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
                            {collector && collector.districts.length ? collector.districts
                                .map((item) => item.name)
                                .join(" | ") : "***"}
                        </p>
                    </div>
                    <div className="flex flex-col-reverse lg:flex-row gap-5 items-center lg:items-end justify-between mt-20">
                        <div className="flex gap-3 font-semibold">
                            <Link
                                className={` text-nowrap flex-grow-0 flex-shrink-0 underline-offset-[0.75rem] ${
                                    pathname ==
                                    localePath(
                                        `/rubbush-collectors/details/profile?id=${collector?.id}`
                                    )
                                        ? "underline"
                                        : ""
                                }`}
                                href={localePath(
                                    `/rubbush-collectors/details/profile?id=${collector?.id}`
                                )}
                            >
                                الملف الشخصي
                            </Link>
                            <Link
                                className={` text-nowrap flex-grow-0 flex-shrink-0  underline-offset-[0.75rem] ${
                                    pathname ==
                                    localePath(
                                        `/rubbush-collectors/details/visits?id=${collector?.id}`
                                    )
                                        ? "underline"
                                        : ""
                                }`}
                                href={localePath(
                                    `/rubbush-collectors/details/visits?id=${collector?.id}`
                                )}
                            >
                                الزيارات
                            </Link>
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

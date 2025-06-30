"use client";
import FileInputImg from "@/components/ui/form/FileInputImg";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import {
    showCollectorService,
    updateCollectorService,
} from "@/services/collectorsService";
import { getDistrictService } from "@/services/districtService";
import { Collector } from "@/types/collectors.interface";
import { District } from "@/types/district.interface";
import { successDialog } from "@/utils/shared";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import header_bg_img from "@/assets/images/bg/profile-header-bg.jpg";
import Link from "next/link";
import { useLocalePath } from "@/utils/lang";

type Props = {
    content: React.ReactNode;
};

export default function CollectorLayout({ content }: Props) {
    const { id } = useParams<{ id: string }>();
    const [collector, setCollector] = useState<Collector | null>(null);
    const [distrects, setDistrects] = useState<District[]>([]);
    const localePath = useLocalePath();
    const pathname  = usePathname();
    type UpdateFormDataType = {
        name: string;
        phone: string;
        password?: string;
        district_id: string[];
        image: null | string;
    };
    const [updateFormData, setUpdateFormData] = useState<UpdateFormDataType>({
        name: "",
        phone: "",
        password: "",
        district_id: [],
        image: null,
    });
    const updateFormChangeHander = (
        e: React.ChangeEvent<HTMLInputElement>,
        index?: number
    ) => {
        setUpdateFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        console.log(e.target.name, e.target.value);
    };
    const fetchCollector = async () => {
        showCollectorService(id)
            .then((response) => {
                setCollector(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    };
    const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!collector) return;

        const form = { ...updateFormData };

        if (!form.password) {
            //@ts-ignore
            delete form.password;
        }

        const body = JSON.stringify({
            ...form,
        });

        updateCollectorService(id, body)
            .then((response) => {
                setCollector(response.data);
                successDialog(true);
            })
            .catch((error) => {});
    };
    const fetchDistrects = () => {
        getDistrictService()
            .then((response) => {
                setDistrects(response.data);
            })
            .catch((error) => {});
    };
    const resetHandler = () => {
        if (!collector) {
            setUpdateFormData({
                name: "",
                phone: "",
                password: "",
                district_id: [],
                image: null,
            });
            return;
        }
        setUpdateFormData({
            name: collector.name,
            phone: collector.name,
            password: "",
            district_id: collector.districts.map((item) => item.id.toString()),
            image: collector.image || "",
        });
    };
    useEffect(() => {
        fetchCollector();
        fetchDistrects();
    }, []);
    useEffect(() => {
        resetHandler();
    }, [collector]);
    useEffect(() => {
        console.log(updateFormData);
    }, [updateFormData]);
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
                            {collector?.districts
                                .map((item) => item.name)
                                .join(" | ") ?? "***"}
                        </p>
                    </div>
                    <div className="flex flex-col-reverse lg:flex-row gap-5 items-center lg:items-end justify-between mt-20">
                        <div className="flex gap-3 font-semibold">
                            <Link
                                className={` text-nowrap flex-grow-0 flex-shrink-0 underline-offset-[0.75rem] ${pathname == localePath(`/rubbush-collectors/${collector?.id}/profile`) ? 'underline': ''}`}
                                href={localePath(`/rubbush-collectors/${collector?.id}/profile`)}
                            >
                                الملف الشخصي
                            </Link>
                            <Link
                                className={` text-nowrap flex-grow-0 flex-shrink-0  underline-offset-[0.75rem] ${pathname == localePath(`/rubbush-collectors/${collector?.id}/visits`) ? 'underline': ''}`}
                                href={localePath(`/rubbush-collectors/${collector?.id}/visits`)}
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
            {content}
        </div>
    );
}

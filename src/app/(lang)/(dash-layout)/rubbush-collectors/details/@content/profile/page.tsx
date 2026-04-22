"use client";
import FileInputImg from "@/components/ui/form/FileInputImg";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import * as Yup from "yup"
import {
    showCollectorService,
    updateCollectorService,
} from "@/services/collectorsService";
import { getDistrictService } from "@/services/districtService";
import { Collector } from "@/types/collectors.interface";
import { District } from "@/types/district.interface";
import { getQueryParam, successDialog, validateAllInputs } from "@/utils/shared";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";




type UpdateFormDataType = {
    name: string;
    phone: string;
    password?: string;
    district_id: string[];
    image: File | null | string;
};

export default function page() {
    const id = () => {
        return getQueryParam('id') || '';
    };
    const [collector, setCollector] = useState<Collector | null>(null);
    const [distrects, setDistrects] = useState<District[]>([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [formErrors, setFormErrors] = useState({
        name: "",
    });
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
        showCollectorService(id())
            .then((response) => {
                setCollector(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    };
    const formSchema = Yup.object().shape({
        name: Yup.string().required('الاسم مطلوب'),

    })

    const updateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!collector) return;
        setErrorMsg('')
        const validateResult = await validateAllInputs(
            formSchema,
            updateFormData
        );
        if (!validateResult) return;

        setFormErrors({ ...validateResult.outputResult });

        if (validateResult.isInvalid) return;



        const form = { ...updateFormData };

        if (!form.password) {
            //@ts-ignore
            delete form.password;
        }

        const body = JSON.stringify({
            ...form,
        });

        updateCollectorService(id(), body)
            .then((response) => {
                console.log('response issssssssssss', response)
                setCollector(response.data);
                successDialog(true);
            })
            .catch((error) => { setErrorMsg(error?.message) });
    };
    const fetchDistrects = () => {
        getDistrictService()
            .then((response) => {
                setDistrects(response.data);
            })
            .catch((error) => { });
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
            phone: collector.phone,
            password: "",
            district_id: collector.districts?.map((item) => item.id.toString()),
            image: collector.image || '',
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
        <div className="relative px-7 py-10 shadow-[0_0_1rem_#00000015] rounded-xl">
            <h5 className="text-lg font-bold mb-10">الملف الشخصي</h5>
            <form onSubmit={updateSubmit} id="update-form">

                {errorMsg && (
                    <div className="mb-6 text-start border border-red-800 bg-red-100 px-3 py-3 rounded-lg">
                        <span className="text-red-800 error-alert">
                            {" "}
                            {errorMsg}
                        </span>
                    </div>
                )}
                <div className="space-y-7">
                    {/* {collector && <div className="mb-16">
                        <FileInputImg
                            state="edit"
                            //@ts-ignore
                            fileUrl={updateFormData.image as string}
                            onFileChange={(arg) => {
                                setUpdateFormData((prev) => ({
                                    ...prev,
                                    ["image"]: arg?.file64 ?? null,
                                }));
                            }}
                        ></FileInputImg>
                    </div>} */}
                    <TextFieldNada
                        name="name"
                        type="text"
                        handleChange={updateFormChangeHander}
                        value={updateFormData.name}
                        label=" اسم  "
                        placeholder=" اسم الجامع القمامة  "
                        errorMessage={formErrors.name}
                    ></TextFieldNada>
                    <TextFieldNada
                        name="phone"
                        type="number"
                        handleChange={updateFormChangeHander}
                        value={updateFormData.phone}
                        label=" رقم الموبايل "
                        placeholder=" رقم موبايل الجامع القمامة  "
                    ></TextFieldNada>
                    <TextFieldNada
                        name="password"
                        type="password"
                        handleChange={updateFormChangeHander}
                        value={updateFormData.password}
                        label=" كلمة المرور"
                        placeholder=" ادخل كلمة المرور "
                    ></TextFieldNada>
                    {!!distrects.length && (
                        <MultiCheckbox
                            items={distrects}
                            itemName="name_ar"
                            itemValue="id"
                            onChange={(value) => {
                                setUpdateFormData((prev) => ({
                                    ...prev,
                                    ["district_id"]: value,
                                }));
                            }}
                            label="المنطقة"
                            placeholder="ا خترالمنطقة"
                            name="district_id"
                            required
                            value={updateFormData.district_id}
                        ></MultiCheckbox>
                    )}
                </div>

                <div className="mt-16 flex items-center justify-center gap-4">
                    <button type="submit" className="base-btn min-w-[200px]">
                        حفظ التغيرات
                    </button>
                    <button
                        type="button"
                        className="btn-secondary px-10"
                        onClick={resetHandler}
                    >
                        الغاء
                    </button>
                </div>
            </form>
        </div>
    );
}

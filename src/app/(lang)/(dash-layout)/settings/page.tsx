"use client";
import TextFieldNada from "@/components/ui/form/TextFieldNada";
import {
    getSettingService,
    updateSettingService,
} from "@/services/settingService";
import { Setting } from "@/types/setting.interface";
import { successDialog } from "@/utils/shared";
import React, { useEffect, useState } from "react";
import { ToggleSwitch } from "flowbite-react";
type FormDataType = {
    ios_version: string;
    android_version: string;
    vodafone_cash_number: number | string;
    instapay_number: string;
    recycle_price_by_kilo: number | string
    grace_period_visits: number | string;
    ticket_auto_reply_message_ar: string;
    ticket_auto_reply_enabled: number | string
};
export default function settings() {
    const [settingData, setSettingData] = useState<Setting | null>(null);
    const [formData, setFormData] = useState<FormDataType>({
        ios_version: "",
        android_version: "",
        vodafone_cash_number: 0,
        instapay_number: '',
        recycle_price_by_kilo: 0,
        grace_period_visits: 0,
        ticket_auto_reply_enabled: 0,
        ticket_auto_reply_message_ar: ""
    });
    const fetchSettingData = () => {
        getSettingService()
            .then((response) => {
                setSettingData(response.data);

                setFormData({
                    android_version: response.data.android_version || "",
                    ios_version: response.data.ios_version || "",
                    vodafone_cash_number: response.data.wallet_number
                        ? response.data.wallet_number.toString()
                        : "0",
                    instapay_number: response.data.instapay_number || "",
                    recycle_price_by_kilo: response.data.recycle_price_by_kilo != null
                        ? response.data.recycle_price_by_kilo.toString()
                        : "0",
                    ticket_auto_reply_message_ar: response.data.ticket_auto_reply_message_ar || "",
                    ticket_auto_reply_enabled: response.data.ticket_auto_reply_enabled || 0,
                    grace_period_visits:
                        response.data.grace_period_visits != null
                            ? response.data.grace_period_visits.toString()
                            : "0", // ✅ ADD THIS
                });
            })
            .catch(() => { });
    };
    const [TicketAutoReplyEnabled, setTicketAutoReplyEnabled] = useState(false);



    const [iosForceUpdate, setIosForceUpdate] = useState(false);
    const [androidForceUpdate, setAndroidForceUpdate] = useState(false);

    const addFormChangeHander = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const body = JSON.stringify({
            ...formData,
        });

        updateSettingService(body)
            .then((response) => {
                fetchSettingData();
                successDialog(true);
            })
            .catch((error) => { });
    };

    const resetHandler = () => {
        setFormData({
            android_version: settingData?.android_version || "",
            ios_version: settingData?.ios_version || "",
            vodafone_cash_number: settingData?.wallet_number ? settingData.wallet_number.toString() : '0',
            instapay_number: settingData?.instapay_number || "",
            recycle_price_by_kilo: settingData?.recycle_price_by_kilo ? settingData?.recycle_price_by_kilo : '0',
            ticket_auto_reply_enabled: settingData?.ticket_auto_reply_enabled ? settingData?.ticket_auto_reply_enabled : 0,
            ticket_auto_reply_message_ar: settingData?.ticket_auto_reply_message_ar || "",
            grace_period_visits: settingData?.grace_period_visits ? settingData?.grace_period_visits : '0'

        });
    };


    const handleCheckAutoReply = (value: boolean) => {

        setTicketAutoReplyEnabled(!TicketAutoReplyEnabled)
        setFormData((prev) => ({
            ...prev,
            ["ticket_auto_reply_enabled"]: value ? 1 : 0,
        }));
    };
    const handleCheckForceAndroidUpdate = (value: boolean) => {
        setAndroidForceUpdate(!androidForceUpdate)
        setFormData((prev) => ({
            ...prev,
            ["force_update_android_version"]: value ? 1 : 0,
        }));
    };
    const handleCheckForceIosUpdate = (value: boolean) => {
        setIosForceUpdate(!iosForceUpdate)
        setFormData((prev) => ({
            ...prev,
            ["force_update_android_version"]: value ? 1 : 0,
        }));
    };


    useEffect(() => {
        fetchSettingData();
    }, [])

    return (
        <>
            <div className="py-20">
                <form
                    onSubmit={updateSubmit}
                    className="px-7 py-10 shadow-[0_0_1rem_#00000015] rounded-xl  space-y-10"
                >
                    <h5 className="text-lg font-bold">
                        الاعدادات الفنية
                    </h5>
                    <TextFieldNada
                        name="ios_version"
                        type="text"
                        handleChange={addFormChangeHander}
                        value={formData.ios_version}
                        label=" اصدار IOS"
                        placeholder=" ادخل الاصدار "
                    ></TextFieldNada>
                    <TextFieldNada
                        name="android_version"
                        type="text"
                        handleChange={addFormChangeHander}
                        value={formData.android_version}
                        label=" اصدار Android"
                        placeholder=" ادخل الاصدار "
                    ></TextFieldNada>
                    <TextFieldNada
                        name="vodafone_cash_number"
                        type="text"
                        handleChange={addFormChangeHander}
                        value={formData.vodafone_cash_number}
                        label=" رقم فودافون كاش"
                        placeholder=" ادخل رقم فودافون كاش "
                    ></TextFieldNada>
                    <TextFieldNada
                        name="instapay_number"
                        type="text"
                        handleChange={addFormChangeHander}
                        value={formData.instapay_number}
                        label=" رقم انستاباي"
                        placeholder=" ادخل رقم انستاباي "
                    ></TextFieldNada>
                    <TextFieldNada
                        name="recycle_price_by_kilo"
                        type="number"
                        handleChange={addFormChangeHander}
                        value={formData.recycle_price_by_kilo}
                        label="سعر الكليو"
                        placeholder=""
                    ></TextFieldNada>
                    <TextFieldNada
                        name="grace_period_visits"
                        type="number"
                        handleChange={addFormChangeHander}
                        value={formData.grace_period_visits}
                        label="مدة فترة السماح"
                        placeholder=""
                    ></TextFieldNada>

                    <ToggleSwitch
                        checked={TicketAutoReplyEnabled}
                        label="اظهار رسالة الدعم"
                        onChange={(value) => handleCheckAutoReply(value)}
                    />
                    {TicketAutoReplyEnabled &&
                        <TextFieldNada
                            name="ticket_auto_reply_message_ar"
                            type="text"
                            handleChange={addFormChangeHander}
                            value={formData.ticket_auto_reply_message_ar}
                            label="رسالة الدعم"
                            placeholder=""
                        ></TextFieldNada>
                    }




                    <ToggleSwitch
                        checked={androidForceUpdate}
                        label="تحديث Android"
                        onChange={(value) => handleCheckForceAndroidUpdate(value)}
                    />
                    <ToggleSwitch
                        checked={iosForceUpdate}
                        label="تحديث IOS"
                        onChange={(value) => handleCheckForceIosUpdate(value)}
                    />



                    {/* <TextFieldNada
                        name="name_en"
                        type="text"
                        handleChange={addFormChangeHander}
                        value={formData.name_en}
                        label=" رابط سياسه الخصوصية"
                        placeholder=" ادخل رابط سياسه الخصوصية "
                    ></TextFieldNada>
                    <TextFieldNada
                        name="name_en"
                        type="text"
                        handleChange={addFormChangeHander}
                        value={formData.name_en}
                        label=" رابط عن التطبيق"
                        placeholder=" ادخل رابط عن التطبيق "
                    ></TextFieldNada>
                    <TextFieldNada
                        name="name_en"
                        type="text"
                        handleChange={addFormChangeHander}
                        value={formData.name_en}
                        label=" رابط الشروط و الاحكام"
                        placeholder=" ادخل رابط الشروط و الاحكام "
                    ></TextFieldNada> */}

                    <div className="mt-4 flex items-center justify-center gap-4">
                        <button
                            type="submit"
                            className="base-btn min-w-[200px]"
                        >
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
        </>
    );
}

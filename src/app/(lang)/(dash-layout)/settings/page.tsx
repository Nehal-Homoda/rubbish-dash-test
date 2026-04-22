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
    recycle_price_by_kilo: number | string;
    grace_period_visits: number | string;
    ticket_auto_reply_message_ar: string;
    ticket_auto_reply_message_en: string;
    ticket_auto_reply_enabled: number | string;
    force_update_android_version: number | string;
    force_update_ios_version: number | string;
    collector_visit_notification_body_ar: string;
    collector_visit_notification_body_en: string;
};

export default function settings() {
    const [settingData, setSettingData] = useState<Setting | null>(null);
    const [formData, setFormData] = useState<FormDataType>({
        ios_version: "",
        android_version: "",
        vodafone_cash_number: 0,
        instapay_number: "",
        recycle_price_by_kilo: 0,
        grace_period_visits: 0,
        ticket_auto_reply_enabled: 0,
        ticket_auto_reply_message_ar: "",
        ticket_auto_reply_message_en: "",
        force_update_android_version: 0,
        force_update_ios_version: 0,
        collector_visit_notification_body_ar: "",
        collector_visit_notification_body_en: ""
    });
    const [ticketAutoReplyEnabled, setTicketAutoReplyEnabled] =
        useState(false);
    const [iosForceUpdate, setIosForceUpdate] = useState(false);
    const [androidForceUpdate, setAndroidForceUpdate] = useState(false);

    const fetchSettingData = () => {
        getSettingService()
            .then((response) => {
                const data = response.data;

                setSettingData(data);

                setFormData({
                    android_version: data.android_version || "",
                    ios_version: data.ios_version || "",
                    vodafone_cash_number: data.wallet_number?.toString() || "0",
                    instapay_number: data.instapay_number || "",
                    recycle_price_by_kilo:
                        data.recycle_price_by_kilo?.toString() || "0",
                    ticket_auto_reply_message_ar:
                        data.ticket_auto_reply_message_ar || "",
                    ticket_auto_reply_message_en:
                        data.ticket_auto_reply_message_en || "",
                    ticket_auto_reply_enabled:
                        data.ticket_auto_reply_enabled || 0,
                    grace_period_visits:
                        data.grace_period_visits?.toString() || "0",
                    force_update_android_version:
                        data.force_update_android_version || 0,
                    force_update_ios_version:
                        data.force_update_ios_version || 0,
                    collector_visit_notification_body_ar:
                        data.collector_visit_notification_body_ar || "",
                    collector_visit_notification_body_en:
                        data.collector_visit_notification_body_en || "",
                });

                setTicketAutoReplyEnabled(!!data.ticket_auto_reply_enabled);
                setAndroidForceUpdate(!!data.force_update_android_version);
                setIosForceUpdate(!!data.force_update_ios_version);
            })
            .catch(() => { });
    };

    useEffect(() => {
        fetchSettingData();
    }, []);

    const addFormChangeHander = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const body = JSON.stringify({
            ...formData,
            recycle_price_by_kilo: Number(formData.recycle_price_by_kilo),
            grace_period_visits: Number(formData.grace_period_visits),
            vodafone_cash_number: Number(formData.vodafone_cash_number),
            ticket_auto_reply_enabled: Number(
                formData.ticket_auto_reply_enabled
            ),
            force_update_android_version: Number(
                formData.force_update_android_version
            ),
            force_update_ios_version: Number(
                formData.force_update_ios_version
            ),
        });

        updateSettingService(body)
            .then(() => {
                fetchSettingData();
                successDialog(true);
            })
            .catch(() => { });
    };

    const resetHandler = () => {
        if (!settingData) return;

        setFormData({
            android_version: settingData.android_version || "",
            ios_version: settingData.ios_version || "",


            vodafone_cash_number:
                settingData.wallet_number?.toString() || "0",
            instapay_number: settingData.instapay_number || "",
            recycle_price_by_kilo:
                settingData.recycle_price_by_kilo?.toString() || "0",
            ticket_auto_reply_enabled:
                settingData.ticket_auto_reply_enabled || 0,
            ticket_auto_reply_message_ar:
                settingData.ticket_auto_reply_message_ar || "",
            ticket_auto_reply_message_en:
                settingData.ticket_auto_reply_message_en || "",
            grace_period_visits:
                settingData.grace_period_visits?.toString() || "0",

            force_update_android_version:
                settingData.force_update_android_version || 0,


            force_update_ios_version:
                settingData.force_update_ios_version || 0,


            collector_visit_notification_body_ar: settingData.collector_visit_notification_body_ar || '',
            collector_visit_notification_body_en: settingData.collector_visit_notification_body_en || ''
        });

        setTicketAutoReplyEnabled(
            !!settingData.ticket_auto_reply_enabled
        );
        setAndroidForceUpdate(
            !!settingData.force_update_android_version
        );
        setIosForceUpdate(!!settingData.force_update_ios_version);
    };

    const handleCheckAutoReply = (value: boolean) => {
        setTicketAutoReplyEnabled(value);
        setFormData((prev) => ({
            ...prev,
            ticket_auto_reply_enabled: value ? 1 : 0,
        }));
    };

    const handleCheckForceAndroidUpdate = (value: boolean) => {
        setAndroidForceUpdate(value);
        setFormData((prev) => ({
            ...prev,
            force_update_android_version: value ? 1 : 0,
        }));
    };

    const handleCheckForceIosUpdate = (value: boolean) => {
        setIosForceUpdate(value);
        setFormData((prev) => ({
            ...prev,
            force_update_ios_version: value ? 1 : 0,
        }));
    };

    return (
        <div className="py-20">
            <form
                onSubmit={updateSubmit}
                className="px-7 py-10 shadow-[0_0_1rem_#00000015] rounded-xl space-y-10"
            >
                <h5 className="text-lg font-bold">الاعدادات الفنية</h5>

                <TextFieldNada
                    placeholder=""
                    name="ios_version"
                    type="text"
                    handleChange={addFormChangeHander}
                    value={formData.ios_version}
                    label="اصدار IOS"
                />

                <TextFieldNada
                    placeholder=""
                    name="android_version"
                    type="text"
                    handleChange={addFormChangeHander}
                    value={formData.android_version}
                    label="اصدار Android"
                />

                <TextFieldNada
                    placeholder=""
                    name="vodafone_cash_number"
                    type="text"
                    handleChange={addFormChangeHander}
                    value={formData.vodafone_cash_number}
                    label="رقم فودافون كاش"
                />

                <TextFieldNada
                    placeholder=""
                    name="instapay_number"
                    type="text"
                    handleChange={addFormChangeHander}
                    value={formData.instapay_number}
                    label="رقم انستاباي"
                />

                <TextFieldNada
                    placeholder=""
                    name="recycle_price_by_kilo"
                    type="number"
                    handleChange={addFormChangeHander}
                    value={formData.recycle_price_by_kilo}
                    label="سعر الكيلو"
                />

                <TextFieldNada
                    placeholder=""
                    name="grace_period_visits"
                    type="number"
                    handleChange={addFormChangeHander}
                    value={formData.grace_period_visits}
                    label="مدة فترة السماح"
                />

                <ToggleSwitch
                    checked={androidForceUpdate}
                    label="تحديث Android"
                    onChange={handleCheckForceAndroidUpdate}
                />

                <ToggleSwitch
                    checked={iosForceUpdate}
                    label="تحديث IOS"
                    onChange={handleCheckForceIosUpdate}
                />

                <ToggleSwitch
                    checked={ticketAutoReplyEnabled}
                    label="اظهار رسالة الدعم"
                    onChange={handleCheckAutoReply}
                />
                {ticketAutoReplyEnabled && (
                    <>
                        <TextFieldNada
                            placeholder=""
                            name="ticket_auto_reply_message_ar"
                            type="text"
                            handleChange={addFormChangeHander}
                            value={formData.ticket_auto_reply_message_ar}
                            label="رسالة الدعم باللغه العربيه"
                        />
                        <TextFieldNada
                            placeholder=""
                            name="ticket_auto_reply_message_ar"
                            type="text"
                            handleChange={addFormChangeHander}
                            value={formData.ticket_auto_reply_message_en}
                            label="رسالة الدعم باللغه الانجليزيه "
                        />

                    </>
                )}

                <TextFieldNada
                    placeholder=""
                    name="collector_visit_notification_body_ar"
                    type="text"
                    handleChange={addFormChangeHander}
                    value={formData.collector_visit_notification_body_ar}
                    label="رسالة المندوب باللغه العربيه"
                />
                <TextFieldNada
                    placeholder=""
                    name="collector_visit_notification_body_en"
                    type="text"
                    handleChange={addFormChangeHander}
                    value={formData.collector_visit_notification_body_en}
                    label="رسالة المندوب باللغه الانجليزيه"
                />



                <div className="mt-4 flex items-center justify-center gap-4">
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
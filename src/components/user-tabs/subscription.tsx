"use client";

import React, { use, useEffect, useState } from "react";
import SelectInput from "../ui/form/SelectInput";
import TextFieldNada from "../ui/form/TextFieldNada";
import MultiCheckbox from "../ui/form/MultiCheckbox";
// import { FileInput, ToggleSwitch } from "flowbite-react";
import {
    districtListService,
    paymentMethodListService,
} from "@/services/sharedService";
import { Region } from "@/types/regions.interface";
import { getCategoriesService } from "@/services/categoriesService";
import { getPackagesService } from "@/services/packagesOffersService";
import { Category } from "@/types/categories.interface";
import { PackageOffer } from "@/types/packagesOffer.interface";
import { RadioGroup } from "@headlessui/react";
import { Payment_methods } from "@/types/paymentMethod.interface";
import FileInputImg from "../ui/form/FileInputImg";
import { AppUser, Payment } from "@/types/user.interface";
import { updateUserService } from "@/services/userService";
import UIDialogConfirm from "../ui/UIDialogConfirm";
import { deleteSubscriptionService } from "@/services/subscriptionService";
import { Users } from "@/types/auth.interface";
import FileInput from "@/components/ui/form/FileInput";
import moment from "moment";

type Props = {
    user: Users;
};
interface DistrictItem {
    available_days: string[];
    available_times: string[];
}

interface UserFormData {}
export default function subscription({ user }: Props) {
    const [formData, setFormData] = useState({
        district_id: "",
        has_subscription: 0,
        package_id: "",
        payment_method_id: "",
        days: [],
        start_date: "",
        time_from: "",
        totalPrice: "",
        price_per_unit: "",
        renew_date: "",
        units: 1,
        category_id: "",
        payment_verification: "",
        address_title: "",
        address_details: "",
    });
    // const [formData, setFormData] = useState({
    //     district_id: user.subscription.district.id,
    //     has_subscription: user.has_subscription,
    //     package_id: user.subscription.package.id,

    //     payment_method_id: user.payment.payment_method.id,
    //     days: user.subscription.days,
    //     start_date: user.subscription.starts_at,
    //     time_from: "",
    //     units: user.subscription.units,
    //     category_id: user.subscription.category.id,
    //     payment_verification: user.payment.payment_verification,
    //     address_title: user.subscription.address.title,
    //     address_details: user.subscription.address.detail,
    // });

    const [selected, setSelected] = useState<Payment_methods | null>(null);
    const [district, setDistrict] = useState<Region[]>([]);
    const [districtDays, setDistrictDays] = useState<string[]>([]);
    const [districtTime, setDistrictTime] = useState<string[]>([]);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);
    const [packageItem, setPackageItem] = useState<PackageOffer | null>(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethodList, setPaymentMethodList] = useState<
        Payment_methods[]
    >([]);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
        null
    );
    const [switch1, setSwitch1] = useState(false);

    const fetchDistrict = () => {
        districtListService().then((response) => {
            setDistrict(response.data);

            response.data.map((item: DistrictItem, index: number) => {
                setDistrictDays(item.available_days);
                setDistrictTime(item.available_times);
            });
        });
    };

    const fetchCategories = () => {
        getCategoriesService().then((response) => {
            setCategoryList(response.data);
        });
    };

    const fetchPackages = () => {
        getPackagesService().then((response) => {
            console.log(response);
            setpackagesList(response.data);
        });
    };

    const fetchPaymentMethodList = () => {
        paymentMethodListService()
            .then((response) => {
                setPaymentMethodList(response.data);
                console.log("hshshhshs", response.data);
            })
            .catch((error) => {});
    };

    // const takeUploadedImg = (img) => {
    //   console.log(img)

    // }

    //@ts-ignore
    const takeValue = (e, name) => {
        console.log(e.target.value);
        setFormData((prev) => ({
            ...prev,
            [name]: e.target.value,
        }));
    };
    const deleteSubmit = () => {
        if (!user || !user.subscription) return;
        deleteSubscriptionService(user.subscription.id)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {});
    };

    // const handleCheckSubscription = (value) => {
    //   console.log(value)
    //   // setSwitch1(true)
    //   setFormData((prev => ({
    //     ...prev,
    //     ["has_subscription"]: value
    //   })))
    // }

    const updateUser = () => {
        // const body = JSON.stringify({
        //     subscription_name: formData.subscription_name,
        //     has_subscription: formData.has_subscription,
        // });
        // updateUserService(user.id, body).then((response) => {
        //     console.log(response);
        // });
    };

    useEffect(() => {
        fetchDistrict();
        fetchCategories();
        fetchPackages();

        fetchPaymentMethodList();
    }, []);

    //@ts-ignore
    const handleSelectedRadio = (selected) => {
        setFormData((prev) => {
            const updatedPayment = {
                //@ts-ignore
                ...prev.payment,
                payment_method: { ...selected },
            };

            return {
                ...prev,
                payment: updatedPayment,
            };
        });

        console.log("dd", selected);
    };

    useEffect(() => {
        if (user && user.subscription) {
            const startDate = moment(user.subscription.starts_at).format(
                "YYYY-MM-DD"
            );
            const reDate = moment(user.renewal_date).format("YYYY-MM-DD");

            const x = paymentMethodList.find(
                (item) => item.id == user.payment.id
            );
            setFormData({
                district_id: user.subscription.district.id.toString(),
                has_subscription: Number(user.has_subscription),
                package_id: user.subscription.package.id.toString(),
                payment_method_id: user.payment.payment_method.id.toString(),
                //@ts-ignore
                days: user.subscription.days,
                renew_date: reDate,
                totalPrice: user.payment.total_price.toString(),
                price_per_unit:
                    user.subscription.package.price_per_unit.toString(),
                start_date: startDate,
                time_from:
                    user.subscription.time_from +
                    "-" +
                    user.subscription.time_to,
                units: user.subscription.units,
                category_id: user.subscription.category.id.toString(),
                payment_verification: user.payment.payment_verification,
                address_title: user.subscription.address.title,
                address_details: user.subscription.address.detail,
            });
        }
    }, [user]);

    useEffect(() => {
        if (!paymentMethodList.length || !user) return;

        const x = paymentMethodList.find((item) => item.id == user.payment.payment_method.id);
        console.log("xxxxxxxxxx", x);
        setSelected(x ?? null);
    }, [user, paymentMethodList]);

    //@ts-ignore
    const handleAddUserSubmit = (e) => {
        e.preventDefault();
    };
    return (
        <div>
            <div className="">
                <div className="">
                    <div className="py-10 ">
                        <UIDialogConfirm
                            danger
                            title="هل انت متأكد من حذف العنصر"
                            confirmHandler={() => {
                                //@ts-ignore
                                deleteSubmit();
                            }}
                        >
                            {!!user?.has_subscription && (
                                <button className="delete-subscription-btn text-nowrap  px-7 py-2 bg-red-500 hover:bg-red-600 duration-150 text-white rounded-md">
                                    حذف الاشتراك
                                </button>
                            )}
                        </UIDialogConfirm>
                    </div>

                    {user.has_subscription && (
                        <>
                            <form onSubmit={handleAddUserSubmit} className="">
                                <div className="grid grid-cols-12 gap-7 mt-5">
                                    <div className="col-span-6">
                                        <SelectInput
                                            placeholder="ادخل اسم المنطقة"
                                            name="name_ar"
                                            itemName="name_ar"
                                            itemValue="id"
                                            value={formData.district_id}
                                            items={district}
                                            label="اسم المنطقة"
                                            disabled
                                            onChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ["district_id"]: value,
                                                }))
                                            }
                                        ></SelectInput>

                                        {/* {required && <span className="text-red-600">*</span>} */}
                                    </div>

                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="address"
                                            type="text"
                                            handleChange={(e) =>
                                                takeValue(e, "address_title")
                                            }
                                            value={formData.address_title}
                                            label=" العنوان"
                                            placeholder=" العنوان"
                                            disabled
                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-6">
                                        <SelectInput
                                            items={categoryList}
                                            placeholder="ادخل نوع الخدمة"
                                            name=""
                                            itemName="name_ar"
                                            itemValue="id"
                                            value={formData.category_id}
                                            label=" نوع الخدمة"
                                            disabled
                                            onChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ["category_id"]: value,
                                                }))
                                            }
                                        ></SelectInput>
                                    </div>

                                    <div className="col-span-6">
                                        <SelectInput
                                            items={packagesList}
                                            placeholder="ادخل نوع الباقه"
                                            name=""
                                            itemName="name_ar"
                                            itemValue="id"
                                            value={formData.package_id}
                                            label=" نوع الباقة"
                                            disabled
                                            onChange={(value) => {}}
                                        ></SelectInput>
                                    </div>

                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="price"
                                            type="number"
                                            handleChange={(e) =>
                                                takeValue(e, "units")
                                            }
                                            value={formData.price_per_unit}
                                            label=" سعر الباقة "
                                            placeholder="  سعر الباقة "
                                            disabled
                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="units"
                                            type="number"
                                            handleChange={(e) =>
                                                takeValue(e, "units")
                                            }
                                            value={formData.units.toString()}
                                            label=" عدد الوحدات "
                                            placeholder=" عدد الوحدات "
                                            disabled
                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-12">
                                        <TextFieldNada
                                            name="price"
                                            type="number"
                                            handleChange={(e) =>
                                                takeValue(e, "price")
                                            }
                                            value={formData.totalPrice}
                                            label="السعر الكلي "
                                            placeholder="  السعر الكلي "
                                            disabled
                                        ></TextFieldNada>
                                    </div>
                                    <div className="col-span-6">
                                        <TextFieldNada
                                            type="text"
                                            name="start_date"
                                            handleChange={(e) => {}}
                                            value={formData.start_date}
                                            label="تاريخ البدأ "
                                            placeholder="  السعر الكلي *"
                                            disabled
                                        ></TextFieldNada>
                                    </div>
                                    <div className="col-span-6">
                                        <TextFieldNada
                                            type="text"
                                            name="start_date"
                                            handleChange={(e) =>
                                                takeValue(e, "start_date")
                                            }
                                            value={formData.renew_date}
                                            label="تاريخ التجديد "
                                            placeholder="  السعر الكلي *"
                                            disabled
                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-6">
                                        <MultiCheckbox
                                            items={districtDays}
                                            value={formData.days}
                                            label="اليوم"
                                            required={true}
                                            name="available_days"
                                            placeholder="اختر اليوم"
                                            prependIcon="mdi mdi-calendar-month-outline"
                                            iconType="mdi"
                                            disbaled
                                            onChange={(value) => {
                                                //@ts-ignore
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ["days"]: value,
                                                }));
                                            }}
                                        ></MultiCheckbox>
                                    </div>
                                    <div className="col-span-6">
                                        <SelectInput
                                            items={districtTime}
                                            placeholder="اختر الوقت"
                                            name=""
                                            value={formData.time_from}
                                            label=" الوقت"
                                            disabled
                                            onChange={(value) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ["time_from"]: value,
                                                }));
                                            }}
                                        ></SelectInput>
                                    </div>

                                    <div className="col-span-12">
                                        <RadioGroup
                                            value={selected}
                                            onChange={(e) => {}}
                                        >
                                            <div className="grid grid-cols-2 gap-7">
                                                {paymentMethodList.map(
                                                    (item, index) => (
                                                        <RadioGroup.Option
                                                            key={index}
                                                            value={item}
                                                            className={({
                                                                active,
                                                                checked,
                                                            }) =>
                                                                `${
                                                                    active
                                                                        ? "ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300"
                                                                        : ""
                                                                }
                          ${checked ? "border border-[#009414] " : ""}
                            relative flex cursor-pointer  rounded-lg px-5 py-4 ring-1 ring-gray-100 focus:outline-none  col-span-1`
                                                            }
                                                        >
                                                            {({
                                                                active,
                                                                checked,
                                                            }) => (
                                                                <>
                                                                    <div className="flex w-full items-center justify-between">
                                                                        <div className="flex items-center">
                                                                            <div className="text-sm">
                                                                                <RadioGroup.Label
                                                                                    as="div"
                                                                                    className={`font-medium  ${
                                                                                        checked
                                                                                            ? "text-gray-900"
                                                                                            : "text-gray-900"
                                                                                    }`}
                                                                                >
                                                                                    <div className="flex items-center gap-4">
                                                                                        <div className="w-10 h-10 rounded-full">
                                                                                            <img
                                                                                                className="w-full h-full object-contain"
                                                                                                src={
                                                                                                    item.image
                                                                                                }
                                                                                                alt=""
                                                                                            />
                                                                                        </div>
                                                                                        {
                                                                                            item.name_ar
                                                                                        }
                                                                                    </div>
                                                                                </RadioGroup.Label>
                                                                            </div>
                                                                        </div>
                                                                        {checked ? (
                                                                            <div className="before:absolute before:content-[''] before:w-3 before:h-3 before:rounded-full before:bg-[#009414]   shrink-0 w-4 h-4 rounded-full ring-1 ring-surface text-surface flex justify-center items-center text-xs">
                                                                                {/* <CheckIcon className="h-6 w-6" /> */}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="shrink-0 w-4 h-4 rounded-full ring-1 ring-surface text-surface flex justify-center items-center">
                                                                                {/* <CheckIcon className="h-6 w-6" /> */}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </RadioGroup.Option>
                                                    )
                                                )}
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="col-span-6">
                                        <div className="w-[150px] ">
                                            <img src={user.payment.payment_verification} alt="" className="w-full object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

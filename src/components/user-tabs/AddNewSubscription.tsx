"use client";

import TextFieldNada from "@/components/ui/form/TextFieldNada";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, Select, ToggleSwitch } from "flowbite-react";
// import { addUserService } from "@/services/authServices";
import BaseDropDown from "@/components/shared/BaseDropDown";
import {
    districtListService,
    paymentMethodListService,
} from "@/services/sharedService";
import { Region } from "@/types/regions.interface";
import DatePicker from "@/components/ui/form/DatePicker";
import FileInput from "@/components/ui/form/FileInput";
import {
    getPackageByIdService,
    getPackagesService,
} from "@/services/packagesOffersService";
import { PackageOffer } from "@/types/packagesOffer.interface";
import { getCategoriesService } from "@/services/categoriesService";
import { Category } from "@/types/categories.interface";
import SelectInput from "@/components/ui/form/SelectInput";
import MultiCheckbox from "@/components/ui/form/MultiCheckbox";
import { addUserService } from "@/services/userService";
import { useRouter } from "next/navigation";
import { Payment_methods } from "@/types/paymentMethod.interface";
import { RadioGroup } from "@headlessui/react";
import { Users } from "@/types/auth.interface";
import { addSubscriptionService } from "@/services/subscriptionService";
import * as Yup from 'yup'
import { validateAllInputs } from "@/utils/shared";

type Props = {
    user: Users;
    getNewUser: (user: Users) => void
};

interface FormDataInputErrors {
    district_id: string | null,
    has_subscription: string,
    package_id: string | null,
    payment_method_id: string | null,
    days: string,
    start_date: string | null,
    time_from: string | null,
    units: string | null,
    category_id: string | null,
    payment_verification: string | null,
    address_title: string | null,
    // name: string | null,
    // phone: string | null,
    // password: string | null,
    // address_lat: string,
    // address_lng: string,
    // address_details: string,
}

interface FormDataInputs {
    address_title: string | null,
    district_id: string | null,
    has_subscription: number,
    package_id: string | null,
    payment_method_id: string | null,
    days: string[],
    start_date: string | null,
    time_from: string | null,
    units: number,
    category_id: string | null,
    payment_verification: string | null,
    // name: string | null,
    // phone: string | null,
    // password: string | null,
    // address_lat: string,
    // address_lng: string,
    // address_details: string,

}

export default function AddNewSubscription({ user, getNewUser }: Props) {
    const [district, setDistrict] = useState<Region[]>([]);
    const [selectedDate, setSelectedDate] = useState();
    const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<PackageOffer | null>(
        null
    );
    const [totalPrice, setTotalPrice] = useState(0);
    const [districtDays, setDistrictDays] = useState<string[]>([]);
    const [districtTime, setDistrictTime] = useState<string[]>([]);
    const [packageItem, setPackageItem] = useState<PackageOffer | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [paymentMethodList, setPaymentMethodList] = useState<
        Payment_methods[]
    >([]);
    const [selected, setSelected] = useState<null | Payment_methods>(null);

    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState("");

    const [districtAvailableDays, setDistrictAvailableDays] = useState([
        { title: 'السبت ', slug: 'saturday' },
        { title: ' الاحد', slug: 'sunday' },
        { title: 'الاتنين ', slug: 'monday' },
        { title: 'الثلاثاء ', slug: 'tuesday' },
        { title: 'الاربعاء ', slug: 'wednesday' },
        { title: 'الخميس ', slug: 'thursday' },
        { title: 'الجمعه ', slug: 'friday' },

    ]);

    //@ts-ignore
    const takeValue = (e, name) => {
        console.log(e.target.value);
        setFormData((prev) => ({
            ...prev,
            [name]: e.target.value,
        }));
        if (name == "units") {
            if (packageItem) {
                // setFormData((prev)=>({
                //   ...prev,

                // }))
                //@ts-ignore
                setTotalPrice(selectedPackage.price_per_unit * formData.units);
            }
        }
    };


    const formSchema = Yup.object().shape({
        district_id: Yup.string().required(),
        has_subscription: Yup.number().required(),
        package_id: Yup.string().required(),
        payment_method_id: Yup.string().required(),
        days: Yup.array()
            .of(Yup.string())
            .min(1, "Select at least one day")
            .required("Available days are required"),
        units: Yup.number().required(),
        category_id: Yup.number().required(),
        payment_verification: Yup.string().required(),
        address_title: Yup.string().required(),

        // name: Yup.string().required(),
        // phone: Yup.number().required(),
        // password: Yup.string().required(),
        // start_date: "",
        // time_from: "",
        // address_lat: Yup.string().required(),
        // address_lng: Yup.string().required(),
        // address_details: Yup.string().required(),
    });


    const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
        district_id: "",
        has_subscription: "",
        package_id: "",
        payment_method_id: "",
        days: "",
        start_date: "",
        time_from: "",
        units: "",
        category_id: "",
        payment_verification: "",
        address_title: "",
        // name: "",
        // phone: "",
        // password: "",
        // address_lat: "",
        // address_lng: "",
        // address_details: "",
    });


    const fetchDistrict = () => {
        districtListService().then((response) => {
            setDistrict(response.data);
            //@ts-ignore

            setDistrictDays([]);
            setDistrictTime([]);
        });
    };
    //@ts-ignore
    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setErrorMessage("");
        const validateResult = await validateAllInputs<FormDataInputs>(
            formSchema,
            formData
        );
        console.log("validate", validateResult);
        if (!validateResult) return;
        setFormErrors({ ...validateResult.outputResult });
        console.log("form error", formErrors);
        if (validateResult.isInvalid) return;

        const t = formData.time_from.split("-");
        const fd = new FormData();
        fd.append("user_id", user.id.toString());

        fd.append("district_id", formData.district_id);
        fd.append("category_id", formData.category_id);
        fd.append("start_date", formData.start_date);
        fd.append("address_title", formData.address_title);
        fd.append("time_from", t[0]);
        fd.append("time_to", t[1]);
        //@ts-ignore
        fd.append("has_subscription", formData.has_subscription);
        //@ts-ignore
        fd.append("units", formData.units);
        fd.append("package_id", formData.package_id);
        fd.append("payment_method_id", formData.payment_method_id);
        fd.append("payment_verification", formData.payment_verification);
        fd.append("address_lat", "34.1531");
        fd.append("address_lng", "34.1531");
        formData.days.forEach((day, index) => fd.append(`days[${index}]`, day));

        addSubscriptionService(fd)
            .then((response) => {
                // router.push("/users");
                window.location.reload();
                getNewUser(response.data)
            })
            .catch((error) => {
                setErrorMessage(error.message);
                console.log('error msg', error.message)
            });
    };

    const fetchPackages = () => {
        getPackagesService().then((response) => {
            console.log(response);
            setpackagesList(response.data);
        });
    };

    const fetchCategories = () => {
        getCategoriesService().then((response) => {
            setCategoryList(response.data);
        });
    };

    const fetchPaymentList = () => {
        paymentMethodListService().then((response) => {
            setPaymentMethodList(response.data);
        });
    };

    const [switch1, setSwitch1] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "default-password",
        district_id: "",
        has_subscription: 0,
        package_id: "",

        payment_method_id: "",
        days: [],
        start_date: "",
        time_from: "",
        units: 1,
        category_id: "",
        payment_verification: "",
        address_title: "",
        address_lat: "34.1531",
        address_lng: "34.1531",
        address_details: "",
    });

    //@ts-ignore
    const takeUploadedImg = (img) => {

        setFormData(prev => ({
            ...prev,
            ['payment_verification']: img.file
        }))
        console.log(img);
    };

    useEffect(() => {
        if (packageItem) {
            setTotalPrice(Number(packageItem.price_per_unit) * formData.units);
        }
    }, [formData.units]);
    useEffect(() => {
        if (packageItem) {
            setTotalPrice(Number(packageItem.price_per_unit) * formData.units);
        }
    }, [packageItem]);

    //@ts-ignore
    const handleSelectPackage = (value) => {
        setFormData((prev) => ({
            ...prev,
            ["package_id"]: value,
        }));
        getPackageByIdService(value).then((response) => {
            setPackageItem(response.data);
        });
    };

    const handleCheckSubscription = () => {
        setSwitch1(!switch1);
        setFormData((prev) => ({
            ...prev,
            ["has_subscription"]: 1,
        }));
    };

    //@ts-ignore
    const handleSelecteditem = (item) => {
        console.log("itemssssss", item);
        setSelected(item);
        setFormData((prev) => ({
            ...prev,
            ["payment_method_id"]: item.id,
        }));

        // console.log(e.target.value)
    };

    useEffect(() => {
        fetchDistrict();
        fetchPaymentList();
        fetchPackages();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (formData.district_id) {
            const ca = district.find(
                (item) => item.id.toString() == formData.district_id.toString()
            );

            if (ca) {
                setDistrictDays(ca.available_days);
                setDistrictTime(ca.available_times);
            }
        }
    }, [formData]);

    return (
        <>
            <form onSubmit={handleAddUserSubmit} className="">
                {errorMessage && (
                    <div className="mb-5">
                        <span className="text-red-800">
                            {" "}
                            {errorMessage}
                        </span>
                    </div>
                )}
                <div className="grid grid-cols-12 gap-7 mt-14">
                    <div className="col-span-6">
                        <SelectInput
                            errorMessage={formErrors.district_id || ''}
                            placeholder="ادخل اسم المنطقة"
                            name="name_ar"
                            itemName="name_ar"
                            itemValue="id"
                            value={formData.district_id}
                            items={district}
                            label="اسم المنطقة"
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
                            errorMessage={formErrors.address_title || ''}
                            name="address"
                            type="text"
                            handleChange={(e) => takeValue(e, "address_title")}
                            value={formData.address_title}
                            label=" العنوان"
                            placeholder=" العنوان"
                        ></TextFieldNada>
                    </div>

                    <div className="col-span-6">
                        <SelectInput
                            errorMessage={formErrors.category_id || ''}
                            items={categoryList}
                            placeholder="ادخل نوع الخدمة"
                            name=""
                            itemName="name_ar"
                            itemValue="id"
                            value={formData.category_id}
                            label=" نوع الخدمة"
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
                            errorMessage={formErrors.package_id || ''}
                            items={packagesList}
                            placeholder="ادخل نوع الباقه"
                            name=""
                            itemName="name_ar"
                            itemValue="id"
                            value={formData.package_id}
                            label=" نوع الباقة"
                            onChange={(value) => handleSelectPackage(value)}
                        ></SelectInput>
                    </div>

                    <div className="col-span-6">
                        <TextFieldNada

                            name="price"
                            type="number"
                            handleChange={(e) => takeValue(e, "units")}
                            value={packageItem ? packageItem.price_per_unit : 0}
                            label=" سعر الباقة "
                            placeholder="  سعر الباقة "
                        ></TextFieldNada>
                    </div>

                    <div className="col-span-6">
                        <TextFieldNada
                            errorMessage={formErrors.units || ''}
                            name="units"
                            type="number"
                            handleChange={(e) => takeValue(e, "units")}
                            value={formData.units.toString()}
                            label=" عدد الوحدات "
                            placeholder=" عدد الوحدات "
                        ></TextFieldNada>
                    </div>

                    <div className="col-span-6">
                        <TextFieldNada

                            name="price"
                            type="number"
                            handleChange={(e) => takeValue(e, "price")}
                            value={totalPrice.toString()}
                            label="السعر الكلي "
                            placeholder="  السعر الكلي "
                        ></TextFieldNada>
                    </div>
                    <div className="col-span-6">
                        <TextFieldNada
                            errorMessage={formErrors.start_date || ''}
                            name="start_date"
                            type="date"
                            handleChange={(e) => takeValue(e, "start_date")}
                            value={formData.start_date}
                            label="تاريخ البدأ "
                            placeholder="  السعر الكلي *"
                        ></TextFieldNada>
                    </div>

                    <div className="col-span-6">
                        <MultiCheckbox
                            errorMessage={formErrors.days}
                            items={districtAvailableDays}
                            value={formData.days}
                            label="اليوم"
                            itemName="title"
                            itemValue="slug"
                            required={true}
                            name="available_days"
                            placeholder="اختر اليوم"
                            prependIcon="mdi mdi-calendar-month-outline"
                            iconType="mdi"
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
                            errorMessage={formErrors.time_from || ''}

                            items={districtTime}
                            placeholder="اختر الوقت"
                            name=""
                            value={formData.time_from}
                            label=" الوقت"
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
                            onChange={(e) => handleSelecteditem(e)}
                        >
                            <div className="grid grid-cols-2 gap-7">
                                {paymentMethodList.map((item, index) => (
                                    <RadioGroup.Option
                                        key={index}
                                        value={item}
                                        className={({ active, checked }) =>
                                            `${active
                                                ? "ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300"
                                                : ""
                                            }
                          ${checked ? "border border-[#009414] " : ""}
                            relative flex cursor-pointer  rounded-lg px-5 py-4 ring-1 ring-gray-100 focus:outline-none  col-span-1`
                                        }
                                    >
                                        {({ active, checked }) => (
                                            <>
                                                <div className="flex w-full items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="text-sm">
                                                            <RadioGroup.Label
                                                                as="div"
                                                                className={`font-medium  ${checked
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
                                ))}
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="col-span-6">
                        <FileInput
                            errorMessage={formErrors.payment_verification || ''}
                            onFileChange={(img) => takeUploadedImg(img)}
                            state="add"
                            title="ارفاق صورة التحويل"
                        />
                    </div>
                </div>

                <div className="mx-auto w-[50%] py-5 flex gap-4">
                    <button
                        type="submit"
                        className="bg-[#009414] rounded-xl px-3 py-2 text-white w-full"
                    >
                        اضافة
                    </button>
                    <button className="bg-[#00941412] text-[#009414] w-full rounded-xl px-3 py-2">
                        الغاء
                    </button>
                </div>
            </form>
        </>
    );
}

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
import moment from "moment";
import * as Yup from "yup";
import { validateAllInputs } from "@/utils/shared";





export default function page() {
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

    //@ts-ignore
    const takeValue = (e, name) => {
        console.log(e.target.value)
        console.log(e.target.value);
        setFormData((prev) => ({
            ...prev,
            [name]: e.target.value,
        }));
        if (name == "units") {

            if (packageItem && selectedPackage) {
                // setFormData((prev)=>({
                //   ...prev,

                // }))
                //@ts-ignore
                setTotalPrice(selectedPackage.price_per_unit * formData.units);
            }
        }
        // if (name == "start_date") {
        //     if (packageItem && packageItem.name_ar == 'باقه 6 شهور') {
        //         setFormData((prev) => ({
        //             ...prev,
        //             ['end_date']: moment(formData.start_date).add(30, 'days').format('YYYY-MM-DD')
        //         }))

        //     }
        // }
    };


    interface FormDataInputErrors {
        name: string | null;
        phone: string;
        days: string;
        time_from: string;
        

    }
    type FormDataType = {
        name: string;
        phone: string;
        days: string[];
        time_from: string;
       

    };

    const formSchema = Yup.object().shape({
        name: Yup.string().required(),
        phone: Yup.string().required(),
        days: Yup.array()
            .of(Yup.string())
            .min(1, "Select at least one day")
            .required("Available days are required"),
        time_from: Yup.string().required("Time is  required"),
       

    });

    const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
        name: "",
        phone: "",
        days: "",
        time_from: "",
     

    });


    //   const form = {
    //     name: "",
    //     phone: "",
    //     password: "",
    //   };

    const fetchDistrict = () => {
        districtListService().then((response) => {

            //@ts-ignore
            const activeDistricts = response.data.filter((item, index) => {
                return item.is_active
            })

            setDistrict(activeDistricts);
            //@ts-ignore

            setDistrictDays([]);
            setDistrictTime([]);
        });
    };
    //@ts-ignore
    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const validateResult = await validateAllInputs(
            formSchema,
            formData
        );
        console.log("validate", validateResult);
        if (!validateResult) return;
        //@ts-ignore
        setFormErrors({ ...validateResult.outputResult });
        console.log("form error", formErrors);
        if (validateResult.isInvalid) return;

        const t = formData.time_from.split("-");
        const fd = new FormData();

        fd.append("name", formData.name);
        fd.append("phone", formData.phone);
        fd.append("password", formData.password);
        if (switch1) {
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
            fd.append("is_request_recycle", formData.is_request_recycle.toString());
            fd.append("package_id", formData.package_id);
            fd.append("payment_method_id", formData.payment_method_id);
            fd.append("address_lat", "34.1531");
            fd.append("address_lng", "34.1531");
            formData.days.forEach((day, index) =>
                fd.append(`days[${index}]`, day)
            );
        }

        addUserService(fd)
            .then((response) => {
                router.push("/users");
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    };

    const fetchPackages = () => {
        getPackagesService().then((response) => {
            console.log(response);
            const activePackages = response.data.filter((item, index) => {
                return item.is_active
            })

            setpackagesList(activePackages);
        });
    };

    const fetchCategories = () => {
        getCategoriesService().then((response) => {
            const activeCategories = response.data.filter((item, index) => {
                return item.is_active
            })
            console.log('filterrrred', activeCategories)
            setCategoryList(activeCategories);
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
        is_request_recycle: 0,

        payment_method_id: "",
        days: [],
        start_date: "",

        end_date: "",
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

    useEffect(() => {
        if (packageItem) {
            setFormData((prev) => ({
                ...prev,
                ['end_date']: moment(formData.start_date).add(packageItem.days_count, 'days').format('YYYY-MM-DD')
            }))
        }
    }, [packageItem])
    useEffect(() => {
        if (packageItem) {
            setFormData((prev) => ({
                ...prev,
                ['end_date']: moment(formData.start_date).add(packageItem.days_count, 'days').format('YYYY-MM-DD')
            }))
        }
    }, [formData.start_date])

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

    const serviceTypeList = [{ is_request_recycle: 0, name: 'جمع' }, { is_request_recycle: 1, name: 'جمع وتدوير' }]

    useEffect(() => {
        fetchDistrict();
        fetchPaymentList();
        fetchPackages();
        fetchCategories();
    }, []);



    // useEffect(() => {
    //     if (formData.district_id) {
    //         const ca = district.find(
    //             (item) => item.id.toString() == formData.district_id.toString()
    //         );

    //         const daysObj = {
    //             saturday: 'السبت',
    //             sunday: 'الاحد',
    //             monday: 'الاتنين',
    //             tuesday: 'الثلاثاء',
    //             wednesday: 'الاربعاء',
    //             thursday: 'الخميس'
    //         }

    //         if (ca && districtAvailableDays) {
    //             const updatedArr = ca?.available_days.map((item: string) => ({

    //                 item,
    //                 title: daysObj[item] || item

    //             }))

    //             //@ts-ignore
    //             setDistrictAvailableDays(updatedArr)

    //         }











    //         // if (ca) {
    //         //     setDistrictAvailableDays(ca.available_days);
    //         //     setDistrictTime(ca.available_times);
    //         // }
    //     }
    // }, [formData]);



    useEffect(() => {
        if (formData.district_id) {
            const ca = district.find(
                (item) => item.id.toString() === formData.district_id.toString()
            );

            console.log('available days', ca?.available_days);

            if (ca) {
                // Assuming ca.available_days is an array like ['sunday', 'monday']
                const dayMap = {
                    saturday: 'السبت',
                    sunday: 'الاحد',
                    monday: 'الاتنين',
                    tuesday: 'الثلاثاء',
                    wednesday: 'الاربعاء',
                    thursday: 'الخميس',
                    friday: 'الجمعه'
                };
                const updatedDays = ca.available_days.map((slug: string) => ({
                    slug,
                    //@ts-ignore
                    title: dayMap[slug] || slug
                }));

                setDistrictAvailableDays(updatedDays);
                setDistrictTime(ca.available_times)

            }
        }
    }, [formData.district_id, district]);

    const [districtAvailableDays, setDistrictAvailableDays] = useState([
        { title: 'السبت ', slug: 'saturday' },
        { title: ' الاحد', slug: 'sunday' },
        { title: 'الاتنين ', slug: 'monday' },
        { title: 'الثلاثاء ', slug: 'tuesday' },
        { title: 'الاربعاء ', slug: 'wednesday' },
        { title: 'الخميس ', slug: 'thursday' },
        { title: 'الجمعه ', slug: 'friday' },

    ]);

    const maxEndDate = packageItem && formData.start_date
        ? moment(formData.start_date).add(30, 'days').format('YYYY-MM-DD')
        : undefined;



    return (
        <div>
            <div className="py-20">
                <div className="bg-white rounded-xl p-5 ">
                    <div className="mb-14">
                        <p className="font-bold">اضافة مستخدم جديد</p>
                    </div>
                    {errorMessage && (
                        <div className="mb-6 text-start border border-red-800 bg-red-100 px-3 py-3 rounded-lg">
                            <span className="text-red-800 error-alert">
                                {" "}
                                {errorMessage}
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleAddUserSubmit} className="">
                        <div className="grid grid-cols-12 space-y-5 gap-7">
                            <div className="col-span-12">
                                <TextFieldNada
                                    errorMessage={formErrors.name || ""}
                                    name="name"
                                    type="text"
                                    handleChange={(e) => takeValue(e, "name")}
                                    value={formData.name}
                                    label="اسم المستخدم"
                                    placeholder="اسم المستخدم"

                                ></TextFieldNada>
                            </div>

                            <div className="col-span-12">
                                <TextFieldNada
                                    errorMessage={formErrors.phone || ""}
                                    name="phone"
                                    type="number"
                                    handleChange={(e) => takeValue(e, "phone")}
                                    value={formData.phone}
                                    label="رقم الموبايل"
                                    placeholder=" رقم الموبايل"
                                ></TextFieldNada>
                            </div>
                            {/* <div className="col-span-6">
                                <TextFieldNada
                                    name="password"
                                    type="password"
                                    handleChange={(e) =>
                                        takeValue(e, "password")
                                    }
                                    value={formData.password}
                                    label="كلمة المرور"
                                    placeholder="كلمة المرور"
                                ></TextFieldNada>
                            </div> */}
                        </div>

                        <div className="py-6 ">
                            <ToggleSwitch
                                checked={switch1}
                                label="اشتراك"
                                onChange={handleCheckSubscription}
                            />
                        </div>

                        {switch1 && (
                            <div className="mt-5">
                                <div className="grid grid-cols-12 gap-7">
                                    <div className="col-span-6">
                                        <SelectInput
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
                                            name="address"
                                            type="text"
                                            handleChange={(e) =>
                                                takeValue(e, "address_title")
                                            }
                                            value={formData.address_title}
                                            label=" العنوان"
                                            placeholder=" العنوان"
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
                                            onChange={(value) =>
                                                handleSelectPackage(value)
                                            }
                                        ></SelectInput>
                                    </div>
                                    <div className="col-span-6">
                                        <SelectInput
                                            items={serviceTypeList}
                                            placeholder="ادخل نوع الطلب"
                                            name="is_request_recycle"
                                            itemName="name"
                                            itemValue="is_request_recycle"
                                            value={formData.is_request_recycle}
                                            label=" نوع الطلب"
                                            onChange={(value) => setFormData((prev) => ({
                                                ...prev,
                                                ['is_request_recycle']: value
                                            }))}
                                        ></SelectInput>
                                    </div>

                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="price"
                                            type="number"
                                            handleChange={(e) =>
                                                takeValue(e, "units")
                                            }
                                            value={
                                                packageItem
                                                    ? packageItem.price_per_unit
                                                    : 0
                                            }
                                            label=" سعر الباقة "
                                            placeholder="  سعر الباقة "
                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="units"
                                            type="number"
                                            handleChange={(e) =>
                                                takeValue(e, "units")
                                            }
                                            value={formData.units}
                                            label=" عدد الوحدات "
                                            placeholder=" عدد الوحدات "
                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="price"
                                            type="number"
                                            handleChange={(e) =>
                                                takeValue(e, "price")
                                            }
                                            value={totalPrice.toString()}
                                            label="السعر الكلي "
                                            placeholder="  السعر الكلي "
                                        ></TextFieldNada>
                                    </div>
                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="start_date"
                                            type="date"
                                            handleChange={(e) =>
                                                takeValue(e, "start_date")
                                            }
                                            value={formData.start_date}
                                            label="تاريخ البدأ "
                                            placeholder="  السعر الكلي *"
                                        ></TextFieldNada>
                                    </div>
                                    <div className="col-span-6">
                                        <TextFieldNada
                                            name="end_date"
                                            type="date"
                                            handleChange={(e) =>
                                                takeValue(e, "end_date")
                                            }
                                            value={formData.end_date}
                                            label="تاريخ الانتهاء "
                                            placeholder="تاريخ الانتهاء "

                                        ></TextFieldNada>
                                    </div>

                                    <div className="col-span-6">
                                        <MultiCheckbox

                                            disbaled={!formData.district_id}
                                            items={districtAvailableDays}
                                            value={formData.days}
                                            label="اليوم"
                                            required={true}
                                            name="available_days"
                                            itemName="title"
                                            itemValue="slug"
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
                                            errorMessage={formErrors.days || ""}
                                        ></MultiCheckbox>
                                    </div>
                                    <div className="col-span-6">
                                        <SelectInput
                                        errorMessage={formErrors.time_from}
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
                                            onChange={(e) =>
                                                handleSelecteditem(e)
                                            }
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
                                                                `${active
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
                                                    )
                                                )}
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="col-span-6">
                                        <FileInput
                                            onFileChange={(img) =>
                                                takeUploadedImg(img)
                                            }
                                            state="add"
                                            title="ارفاق صورة التحويل"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mx-auto w-[50%] py-5 flex justify-center">
                            <button
                                type="submit"
                                className="bg-[#009414] rounded-xl px-3 py-4 text-white min-w-[225px] "
                            >
                                اضافة
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

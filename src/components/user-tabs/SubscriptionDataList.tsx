


"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import {

    updateUserService,
    getUserSubscriptionByIdService,
} from "@/services/userService";
import * as Yup from 'yup'


import BaseDataTable from "@/components/data-tables/BaseDataTable";

import { useRouter } from "next/navigation";
import { Category, Users } from "@/types/auth.interface";
import { Subscription } from "@/types/user.interface";
import UIBaseDialog from "../ui/UIBaseDialog";
import UserSubscription from "@/components/user-tabs/userSubscription";
import SelectInput from "../ui/form/SelectInput";
import { Region } from "@/types/regions.interface";
import { districtListService, paymentMethodListService } from "@/services/sharedService";
import TextFieldNada from "../ui/form/TextFieldNada";
import moment from "moment";
import { addSubscriptionService, showSubscriptionService } from "@/services/subscriptionService";
import { getPackageByIdService, getPackagesService } from "@/services/packagesOffersService";
import { PackageOffer } from "@/types/packagesOffer.interface";
import MultiCheckbox from "../ui/form/MultiCheckbox";
import { getCategoriesService } from "@/services/categoriesService";
import { RadioGroup } from "@headlessui/react";
import FileInput from "@/components/ui/form/FileInput";
import { Payment_methods } from "@/types/paymentMethod.interface";
import { successDialog, validateAllInputs } from "@/utils/shared";


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


}


type Props = {
    user: Users;
    // getNewUser: (user: Users) => void
};

export default function rubbush_collectors({ user }: Props) {
    const [dataList, setDataList] = useState<Subscription[]>([]);
    const searchParams = useSearchParams()
    const filterWith = searchParams.get('is_request_recycle')
    const [selectedUserSubscription, setSelectedUserSubscription] = useState<Subscription | null>(null)
    const [district, setDistrict] = useState<Region[]>([]);
    const [districtDays, setDistrictDays] = useState<string[]>([]);
    const [districtTime, setDistrictTime] = useState<string[]>([]);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<PackageOffer | null>(
        null
    );


    const [totalPrice, setTotalPrice] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const [packageItem, setPackageItem] = useState<PackageOffer | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [paymentMethodList, setPaymentMethodList] = useState<
        Payment_methods[]
    >([]);
    const [selected, setSelected] = useState<null | Payment_methods>(null);

    const router = useRouter();

    const [addSubscriptionFormData, setAddSubscriptionFormData] = useState({
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

    const [errorMsg, setErrorMsg] = useState("");


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

    });


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
        setAddSubscriptionFormData((prev) => ({
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

    const fetchPaymentList = () => {
        paymentMethodListService().then((response) => {
            setPaymentMethodList(response.data);
        });
    };

    //@ts-ignore
    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setErrorMessage("");
        const validateResult = await validateAllInputs<FormDataInputs>(
            formSchema,
            addSubscriptionFormData
        );
        console.log("validate", validateResult);
        if (!validateResult) return;
        setFormErrors({ ...validateResult.outputResult });
        console.log("form error", formErrors);
        if (validateResult.isInvalid) return;

        const t = addSubscriptionFormData.time_from.split("-");
        const fd = new FormData();
        fd.append("user_id", user.id.toString());

        fd.append("district_id", addSubscriptionFormData.district_id);
        fd.append("category_id", addSubscriptionFormData.category_id);
        fd.append("start_date", addSubscriptionFormData.start_date);
        fd.append("address_title", addSubscriptionFormData.address_title);
        fd.append("time_from", t[0]);
        fd.append("time_to", t[1]);
        //@ts-ignore
        fd.append("has_subscription", addSubscriptionFormData.has_subscription);
        //@ts-ignore
        fd.append("units", addSubscriptionFormData.units);
        fd.append("package_id", addSubscriptionFormData.package_id);
        fd.append("payment_method_id", addSubscriptionFormData.payment_method_id);
        fd.append("payment_verification", addSubscriptionFormData.payment_verification);
        fd.append("address_lat", "34.1531");
        fd.append("address_lng", "34.1531");
        addSubscriptionFormData.days.forEach((day, index) => fd.append(`days[${index}]`, day));

        addSubscriptionService(fd)
            .then((response) => {

                console.log('jjjjjjjjjjjjjj', response)
                // router.push("/users");

                successDialog(true)
                window.location.reload();
                // getNewUser(response.data)
            })
            .catch((error) => {
                setErrorMessage(error.message);
                console.log('error msg', error.message)
            });
    };



    const [formData, setFormData] = useState({
        district_id: "",
        package_id: "",
        days: [],
        address_title: "",
        start_date: "",
        ends_at: "",
        time_from: "",
        category_id: "",
        price_per_unit: "",
        units: 1,
        // renew_date: "",
        // address_details: "",
        // payment_method_id: "",
    });


    const getDays = (day: string[]) => {
        const x = day.map((item, index) => {

            if (item == 'saturday')
                return 'السبت'
            if (item == "sunday")
                return 'الاحد'
            if (item == "monday")
                return 'الاتنين'
            if (item == "tuesday")
                return 'الثلاثاء'
            if (item == 'wednesday')
                return 'الاربعاء'
            if (item == 'thursday')
                return 'الخميس'
            if (item == 'friday')
                return 'الجمعه'
        })
        return x

    }



    console.log('filter is with', filterWith)
    const headerArr = [
        { text: "ID", name: "id" },
        { text: "تاريخ البداية", name: "name" },
        { text: "تاريخ النهاية", name: "name" },
        { text: "اسم الباقة", name: "phone" },
        { text: " سعر الباقة", name: "has_subscription" },
        { text: "نوع الطلب ", name: "is_request_recycle" },
        { text: "نوع الخدمة", name: "is_request_recycle" },
        { text: "الاجراءات", name: "" },
    ];
    const statusList = [
        { is_active: 1, name: "مفعل" },
        { is_active: 0, name: "غير مفعل" },
    ];

    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    const fetchDataList = ({
        search = searchTerm,
        pageNum = page,
    }: {
        search?: string;

        pageNum?: number;
    } = {}) => {


        const hasSearch = search ? "&search=" + search : "";

        const query = `?page=${pageNum}${hasSearch}`;






        getUserSubscriptionByIdService(user.id.toString(), query).then((response) => {
            setDataList(response.data)
            setTotalPages(response.meta.last_page);
        })
    };

    const tableSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

        const val = e.target.value;


        setSearchTerm(val);
        setPage(1);
        fetchDataList({ search: val, pageNum: 1 });
    };




    // const updateDataItemActive = (value: any, index: number) => {
    //     const service = dataList.find((item, i) => {
    //         return index == i;
    //     });

    //     if (!service) return;

    //     const body = JSON.stringify({
    //         is_active: value,
    //     });

    //     updateUserService(service.id, body)
    //         .then((response) => {
    //             const arr = [...dataList];
    //             arr[index].is_active = value;

    //             setDataList(arr);

    //             console.log(response);
    //         })
    //         .catch((error) => { });
    // };


    const fetchUserSubscription = () => {
        getUserSubscriptionByIdService(user.id.toString()).then((response) => {
            setDataList(response.data)
        })
    }

    const handleSelectedUserSubscription = (item: any) => {
        console.log('selected subscription item iss', item)
        showSubscriptionService(item.id).then((response) => {
            setSelectedUserSubscription(response.data)
        })

    }

    const fetchDistrict = () => {
        districtListService().then((response) => {
            setDistrict(response.data);

            response.data.map((item: any, index: number) => {
                setDistrictDays(item.available_days);
                setDistrictTime(item.available_times);
            });
        });
    };
    const fetchCategories = () => {
        getCategoriesService().then((response) => {
            //@ts-ignore
            setCategoryList(response.data);
        });
    };

    const fetchPackagesList = () => {
        getPackagesService().then((response) => {
            setpackagesList(response.data)

        })
    }


    //@ts-ignore
    const takeUploadedImg = (img) => {

        setAddSubscriptionFormData(prev => ({
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
        setAddSubscriptionFormData((prev) => ({
            ...prev,
            ["package_id"]: value,
        }));
        getPackageByIdService(value).then((response) => {
            setPackageItem(response.data);
        });
    };


    //@ts-ignore
    const handleSelecteditem = (item) => {
        console.log("itemssssss", item);
        setSelected(item);
        setAddSubscriptionFormData((prev) => ({
            ...prev,
            ["payment_method_id"]: item.id,
        }));

        // console.log(e.target.value)
    };


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

    useEffect(() => {
        fetchDistrict()
        fetchPackagesList()
        fetchCategories()
        fetchPaymentList()
    }, [])



    useEffect(() => {
        if (addSubscriptionFormData.district_id) {
            const ca = district.find(
                (item) => item.id.toString() == addSubscriptionFormData.district_id.toString()
            );

            if (ca) {
                setDistrictDays(ca.available_days);
                setDistrictTime(ca.available_times);
            }
        }
    }, [addSubscriptionFormData]);












    const tableHeadActionsSlot = () => {
        return (
            <>






                {/* <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                    <button onClick={() => router.push('/users/add-subscription')} className="bg-[#0094140D] p-1 rounded-lg">
                        اضافة اشتراك
                    </button>
                </div> */}


                <UIBaseDialog
                    title="اضافة اشتراك"
                    confirmHandler={() => { }}
                    confirmText="اضافة"
                    form="update-form"

                    btn={
                        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                            <button className="bg-[#0094140D] p-1 rounded-lg">
                                اضافة اشتراك
                            </button>
                        </div>
                    }
                >
                    <form onSubmit={handleAddUserSubmit} id="update-form" >
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
                                    value={addSubscriptionFormData.district_id}
                                    items={district}
                                    label="اسم المنطقة"
                                    onChange={(value) =>
                                        setAddSubscriptionFormData((prev) => ({
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
                                    value={addSubscriptionFormData.address_title}
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
                                    value={addSubscriptionFormData.category_id}
                                    label=" نوع الخدمة"
                                    onChange={(value) =>
                                        setAddSubscriptionFormData((prev) => ({
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
                                    value={addSubscriptionFormData.package_id}
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
                                    value={addSubscriptionFormData.units.toString()}
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
                                    value={addSubscriptionFormData.start_date}
                                    label="تاريخ البدأ "
                                    placeholder="  السعر الكلي *"
                                ></TextFieldNada>
                            </div>



                            <div className="col-span-6">
                                <MultiCheckbox
                                    errorMessage={formErrors.days}
                                    items={districtAvailableDays}
                                    value={addSubscriptionFormData.days}
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
                                        setAddSubscriptionFormData((prev) => ({
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
                                    value={addSubscriptionFormData.time_from}
                                    label=" الوقت"
                                    onChange={(value) => {
                                        setAddSubscriptionFormData((prev) => ({
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

                        {/* <div className="mx-auto w-[50%] py-5 flex gap-4">
                            <button
                                type="submit"
                                className="bg-[#009414] rounded-xl px-3 py-2 text-white w-full"
                            >
                                اضافة
                            </button>
                            <button className="bg-[#00941412] text-[#009414] w-full rounded-xl px-3 py-2">
                                الغاء
                            </button>
                        </div> */}
                    </form>
                </UIBaseDialog>




            </>
        );
    };
    useEffect(() => {
        fetchDataList()


    }, []);

    useEffect(() => {
        if (selectedUserSubscription) {
            const startDate = moment(selectedUserSubscription.starts_at).format(
                "YYYY-MM-DD"
            );
            const reDate = moment(selectedUserSubscription.created_at).format("YYYY-MM-DD");

            const x = paymentMethodList.find(
                (item) => item.id == user.payment.id
            );
            setFormData({
                district_id: selectedUserSubscription.district.id.toString(),
                package_id: selectedUserSubscription.package.id.toString(),

                //@ts-ignore
                days: getDays(selectedUserSubscription.days),
                // renew_date: reDate,

                price_per_unit:
                    selectedUserSubscription.package.price_per_unit.toString(),
                start_date: selectedUserSubscription.starts_at,
                ends_at: selectedUserSubscription.ends_at,
                time_from:
                    selectedUserSubscription.time_from +
                    "-" +
                    selectedUserSubscription.time_to,
                units: selectedUserSubscription.units,
                category_id: selectedUserSubscription.category.id.toString(),
                // payment_verification: user.payment.payment_verification,
                address_title: user.subscription.address.title,
                // address_details: user.subscription.address.detail,
            });
        }
    }, [selectedUserSubscription]);


    return (
        <>
            <div className="py-20">
                <BaseDataTable
                    headItems={headerArr}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    onSearchChange={tableSearchHandler}


                    headerActionsSlot={tableHeadActionsSlot()}
                >
                    {dataList.map((item, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4">{item.id}</td>
                            <td className="py-2 px-4">{item.starts_at}</td>
                            <td className="py-2 px-4">{item.ends_at}</td>
                            <td className="py-2 px-4">{item.package.name}</td>
                            <td className="py-2 px-4">{item.package.price_per_unit}</td>
                            <td className="py-2 px-4">{item.is_request_recycle ? 'جمع وتدوير' : 'جمع فقط'}</td>
                            <td className="py-2 px-4">{item.category.name}</td>
                            <td className="">
                                <UIBaseDialog
                                    hideConfirmBtn
                                    title="تفاصيل الاشتراك "
                                    confirmHandler={() => { }}
                                    confirmText="الغاء"
                                    form="update-form"
                                    btn={
                                        <button
                                            onClick={() => {
                                                handleSelectedUserSubscription(item)
                                            }}
                                            className="bg-blue-100 p-1 px-2 text-sm rounded-lg"
                                        >
                                            <span className="mdi mdi-eye-outline text-blue-500"></span>
                                        </button>
                                    }
                                >
                                    <form className="">
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


                                            </div>

                                            <div className="col-span-6">
                                                <TextFieldNada
                                                    name="address"
                                                    type="text"

                                                    value={formData.address_title}
                                                    label=" العنوان"
                                                    placeholder=" العنوان"
                                                    disabled
                                                ></TextFieldNada>
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
                                                    onChange={(value) => { }}
                                                ></SelectInput>
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
                                                <TextFieldNada
                                                    type="text"
                                                    name="start_date"
                                                    handleChange={(e) => { }}
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
                                                    handleChange={(e) => { }}
                                                    value={formData.ends_at}
                                                    label="تاريخ الانتهاء "
                                                    placeholder=" "
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
                                                <TextFieldNada
                                                    name="price"
                                                    type="number"
                                                    handleChange={undefined
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
                                                    handleChange={undefined
                                                    }
                                                    value={formData.units.toString()}
                                                    label=" عدد الوحدات "
                                                    placeholder=" عدد الوحدات "
                                                    disabled
                                                ></TextFieldNada>
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





                                            <div className="col-span-6">
                                                <div className="w-[150px] ">
                                                    <img src={user.payment.payment_verification} alt="" className="w-full object-contain" />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </UIBaseDialog>
                            </td>

                        </tr>
                    ))}
                </BaseDataTable>
            </div>
        </>
    );
}

















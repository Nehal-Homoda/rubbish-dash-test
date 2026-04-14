


"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import {

    updateUserService,
    getUserSubscriptionByIdService,
} from "@/services/userService";
import * as Yup from 'yup'
import BaseDataTable from "@/components/data-tables/BaseDataTable";
import { Category, Users } from "@/types/auth.interface";
import { Subscription } from "@/types/user.interface";
import UIBaseDialog from "../ui/UIBaseDialog";
import UserSubscription from "@/components/user-tabs/userSubscription";
import SelectInput from "../ui/form/SelectInput";
import { Region } from "@/types/regions.interface";
import { districtListService, paymentMethodListService } from "@/services/sharedService";
import TextFieldNada from "../ui/form/TextFieldNada";
import moment from "moment";
import { addSubscriptionService, deleteSubscriptionService, showSubscriptionService, updateSubscriptionService } from "@/services/subscriptionService";
import { getPackageByIdService, getPackagesService } from "@/services/packagesOffersService";
import { PackageOffer } from "@/types/packagesOffer.interface";
import MultiCheckbox from "../ui/form/MultiCheckbox";
import { getCategoriesService } from "@/services/categoriesService";
import { RadioGroup } from "@headlessui/react";
import FileInput from "@/components/ui/form/FileInput";
import { Payment_methods } from "@/types/paymentMethod.interface";
import { successDialog, validateAllInputs } from "@/utils/shared";
import UIDialogConfirm from "../ui/UIDialogConfirm";
import editImg from "@/assets/images/icons/edit.png";

interface FormDataInputErrors {
    district_id: string | null,
    has_subscription: string,
    package_id: string | null,
    payment_method_id: string | null,
    days: string,
    start_date: string | null,
    ends_at: string | null,
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
    ends_at: string | null,
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
    const [updateTotalPrice, setUpdateTotalPrice] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isShowDialogOpen, setIsShowDialogOpen] = useState(false)
    const [packageItem, setPackageItem] = useState<PackageOffer | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [paymentMethodList, setPaymentMethodList] = useState<
        Payment_methods[]
    >([]);
    const [selected, setSelected] = useState<null | Payment_methods>(null);
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
        ends_at: "",
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
    const headerArr = [
        { text: "ID", name: "id" },
        { text: "تاريخ البداية", name: "starts_at" },
        { text: "تاريخ النهاية", name: "ends_at" },
        { text: "اسم الباقة", name: "package" },
        { text: " سعر الباقة", name: "price_per_unit" },
        { text: "نوع الطلب ", name: "is_request_recycle" },
        { text: "نوع الخدمة", name: "category" },
        { text: "الاجراءات", name: "procedures" },
    ];
    const statusList = [
        { is_active: 1, name: "مفعل" },
        { is_active: 0, name: "غير مفعل" },
    ];
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [districtAvailableDays, setDistrictAvailableDays] = useState([
        { title: 'السبت ', slug: 'saturday' },
        { title: ' الاحد', slug: 'sunday' },
        { title: 'الاتنين ', slug: 'monday' },
        { title: 'الثلاثاء ', slug: 'tuesday' },
        { title: 'الاربعاء ', slug: 'wednesday' },
        { title: 'الخميس ', slug: 'thursday' },
        { title: 'الجمعه ', slug: 'friday' },

    ]);
    const [selectedDataItem, setSelectedDataItem] = useState<Subscription | null>(
        null,
    );
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

    });
    const [updateFormData, setUpdateFormData] = useState({
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

    });
    const [formErrors, setFormErrors] = useState<FormDataInputErrors>({
        district_id: "",
        has_subscription: "",
        package_id: "",
        payment_method_id: "",
        days: "",
        start_date: "",
        ends_at: "",
        time_from: "",
        units: "",
        category_id: "",
        payment_verification: "",
        address_title: "",
    });
    const [updateFormErrors, setUpdateFormErrors] = useState<FormDataInputErrors>({
        district_id: "",
        has_subscription: "",
        package_id: "",
        payment_method_id: "",
        days: "",
        start_date: "",
        ends_at: "",
        time_from: "",
        units: "",
        category_id: "",
        payment_verification: "",
        address_title: "",

    });
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

    //@ts-ignore
    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setErrorMessage("");
        const validateResult = await validateAllInputs<FormDataInputs>(
            formSchema,
            addSubscriptionFormData
        );
        if (!validateResult) return;
        setFormErrors({ ...validateResult.outputResult });
        console.log("form error", formErrors);
        if (validateResult.isInvalid) return;

        const t = addSubscriptionFormData.time_from.split("-");
        const fd = new FormData();
        fd.append('status', 'active')
        fd.append("user_id", user.id.toString());
        fd.append("district_id", addSubscriptionFormData.district_id);
        fd.append("category_id", addSubscriptionFormData.category_id);
        fd.append("start_date", addSubscriptionFormData.start_date);
        fd.append("ends_at", addSubscriptionFormData.ends_at);
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

   

    const handleSelectedUserSubscription = (item: any) => {
        console.log('selected subscription item iss', item)
        showSubscriptionService(item.id).then((response) => {
            setSelectedUserSubscription(response.data)
        })

    }

    const fetchDistrict = () => {
        districtListService().then((response) => {
            // setDistrict(response.data);


            //@ts-ignore
            const activeDistricts = response.data.filter((item, index) => {
                return item.is_active
            })

            setDistrict(activeDistricts);
            response.data.map((item: any, index: number) => {
                setDistrictDays(item.available_days);
                setDistrictTime(item.available_times);
            });
        });
    };
    const fetchCategories = () => {
        getCategoriesService().then((response) => {
            const activeCategories = response.data.filter((item, index) => {
                return item.is_active
            })
            console.log('filterrrred', activeCategories)
            //@ts-ignore
            setCategoryList(activeCategories);




            // setCategoryList(response.data);
        });
    };

    const fetchPackagesList = () => {
        getPackagesService().then((response) => {
            // setpackagesList(response.data)
            const activePackages = response.data.filter((item, index) => {
                return item.is_active
            })

            setpackagesList(activePackages);
        })
    }

    //@ts-ignore
    const takeValue = (e, name) => {
        console.log(e.target.value);
        setAddSubscriptionFormData((prev) => ({
            ...prev,
            [name]: e.target.value,
        }));
        if (name == "units") {
            if (packageItem && selectedPackage) {
                // setFormData((prev)=>({
                //   ...prev,

                // }))
                //@ts-ignore
                setTotalPrice(packageItem.price_per_unit * addSubscriptionFormData.units);
            }
        }
    };

    const fetchPaymentList = () => {
        paymentMethodListService().then((response) => {
            setPaymentMethodList(response.data);
        });
    };

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
        setSelected(item);
        setAddSubscriptionFormData((prev) => ({
            ...prev,
            ["payment_method_id"]: item.id,
        }));
    };


    const updateDataItem = (item: Subscription) => {
        setSelectedDataItem(item);

        const price = Number(item.package.price_per_unit);
        const units = Number(item.units);

        setUpdateFormData({
            address: item.address.title,
            district_id: item.district.id.toString(),
            package_id: item.package.id.toString(),
            //@ts-ignore
            days: Array.isArray(item.days) ? item.days : [],
            address_title: item.address.title,
            start_date: moment(item.starts_at).format("YYYY-MM-DD"),
            ends_at: moment(item.ends_at).format("YYYY-MM-DD"),
            time_from: item.time_from,
            price_per_unit: price.toString(),
            category_id: item.category.id.toString(),
            units: units,

        });


        setUpdateTotalPrice(price * units);
    };

    const updateFormChangeHander = (
        e: React.ChangeEvent<HTMLInputElement>,
        index?: number,
    ) => {
        setUpdateFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };

    const updateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedDataItem) return;

        const validateResult = await validateAllInputs<FormDataInputs>(
            formSchema,
            updateFormData
        );
        if (!validateResult) return;

        setUpdateFormErrors({ ...validateResult.outputResult });
        if (validateResult.isInvalid) return;

        const t = updateFormData.time_from.split("-");

        const fd = new FormData();

        fd.append('status', 'active');
        fd.append("user_id", user.id.toString());
        fd.append("district_id", updateFormData.district_id);
        fd.append("category_id", updateFormData.category_id);
        fd.append("start_date", updateFormData.start_date);
        fd.append("ends_at", updateFormData.ends_at);
        fd.append("address_title", updateFormData.address_title);
        fd.append("time_from", t[0]);
        fd.append("time_to", t[1]);
        fd.append("units", updateFormData.units.toString());
        fd.append("package_id", updateFormData.package_id);


        updateFormData.days.forEach((day, index) => {
            fd.append(`days[${index}]`, day);
        });

        updateSubscriptionService(selectedDataItem.id, fd)
            .then(() => {
                fetchDataList();
                successDialog(true);
                setIsUpdateDialogOpen(false);
            })
            .catch((error) => {
                console.log("update error", error?.response?.data);
                setErrorMsg(error?.message);
            });
    };


    const deleteSubmit = (item: any, index: number) => {
        deleteSubscriptionService(item.id)
            .then((response) => {
                const updatedArr = [...dataList];
                updatedArr.splice(index, 1);
                setDataList(updatedArr);
                successDialog(true);
            })
            .catch((error) => { });


    }
    //@ts-ignore
    const takeUploadedImg = (img) => {

        setAddSubscriptionFormData(prev => ({
            ...prev,
            ['payment_verification']: img.file
        }))
        console.log(img);
    };
    const tableHeadActionsSlot = () => {
        return (
            <>
                <UIBaseDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="اضافة اشتراك"
                    confirmHandler={() => { }}
                    confirmText="اضافة"
                    form="update-form"

                    btn={
                        <div className="bg-[#009414] py-2 rounded-xl text-center  text-white px-3">
                            <button onClick={() => setIsDialogOpen(true)} className="bg-[#0094140D] p-1 rounded-lg">
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
                                    disabled={!addSubscriptionFormData.category_id}
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

                            <div className="col-span-12">
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
                                    placeholder="تاريخ البدأ"
                                ></TextFieldNada>
                            </div>

                            <div className="col-span-6">

                                <TextFieldNada
                                    errorMessage={formErrors.ends_at || ''}
                                    name="ends_at"
                                    type="date"
                                    handleChange={(e) => takeValue(e, "ends_at")}
                                    value={addSubscriptionFormData.ends_at}
                                    label="تاريخ الانتهاء "
                                    placeholder="تاريخ الانتهاء"
                                ></TextFieldNada>

                            </div>



                            <div className="col-span-6">
                                <MultiCheckbox
                                    disbaled={!addSubscriptionFormData.district_id}
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
                                    disabled={!addSubscriptionFormData.district_id}
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
        if (packageItem) {
            setTotalPrice(Number(packageItem.price_per_unit) * addSubscriptionFormData.units);
        }
    }, [addSubscriptionFormData.units]);

    useEffect(() => {
        if (packageItem) {
            setTotalPrice(Number(packageItem.price_per_unit) * addSubscriptionFormData.units);
        }
    }, [packageItem]);

    useEffect(() => {
        if (updateFormData.package_id) {
            getPackageByIdService(Number(updateFormData.package_id)).then((res) => {
                const price = Number(res.data.price_per_unit);
                setUpdateTotalPrice(price * updateFormData.units);
            });
        }
    }, [updateFormData.units]);



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
        if (addSubscriptionFormData.category_id) {
            // // const ca = district.find(
            // //     (item) => item.id.toString() == formData.district_id.toString()
            // );
            const categoryId = categoryList.find((item) => item.id.toString() == addSubscriptionFormData.category_id.toString())

            if (categoryId) {
                const query = `?category_id=${categoryId.id}`
                getPackagesService(query).then((response) => {


                    const activePackages = response.data.filter((item, index) => {
                        return item.is_active
                    })

                    setpackagesList(activePackages);
                    console.log('responsssssssssssssssssssse is', response)

                })


            }
        }
    }, [addSubscriptionFormData]);

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
    }, [addSubscriptionFormData]);


    useEffect(() => {
        fetchDataList()


    }, []);

    useEffect(() => {
        if (selectedUserSubscription) {
            const startDate = moment(selectedUserSubscription.starts_at).format(
                "YYYY-MM-DD"
            );
            const reDate = moment(selectedUserSubscription.created_at).format("YYYY-MM-DD");

            // const x = paymentMethodList.find(
            //     (item) => item.id == user.payment.id
            // );
            setFormData({
                district_id: selectedUserSubscription.district.id.toString(),
                package_id: selectedUserSubscription.package.id.toString(),
                address_title: selectedUserSubscription.address.title,
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
                // address_title: user.subscription.address.title,
                // address_details: user.subscription.address.detail,
            });
        }
    }, [selectedUserSubscription]);


    return (
        <>
            <div className="py-20">
                <BaseDataTable
                    items={dataList}
                    headItems={headerArr}
                    onPageChange={setPage}
                    totalPages={totalPages}
                    onSearchChange={tableSearchHandler}
                    headerActionsSlot={tableHeadActionsSlot()}
                    renderers={{
                        is_request_recycle: (item, index: number) => (
                            item.is_request_recycle ? 'جمع وتدوير' : 'جمع فقط'
                        ),
                        price_per_unit: (item, index: number) => (
                            <span>{item.package?.price_per_unit}</span>
                        ),
                        package: (item) => (
                            <span>{item.package?.name}</span>
                        ),
                        category: (item, index: number) => (
                            <span>{item.category?.name}</span>
                        ),
                        procedures: (item, index: number) => (
                            <div className="flex justify-center items-center gap-3">
                                <UIDialogConfirm
                                    danger
                                    title="هل انت متأكد من حذف العنصر"
                                    confirmHandler={() => {
                                        deleteSubmit(item, index);
                                    }}
                                >
                                    <button className="bg-[#F9285A0A] p-1 rounded-lg">
                                        <span className="mdi mdi-trash-can-outline text-[#F9285A]"></span>
                                    </button>
                                </UIDialogConfirm>

                                <button
                                    onClick={() => {
                                        updateDataItem(item);
                                        setIsUpdateDialogOpen(true)

                                    }}
                                    className="bg-[#0094140D] p-1 rounded-lg"
                                >
                                    <span className="mdi mdi-folder-edit-outline text-[#009414]"></span>
                                </button>
                                <button
                                    onClick={() => {
                                        handleSelectedUserSubscription(item)
                                        setIsShowDialogOpen(true)
                                    }}
                                    className="bg-blue-100 p-1 px-2 text-sm rounded-lg"
                                >
                                    <span className="mdi mdi-eye-outline text-blue-500"></span>
                                </button>



                            </div>
                        ),

                    }}
                >

                </BaseDataTable>



                <UIBaseDialog
                    open={isShowDialogOpen}
                    onClose={() => setIsShowDialogOpen(false)}
                    hideConfirmBtn
                    title="تفاصيل الاشتراك "
                    confirmHandler={() => { }}
                    confirmText="الغاء"
                    form="update-form"

                >
                    <form className="">
                        <div className="grid grid-cols-12 gap-7 mt-5">
                            <div className="col-span-6">
                                <SelectInput
                                    placeholder="ادخل اسم المنطقة"
                                    name="district_id"
                                    itemName="name_ar"
                                    itemValue="id"
                                    value={formData.district_id}
                                    items={district}
                                    label="اسم المنطقة"
                                    disabled
                                    onChange={(value) =>


                                        undefined
                                        // setFormData((prev) => ({
                                        //     ...prev,
                                        //     ["district_id"]: value,
                                        // }))
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
                                    name="ends_at"
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
                                    {/* <img src={user.payment.payment_verification} alt="" className="w-full object-contain" /> */}
                                </div>
                            </div>
                        </div>
                    </form>
                </UIBaseDialog>




                <UIBaseDialog
                    open={isUpdateDialogOpen}
                    onClose={() => setIsUpdateDialogOpen(false)}
                    title="تعديل الاشتراك "
                    confirmHandler={() => { }}
                    confirmText="حفظ"
                    form="update-form"

                >
                    <form onSubmit={updateSubmit} className="">
                        <div className="grid grid-cols-12 gap-7 mt-5">
                            <div className="col-span-6">
                                <SelectInput
                                    placeholder="ادخل اسم المنطقة"
                                    name="district_id"
                                    itemName="name_ar"
                                    itemValue="id"
                                    value={updateFormData.district_id}
                                    items={district}
                                    label="اسم المنطقة"
                                    onChange={(value) => {
                                        setUpdateFormData((prev) => ({
                                            ...prev,
                                            ["district_id"]: value,
                                        }));
                                    }}
                                ></SelectInput>
                            </div>

                            <div className="col-span-6">
                                <TextFieldNada
                                    name="address_title"
                                    type="text"
                                    value={updateFormData.address_title}
                                    label=" العنوان"
                                    placeholder=" العنوان"
                                    handleChange={updateFormChangeHander}

                                ></TextFieldNada>
                            </div>



                            <div className="col-span-6">
                                <SelectInput
                                    items={categoryList}
                                    placeholder="ادخل نوع الخدمة"
                                    name=""
                                    itemName="name_ar"
                                    itemValue="id"
                                    value={updateFormData.category_id}
                                    label=" نوع الخدمة"
                                    onChange={(value) =>
                                        setUpdateFormData((prev) => ({
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
                                    value={updateFormData.package_id}
                                    label=" نوع الباقة"
                                    onChange={(value) => {
                                        setUpdateFormData((prev) => ({
                                            ...prev,
                                            package_id: value,
                                        }));
                                        getPackageByIdService(value).then((res) => {
                                            const price = Number(res.data.price_per_unit);

                                            setUpdateFormData((prev) => ({
                                                ...prev,
                                                package_id: value,
                                                price_per_unit: price.toString(),
                                            }));
                                            setUpdateTotalPrice(price * updateFormData.units);
                                        });
                                    }}
                                ></SelectInput>
                            </div>

                            <div className="col-span-6">
                                <TextFieldNada
                                    name="price"
                                    type="number"
                                    value={updateFormData.price_per_unit}
                                    label=" سعر الباقة "
                                    placeholder="  سعر الباقة "
                                    handleChange={updateFormChangeHander}
                                ></TextFieldNada>
                            </div>




                            <div className="col-span-6">
                                <TextFieldNada
                                    name="units"
                                    type="number"
                                    value={updateFormData.units.toString()}
                                    label=" عدد الوحدات "
                                    placeholder=" عدد الوحدات "
                                    handleChange={updateFormChangeHander}
                                ></TextFieldNada>
                            </div>

                            <div className="col-span-12">
                                <TextFieldNada
                                    name="total_price"
                                    type="number"
                                    handleChange={(e) => takeValue(e, "price")}
                                    value={updateTotalPrice.toString()}
                                    label="السعر الكلي "
                                    placeholder="  السعر الكلي "
                                ></TextFieldNada>
                            </div>

                            <div className="col-span-6">
                                <TextFieldNada
                                    type="date"
                                    name="start_date"
                                    value={updateFormData.start_date}
                                    label="تاريخ البدأ "
                                    placeholder="تاريخ البدأ"
                                    handleChange={updateFormChangeHander}
                                ></TextFieldNada>
                            </div>


                            <div className="col-span-6">
                                <TextFieldNada
                                    type="date"
                                    name="ends_at"
                                    value={updateFormData.ends_at}
                                    label="تاريخ الانتهاء "
                                    placeholder=" "
                                    handleChange={updateFormChangeHander}
                                ></TextFieldNada>
                            </div>

                            <div className="col-span-6">
                                <MultiCheckbox
                                    items={districtDays}
                                    value={updateFormData.days}
                                    label="اليوم"
                                    required={true}
                                    name="available_days"
                                    placeholder="اختر اليوم"
                                    prependIcon="mdi mdi-calendar-month-outline"
                                    iconType="mdi"
                                    onChange={(value) => {
                                        //@ts-ignore
                                        setUpdateFormData((prev) => ({
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
                                    value={updateFormData.time_from}
                                    label=" الوقت"
                                    onChange={(value) => {
                                        setUpdateFormData((prev) => ({
                                            ...prev,
                                            ["time_from"]: value,
                                        }));
                                    }}
                                ></SelectInput>
                            </div>





                            <div className="col-span-6">
                                <div className="w-[150px] ">
                                    {/* <img src={user.payment.payment_verification} alt="" className="w-full object-contain" /> */}
                                </div>
                            </div>
                        </div>
                    </form>
                </UIBaseDialog>


            </div >
        </>
    );
}

















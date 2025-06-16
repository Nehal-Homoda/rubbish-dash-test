


'use client'
import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterService } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import CheckBox from "../ui/form/CheckBox";

import BaseModal from '../ui/BaseModal';
import { color } from 'chart.js/helpers';
import { Paginator } from 'primereact/paginator';
import { userListService } from '@/services/sharedService';
import { Password } from 'primereact/password';
import { loginService } from '@/services/authServices';
import { useRouter } from 'next/navigation';
// import { CustomerService } from './service/CustomerService';

// The rule argument should be a string in the format "custom_[field]".
// FilterService.register('custom_activity', (value, filters) => {
//     const [from, to] = filters ?? [null, null];
//     if (from === null && to === null) return true;
//     if (from !== null && to === null) return from <= value;
//     if (from === null && to !== null) return value <= to;
//     return from <= value && value <= to;
// });
interface Location {
    id: number,
    name: string



}
export default function CustomFilterDemo() {
    // const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        area: { value: null, matchMode: FilterMatchMode.EQUALS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        subscription: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [location, setLocation] = useState<Location | null>(null)
    const [status, setStatus] = useState(null)
    const [subscribe, setSubscribe] = useState(null)
    // const [filtered, setFiltered] = useState<User[]>([])

    const [first, setFirst] = useState(1);
    const [rows, setRows] = useState(5);
    const [page, setPage] = useState(1);
    const [isLoggedin, setIsLoggedIn] = useState(false)
    const router=useRouter()

    const [users, setUsers] = useState<User[]>([])

    const areas = [
        { id: 1, name: "حي اول طنطا" },
        { id: 2, name: "حي ثان طنطا" },
        { id: 3, name: "حي ثالث طنطا" },
    ]
    const statusList = [
        { id: 1, name: 'مفعل' },
        { id: 2, name: 'غير مفعل' },
        { id: 3, name: 'معلق' },
    ]
    const subscriptionList = [
        { id: 1, name: 'مشترك/شهرية' },
        { id: 2, name: 'مشترك/3شهور' },
        { id: 3, name: 'غير مشترك' },
        { id: 4, name: 'مشترك/6شهور' },
    ]




    const onPageChange = (event) => {
    
        setFirst(event.first);
        setRows(event.rows);
        setPage(event.page+1)
        fetchUserList()
    };

    useEffect(() => {
        const form = {
            email: "test@example.com",
            password: "password"
        }
        const fd = new FormData()
        fd.append('email', "test@example.com")
        fd.append('password', "password")
        loginService(fd).then((response) => {
            setIsLoggedIn(true)
        })
        // setUsers(
        //     [

        //         {
        //             id: 1,
        //             name: "حبيبة احمد",
        //             mobile: "01201988345",
        //             area: "حي ثان طنطا",
        //             subscription: "مشترك/شهرية",
        //             renewalDate: "21 مايو 2025",
        //             status: "مفعل",
        //         },
        //         {
        //             id: 2,
        //             name: "يمنى يوسف",
        //             mobile: "01201988345",
        //             area: "حي ثالث طنطا",
        //             subscription: "مشترك/3شهور",
        //             renewalDate: "21 مايو 2025",
        //             status: "مفعل",
        //         },
        //         {
        //             id: 3,
        //             name: "محمد احمد",
        //             mobile: "01201988345",
        //             area: "حي اول طنطا",
        //             subscription: "غير مشترك",
        //             renewalDate: "غير محدد",
        //             status: "مفعل",
        //         },
        //         {
        //             id: 4,
        //             name: "مريم ابراهيم",
        //             mobile: "01201988345",
        //             area: "حي ثالث طنطا",
        //             subscription: "مشترك/6شهور",
        //             renewalDate: "21 مايو 2025",
        //             status: "غير مفعل",
        //         },
        //         {
        //             id: 5,
        //             name: "هاجر ربيع",
        //             mobile: "01201988345",
        //             area: "حي اول طنطا",
        //             subscription: "غير مشترك",
        //             renewalDate: "غير محدد",
        //             status: "معلق",
        //         },
        //         {
        //             id: 5,
        //             name: "هاجر ربيع",
        //             mobile: "01201988345",
        //             area: "حي اول طنطا",
        //             subscription: "غير مشترك",
        //             renewalDate: "غير محدد",
        //             status: "معلق",
        //         },
        //         {
        //             id: 5,
        //             name: "هاجر ربيع",
        //             mobile: "01201988345",
        //             area: "حي اول طنطا",
        //             subscription: "غير مشترك",
        //             renewalDate: "غير محدد",
        //             status: "معلق",
        //         },
        //         {
        //             id: 5,
        //             name: "هاجر ربيع",
        //             mobile: "01201988345",
        //             area: "حي اول طنطا",
        //             subscription: "غير مشترك",
        //             renewalDate: "غير محدد",
        //             status: "معلق",
        //         },
        //         {
        //             id: 5,
        //             name: "هاجر ربيع",
        //             mobile: "01201988345",
        //             area: "حي اول طنطا",
        //             subscription: "غير مشترك",
        //             renewalDate: "غير محدد",
        //             status: "معلق",
        //         },
        //         {
        //             id: 5,
        //             name: "هاجر ربيع",
        //             mobile: "01201988345",
        //             area: "حي اول طنطا",
        //             subscription: "غير مشترك",
        //             renewalDate: "غير محدد",
        //             status: "معلق",
        //         },
        //         {
        //             id: 5,
        //             name: "هاجر ربيع",
        //             mobile: "01201988345",
        //             area: "حي اول طنطا",
        //             subscription: "غير مشترك",
        //             renewalDate: "غير محدد",
        //             status: "معلق",
        //         },
        //         {
        //             id: 5,
        //             name: "هاجر ربيع",
        //             mobile: "01201988345",
        //             area: "حي اول طنطا",
        //             subscription: "غير مشترك",
        //             renewalDate: "غير محدد",
        //             status: "معلق",
        //         },


        //     ])
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const fetchUserList = () => {
        userListService(page).then((response) => {
            console.log(response)
            setUsers(response.data)
        })
    }

    useEffect(() => {
        if (isLoggedin) {

            fetchUserList()
        }
    }, [isLoggedin])



    const renderHeader = () => {
        return (
            <div className='grid grid-cols-12 items-center  gap-5 data-table-header' >
                <div className="flex lg:justify-content-end lg:col-span-5 col-span-12">
                    <IconField className='w-full' iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText className='w-full' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                    </IconField>
                </div>
                <div className='lg:col-span-7 col-span-12  overflow-x-auto '>

                    <div className='flex gap-4 lg:justify-end min-w-max '>

                        <div className='bg-[#0094140D]  text-center rounded-xl text-[#009414]'>
                            <Dropdown value={location} onChange={(e) => handleFilterChange(e, 'area')} options={areas} optionLabel="name"
                                placeholder="المنطقة" className="w-full md:w-14rem border-0 bg-transparent font-bold " />
                        </div>





                        <div className='bg-[#0094140D]  text-center rounded-xl '>
                            <Dropdown value={status} onChange={(e) => handleFilterChange(e, 'status')} options={statusList} optionLabel="name"
                                placeholder="الحالة" className="w-full md:w-14rem border-0 bg-transparent font-bold " />
                        </div>


                        <div className='bg-[#0094140D]  text-center rounded-xl '>
                            <Dropdown value={subscribe} onChange={(e) => handleFilterChange(e, 'subscription')} options={subscriptionList} optionLabel="name"
                                placeholder="الاشتراك" className="w-full md:w-14rem border-0 bg-transparent font-bold " />
                        </div>



                        <div className='bg-[#0094140D] cursor-pointer   py-2 text-center rounded-xl px-5 flex items-center justify-content-center '>
                            <i className='pi pi-download text-[#009414]'></i>
                        </div>


                        <div className='bg-[#009414] py-2 rounded-xl text-center  text-white min-w-36 '>
                            <button onClick={handleAddUser} className='w-full h-full'>اضافة مستخدم</button>
                        </div>

                    </div>


                </div>

            </div>
        );
    };



    const handleFilterChange = (e: any, name: string) => {
        console.log(e.target.value)
        const value = e.target.value;
        setLocation(value)
        // const filteredAreas = users.filter((userItem) => {
        //     return userItem.area == e.target.value.name
        // })

        // setFiltered(filteredAreas)
        let _filters = { ...filters };
        console.log(_filters)

        _filters[name].value = value.name;
        console.log(_filters[name].value)
        console.log(_filters)

        setFilters(_filters);
    }

    const handleAddUser=()=>{
        router.push(`/users/add-user`)
    }


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;
        setFilters(_filters);
        console.log(_filters)
        setGlobalFilterValue(value);
    };
    // const handleChangeArea = (e: any) => {
    //     console.log(e.target.value)
    //     const value = e.target.value;
    //     setLocation(value)
    //     // const filteredAreas = users.filter((userItem) => {
    //     //     return userItem.area == e.target.value.name
    //     // })

    //     // setFiltered(filteredAreas)
    //     let _filters = { ...filters };
    //     console.log(_filters)

    //     _filters['area'].value = value.name;
    //     console.log(_filters['area'].value)
    //     console.log(_filters)

    //     setFilters(_filters);
    // }


    // const handleChangeStatus = (e: any) => {
    //     console.log(e.target.value)
    //     const value = e.target.value;
    //     setStatus(value)
    //     // const filteredAreas = users.filter((userItem) => {
    //     //     return userItem.area == e.target.value.name
    //     // })

    //     // setFiltered(filteredAreas)
    //     let _filters = { ...filters };
    //     console.log(_filters)

    //     _filters['status'].value = value.name;
    //     console.log(_filters['status'].value)
    //     console.log(_filters)

    //     setFilters(_filters);
    // }
    // const handleChangeSubscribe = (e: any) => {
    //     console.log(e.target.value)
    //     const value = e.target.value;
    //     setStatus(value)
    //     // const filteredAreas = users.filter((userItem) => {
    //     //     return userItem.area == e.target.value.name
    //     // })

    //     // setFiltered(filteredAreas)
    //     let _filters = { ...filters };
    //     console.log(_filters)

    //     _filters['subscription'].value = value.name;
    //     console.log(_filters['subscription'].value)
    //     console.log(_filters)

    //     setFilters(_filters);
    // }





    // const representativeBodyTemplate = (rowData) => {
    //     const representative = rowData.representative;

    //     return (
    //         <div className="flex align-items-center gap-2">
    //             <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" />
    //             <span>{representative.name}</span>
    //         </div>
    //     );
    // };

    // const representativesItemTemplate = (option) => {
    //     return (
    //         <div className="flex align-items-center gap-2">
    //             <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
    //             <span>{option.name}</span>
    //         </div>
    //     );
    // };







    // const representativeRowFilterTemplate = (options) => {
    //     return (
    //         <MultiSelect
    //             value={options.value}
    //             options={representatives}
    //             itemTemplate={representativesItemTemplate}
    //             onChange={(e) => options.filterApplyCallback(e.value)}
    //             optionLabel="name"
    //             placeholder="Any"
    //             className="p-column-filter"
    //             maxSelectedLabels={1}
    //             style={{ minWidth: '14rem' }}
    //         />
    //     );
    // };


    // const verifiedRowFilterTemplate = (options) => {
    //     return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
    // };


    const checkboxTemplate = (rowData: User) => {
        return (
            <CheckBox
                id={`checkbox-${rowData.id}`}
                boxSize="size-6"
                checkStyle="text-white "
                checkBoxBg="bg-foreground/10"
                peerChecked="peer-checked:bg-surface"
                checkBoxRoundedValue="rounded-md"
                border="border-transparent"
            />
        );
    };
    const headerCheckbox = () => {
        return (
            <CheckBox
                id="header-checkbox"
                boxSize="size-6"
                checkStyle="text-white"
                checkBoxBg="bg-foreground/10"
                peerChecked="peer-checked:bg-surface"
                checkBoxRoundedValue="rounded-md"
                border="border-transparent"
            />
        );
    };




    const getSubscriptionSeverity = (subscription: string) => {
        switch (subscription) {
            case "مشترك/شهرية":
            case "مشترك/3شهور":
            case "مشترك/6شهور":
                return "success";
            case "غير مشترك":
                return "danger";
            default:
                return "warning";
        }
    };
    const subscriptionBodyTemplate = (rowData: User) => {
        return (
            <Tag
                value={rowData.subscription}
                severity={getSubscriptionSeverity(rowData.subscription)}
            />
        );
    };
    const getStatusSeverity = (status: string) => {
        switch (status) {
            case "مفعل":
                return "success";
            case "غير مفعل":
                return "danger";
            case "معلق":
                return "warning";
            default:
                return "info";
        }
    };

    const statusBodyTemplate = (rowData: User) => {
        return (
            <Tag
                value={rowData.status}
                severity={getStatusSeverity(rowData.status)}
            />
        );
    };
    const actionsBodyTemplate = () => {
        return (
            <div className="flex items-center justify-center gap-3">
                <BaseModal
                    title={"تعديل عنصر"}
                    actionBtn={"حفظ"}
                    openBtnIcon={"fa-regular fa-pen-to-square text-lg"}
                    iconType="mdi"
                    style="text-surface bg-surface-light-800/50 px-2 py-1 rounded-lg"
                >
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
                        vero!
                    </p>
                </BaseModal>
                <BaseModal
                    title={"حذف عنصر"}
                    actionBtn={"تأكيد"}
                    iconType="mdi"
                    openBtnIcon={"mdi mdi-delete-outline text-lg"}
                    style="text-red-600 bg-red-50 px-2 py-1 rounded-lg"
                >
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
                        vero!
                    </p>
                </BaseModal>
            </div>
        );
    };


    interface User {
        id: number;
        name: string;
        mobile: string;
        area: string;
        subscription: string;
        renewalDate: string;
        status: string;
    }

    const header = renderHeader();
    






    return (
        <div className="card">
            <DataTable scrollable value={users} dataKey="id" filters={filters} filterDisplay="row"
                globalFilterFields={['name', 'global', 'area']} header={header} emptyMessage="No users found."   >
                <Column header={headerCheckbox()}
                    body={checkboxTemplate}
                    style={{ textAlign: "center" }}
                    headerStyle={{ textAlign: "center" }} field="name" />
                <Column field="id"
                    header="ID"
                    sortable
                    style={{ textAlign: "center" }}
                    headerStyle={{ textAlign: "center" }} />
                <Column field="name"

                    header="اسم المستخدم"
                    sortable
                    style={{ textAlign: "center" }}
                    headerStyle={{ textAlign: "center" }}
                />
                <Column field="mobile"
                    header="رقم الموبايل"
                    style={{ textAlign: "center" }}
                    headerStyle={{ textAlign: "center" }} showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} />
                <Column field="area"
                    header="المنطقة"
                    style={{ textAlign: "center" }}
                    headerStyle={{ textAlign: "center" }} dataType="boolean" />
                <Column field="subscribe"
                    header="الاشتراك"
                    body={subscriptionBodyTemplate}
                    style={{ textAlign: "center" }}
                    headerStyle={{ textAlign: "center" }}
                    dataType="boolean" />

                <Column
                    field="renewalDate"
                    header="ميعاد التجديد"
                    sortable
                    style={{ textAlign: "center" }}
                    headerStyle={{ textAlign: "center" }}
                ></Column>
                <Column
                    field="status"
                    header="الحالة"
                    body={statusBodyTemplate}
                    style={{ textAlign: "center" }}
                    headerStyle={{ textAlign: "center" }}
                />
                <Column
                    field="actions"
                    header="الاجراءات"
                    sortable
                    body={actionsBodyTemplate}
                    style={{ textAlign: "center" }}
                    headerStyle={{ textAlign: "center" }}
                ></Column>
            </DataTable>


            <div className="card">
                <Paginator first={first} rows={rows} totalRecords={users.length} rowsPerPageOptions={[5, 10, 15]} onPageChange={onPageChange} />
            </div>






        </div>
    );
}




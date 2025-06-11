


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

import users from '@/app/[lang]/(dash-layout)/users/page';
import BaseModal from '../ui/BaseModal';
// import { CustomerService } from './service/CustomerService';

// The rule argument should be a string in the format "custom_[field]".
FilterService.register('custom_activity', (value, filters) => {
    const [from, to] = filters ?? [null, null];
    if (from === null && to === null) return true;
    if (from !== null && to === null) return from <= value;
    if (from === null && to !== null) return value <= to;
    return from <= value && value <= to;
});

export default function CustomFilterDemo() {
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        // For using custom filters, you must set FilterMatchMode.CUSTOM to matchMode.
        activity: { value: null, matchMode: FilterMatchMode.CUSTOM },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');



    useEffect(() => {
        setUsers(
            [

                {
                    id: 1,
                    name: "حبيبة احمد",
                    mobile: "01201988345",
                    area: "حي ثان طنطا",
                    subscription: "مشترك/شهرية",
                    renewalDate: "21 مايو 2025",
                    status: "مفعل",
                },
                {
                    id: 2,
                    name: "يمنى يوسف",
                    mobile: "01201988345",
                    area: "حي ثالث طنطا",
                    subscription: "مشترك/3شهور",
                    renewalDate: "21 مايو 2025",
                    status: "مفعل",
                },
                {
                    id: 3,
                    name: "محمد احمد",
                    mobile: "01201988345",
                    area: "حي اول طنطا",
                    subscription: "غير مشترك",
                    renewalDate: "غير محدد",
                    status: "مفعل",
                },
                {
                    id: 4,
                    name: "مريم ابراهيم",
                    mobile: "01201988345",
                    area: "حي ثالث طنطا",
                    subscription: "مشترك/6شهور",
                    renewalDate: "21 مايو 2025",
                    status: "غير مفعل",
                },
                {
                    id: 5,
                    name: "هاجر ربيع",
                    mobile: "01201988345",
                    area: "حي اول طنطا",
                    subscription: "غير مشترك",
                    renewalDate: "غير محدد",
                    status: "معلق",
                },


            ])
    }, []); // eslint-disable-line react-hooks/exhaustive-deps



    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className='grid grid-cols-12 items-center gap-32'>
                <div className="flex justify-content-end col-span-5">
                    <IconField className='w-full' iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText className='w-full' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                    </IconField>
                </div>
                <div className='col-span-7 flex  gap-10 '>


                    <div className='bg-[#0094140D] py-2  text-center rounded-xl w-[13%]'>
                        <span>المنطقه</span>
                    </div>
                    <div className='bg-[#0094140D] py-2 text-center rounded-xl w-[13%]'>
                        <span>الاشتراك</span>
                    </div>
                    <div className='bg-[#0094140D] py-2 text-center rounded-xl w-[13%]'>
                        <span>الحالة</span>
                    </div>

                    <div className='bg-[#0094140D] py-2 text-center rounded-xl w-[10%]'>
                            <i className='pi pi-download'></i>
                    </div>


                    <div className='bg-[#009414] py-2 px-3 rounded-xl text-white'>
                        <button>اضافة مستخدم</button>
                    </div>
                </div>

            </div>
        );
    };



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


    const verifiedRowFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
    };


    const checkboxTemplate = (rowData: User) => {
        return (
            <CheckBox
                id={`checkbox-${rowData.id}`}
                boxSize="size-6"
                checkStyle="text-white"
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
    const [users, setUsers] = useState<User[]>([])


    return (
        <div className="card">
            <DataTable value={users} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row"
                globalFilterFields={['name', 'country.name', 'representative.name', 'status']} header={header} emptyMessage="No users found.">
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
                <Column field="subscription"
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







        </div>
    );
}

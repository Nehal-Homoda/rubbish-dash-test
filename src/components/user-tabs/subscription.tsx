

'use client'

import React, { useEffect, useState } from 'react'
import SelectInput from '../ui/form/SelectInput';
import TextFieldNada from '../ui/form/TextFieldNada';
import MultiCheckbox from '../ui/form/MultiCheckbox';
import { FileInput, ToggleSwitch } from 'flowbite-react';
import { districtListService, paymentMethodListService } from '@/services/sharedService';
import { Region } from '@/types/regions.interface';
import { getCategoriesService } from '@/services/categoriesService';
import { getPackagesService } from '@/services/packagesOffersService';
import { Category } from '@/types/categories.interface';
import { PackageOffer } from '@/types/packagesOffer.interface';
import { RadioGroup } from '@headlessui/react';
import { Payment_methods } from '@/types/paymentMethod.interface';
import FileInputImg from '../ui/form/FileInputImg';
import { AppUser, Payment } from '@/types/user.interface';
import { updateUserService } from '@/services/userService';


type Props = {
  user: AppUser
}

interface UserFormData {

}
export default function subscription({ user }: Props) {

  const [formData, setFormData] = useState({

    // is_active: false,
    has_subscription: false,
    // renewal_date: "",
    subscription_name: "",
    // image: "",
    // created_at: "",
    payment: {

      payment_method: {
        id: 0,

      }

    },
    subscription: {
      id: 0,
      units: 0,
      time_from: "",
      time_to: "",
      // uid: "",
      // days: [],
      // status: "",
      // starts_at: "",
      // ends_at: "",
      // created_at: "",
      address: {
        title: "",
        // id: 0,
        // detail: "",
        // created_at: "",

      },
      district: {
        id: 0,
        // name: "",
        // available_days: [],
        // available_times: [],
      },
      package: {
        id: 0,
        price_per_unit: 0,
        // name: "",
        // days_count: 0,
      },
      category: {
        id: 0,
        // name: "",
        // image: ""
      },
    },

  });

  const [district, setDistrict] = useState<Region[]>([])
  const [districtDays, setDistrictDays] = useState<string[]>([]);
  const [districtTime, setDistrictTime] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [packagesList, setpackagesList] = useState<PackageOffer[]>([]);
  const [packageItem, setPackageItem] = useState<PackageOffer | null>(null)
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethodList, setPaymentMethodList] = useState<Payment_methods[]>([])
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [switch1, setSwitch1] = useState(false);


  const fetchDistrict = () => {
    districtListService().then((response) => {
      setDistrict(response.data);

      response.data.map((item, index) => {
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
    paymentMethodListService().then((response) => {
      setPaymentMethodList(response.data)
      console.log('hshshhshs', response.data)



    })
  }

  const takeUploadedImg = (img) => {
    console.log(img)

  }


  const takeValue = (e, name) => {
    console.log(e.target.value);
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const handleCheckSubscription = (value) => {
    console.log(value)
    // setSwitch1(true)
    setFormData((prev => ({
      ...prev,
      ["has_subscription"]: value
    })))
  }


  const updateUser = () => {
    const body = JSON.stringify({
      subscription_name: formData.subscription_name,
      has_subscription: formData.has_subscription

    })
    updateUserService(user.id, body).then((response) => {
      console.log(response)
    })
  }


  useEffect(() => {
    fetchDistrict()
    fetchCategories()
    fetchPackages()

    fetchPaymentMethodList()
  }, [])



  const handleSelectedRadio = (selected) => {
    setFormData((prev) => {
      const updatedPayment = {
        ...prev.payment,
        payment_method: { ...selected },
      };

      return {
        ...prev,
        payment: updatedPayment,
      };
    })

    console.log('dd', selected)

  }

  useEffect(() => {


    if (user && user.subscription) {
      console.log('user is', user)

      setFormData({
        subscription_name: user.subscription_name,
        has_subscription: user.has_subscription,
        payment: {

          payment_method: {
            id: user.payment.payment_method.id,

          }

        },
        subscription: {
          id: user.subscription.category.id,
          units: user.subscription.units,
          time_from: user.subscription.time_from,
          time_to: user.subscription.time_to,
          // uid: "",
          // days: [],
          // status: "",
          // starts_at: "",
          // ends_at: "",
          // created_at: "",
          address: {
            title: user.subscription.address.title,
            // id: 0,
            // detail: "",
            // created_at: "",

          },
          district: {
            id: Number(user.subscription.district.id),
            // name: "",
            // available_days: [],
            // available_times: [],
          },
          package: {
            id: user.subscription.package.id,
            price_per_unit: user.subscription.package.price_per_unit,
            // name: "",
            // days_count: 0,
          },
          category: {
            id: user.subscription.category.id,
            // name: "",
            // image: ""
          },
        }

      })
    }
  }, [user])



  return (
    <div>


      <div className="py-20">

        <div className="grid grid-cols-12 gap-7">




          <div className="py-6 ">
            <ToggleSwitch disabled
              checked={formData.has_subscription}
              label="مشترك"
              onChange={() => {}}
            />
          </div>

          {user.has_subscription &&

            <>

              <div className="col-span-12">
                {<SelectInput onChange={() => { }} items={categoryList} placeholder="ادخل نوع الخدمة" name="" itemName="name_ar" itemValue="id" value={formData.subscription.category.id} label=" نوع الخدمة"



                >
                </SelectInput>}

              </div>


              <div className="col-span-6">
                <SelectInput onChange={() => { }} items={packagesList} placeholder="ادخل نوع الباقه" name="" itemName="name_ar" itemValue="id" value={formData.subscription.package.id} label=" نوع الباقة"
                >
                </SelectInput>
              </div>



              <div className="col-span-6">
                <TextFieldNada
                  name="price"
                  type="number"
                  // handleChange={(e) => takeValue(e, "units")}
                  value={formData.subscription.package.price_per_unit}
                  label=" سعر الباقة *"
                  placeholder="  سعر الباقة *"
                ></TextFieldNada>

              </div>

              <div className="col-span-6">
                <TextFieldNada
                  name="units"
                  type="number"
                  // handleChange={(e) => takeValue(e, "units")}
                  value={formData.subscription.units}
                  label=" عدد الوحدات *"
                  placeholder=" عدد الوحدات *"
                ></TextFieldNada>
              </div>


              <div className="col-span-6">

                <SelectInput onChange={() => { }} placeholder="ادخل اسم المنطقة" name="name_ar" itemName="name_ar" itemValue="id" value={formData.subscription.district.id} items={district} label="اسم المنطقة"
                >

                </SelectInput>

                {/* {required && <span className="text-red-600">*</span>} */}
              </div>




              <div className='col-span-12'>
                <RadioGroup value={formData.payment.payment_method}  >
                  <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
                  <div className="grid grid-cols-2">
                    {paymentMethodList.map((item) => (
                      <RadioGroup.Option
                        key={item.name_ar}
                        value={item}
                        className={({ active, checked }) =>
                          `${active
                            ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                            : ''
                          }
                  ${checked ? 'border border-[#009414] ' : ''}
                    relative flex cursor-pointer  rounded-lg px-5 py-4 shadow-md focus:outline-none  col-span-1`
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <RadioGroup.Label
                                    as="div"
                                    className={`font-medium  ${checked ? 'text-gray-900' : 'text-gray-900'
                                      }`}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full">
                                        <img className="w-full h-full object-contain" src={item.image} alt="" />

                                      </div>
                                      {item.name_ar}
                                    </div>
                                  </RadioGroup.Label>

                                </div>
                              </div>
                              {checked ? (
                                <div className="shrink-0 w-4 h-4 rounded-full ring-1 ring-surface text-surface flex justify-center items-center text-xs">
                                  {/* <CheckIcon className="h-6 w-6" /> */}
                                  <span className="mdi mdi-check"></span>
                                </div>
                              )
                                :
                                (
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
                <TextFieldNada
                  name="address"
                  type="text"
                  // handleChange={(e) => takeValue(e, "address_title")}
                  value={formData.subscription.address.title}
                  label=" العنوان"
                  placeholder=" العنوان"
                ></TextFieldNada>
              </div>


              <div className="col-span-6">
                <TextFieldNada
                  name="price"
                  type="time"
                  // handleChange={(e) => takeValue(e, "time_from")}
                  value={formData.subscription.time_from}
                  label="من "
                  placeholder="  من وقت *"
                ></TextFieldNada>
              </div>



              <div className="col-span-6">
                <TextFieldNada
                  name="price"
                  type="time"
                  // handleChange={(e) => takeValue(e, "time_to")}
                  value={formData.subscription.time_to}
                  label="الي "
                  placeholder="  الي وقت*"
                ></TextFieldNada>
              </div>

              <div className="col-span-6">
                <FileInputImg onFileChange={() => { }} state="add" title="ارفاق صورة التحويل" />
              </div>

            </>



          }





















          {/* <div className="col-span-6">
            <TextFieldNada
              name="price"
              type="number"
              handleChange={(e) => takeValue(e, "price")}
              value={totalPrice.toString()}
              label="السعر الكلي *"
              placeholder="  السعر الكلي *"
            ></TextFieldNada>
          </div> */}







          {/* <div className="col-span-6">
            <MultiCheckbox
              items={districtTime}
              value={formData.available_times}
              label="الوقت"
              required={true}
              name="available_times"
              placeholder="اختر الوقت"
              prependIcon="mdi mdi-calendar-month-outline"
              iconType="mdi"
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  ["available_times"]: value,
                }));
              }}
            ></MultiCheckbox>
          </div> */}



          {/* // setFormData((prev) => ({
    //   ...prev,
    //   payment: [...prev.payment,

    //   ['payment_method']: selectedPayment.id

    //   ]
    // })) */}














        </div>








      </div>


    </div>
  )
}

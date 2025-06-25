
'use client'
import Payment from '@/components/user-tabs/payment'
import PersonalData from '@/components/user-tabs/personalData'
import Subscription from '@/components/user-tabs/subscription'
import { getUserByIdService } from '@/services/userService'
import { IsUser, User, Users } from '@/types/auth.interface'
import React, { useEffect, useState } from 'react'

// type Props = {
//   params: { id: number }
// }

type Btn = {
  name: string,
  type: string

}

export default function page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = React.use(params);
  const [user, setUser] = useState<IsUser | null>(null)
  const [selectedBtn, setSelectedBtn] = useState<Btn | null>(null)
  const [type, setType] = useState('personal-data')
  const fetchUserById = () => {
    getUserByIdService(id).then((response) => {
      setUser(response.data)

    })
  }
  const btnTabs = [
    { name: 'الملف الشخصي', type: "personal-data" },
    { name: 'الاشتراك', type: "subscription" },
    { name: 'المدفوعات', type: "payment" }
  ]

  const handleChangeBtnType = (item) => {
    setType(item)
  }

  useEffect(() => {
    if (selectedBtn) {

      selectedBtn.type = 'personal-data'
    }
  }, [])
  useEffect(() => {
    fetchUserById()
  }, [])
  return (
    <>

      <div className='container py-20'>



        <div className='bg-[#009414F0]  rounded-xl px-6 py-8 text-white'>
          <div className='mb-5'>
            <h4 className='mb-1 font-bold '>{user?.name}</h4>
            <p >{user?.subscription_name ? user?.subscription_name : '**********'}</p>
          </div>
          <div className='flex items-center gap-4'>
            {btnTabs.map((item, index) => (
              <button key={index} onClick={() => handleChangeBtnType(item.type)} className={`relative ${type == item.type ? 'before:absolute  before:w-full before:h-[0.5] before:-bottom-3 before:bg-white ' : ''}`}>{item.name}</button>
            ))}
          </div>
        </div>



        <div>

          {type == 'personal-data' && user && <PersonalData user={user} />}
          {type == 'subscription' && user && <Subscription user={user} />}
          {type == 'payment' && <Payment />}
          <Payment />
        </div>



      </div>
    </>
  )
}

import React, { useEffect, useState } from 'react'
import TextFieldNada from '../ui/form/TextFieldNada'
import { Users } from '@/types/auth.interface'


type Props = {
  user: Users |null
}
export default function personalData({ user }: Props) {

  useEffect(()=>{
    console.log('user',user)
  })

  return (
    <div className='container'>

      <div className='bg-white rounded-xl  px-3 '>
        <h3 className='font-bold py-14'>الملف الشخصي</h3>


<div className='grid grid-cols-2 lg:gap-5'>
        <div className="lg:col-span-1 col-span-2 input-wrap mb-14">
          <TextFieldNada
            label="اسم المستخدم"
            name="phone"
            type="text"
            placeholder="اسم المستخدم"
            value={user?.name}

            handleChange={()=>{}}

          ></TextFieldNada>
        </div>
        <div className="lg:col-span-1 col-span-2 input-wrap mb-14">
          <TextFieldNada
            label="رقم الموبايل"
            name="phone"
            type="number"
            placeholder="رقم الموبايل"
            value={user ?  user.phone : ''}
            handleChange={()=>{}}

          ></TextFieldNada>
        </div>
        

</div>





      </div>



    </div>
  )
}

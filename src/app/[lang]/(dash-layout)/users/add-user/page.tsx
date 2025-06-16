
'use client'

import TextFieldNada from '@/components/ui/form/TextFieldNada'
import React, { useState } from 'react'

export default function page() {
    const takeValue = (e) => {
        console.log(e.target.value)
        form.name=e.target.value
        
    }
    const form = {
        name: '',
        phone: '',
        password: '',
    }
    return (
        <div>

            <div className='bg-white rounded-xl'>
                <p className='font-bold'>اضافة مستخدم جديد</p>
                <div className='pt-12'>

                    <div>

                        {/* <TextFieldNada name='name' type='text' handleChange={takeValue} value={form.name} label='اسم المستخدم' placeholder='اسم المستخدم'></TextFieldNada> */}
                    </div>
                </div>

            </div>
        </div>
    )
}

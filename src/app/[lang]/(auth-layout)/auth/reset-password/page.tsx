

'use client'
import TextFieldNada from '@/components/ui/form/TextFieldNada'
import { loginService } from '@/services/authServices';
import React, { useState } from 'react'

export default function page() {
  const [formData, setFormData] = useState({
    email: ""
  })
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const confirmHandler = (e) => {

  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('email', formData.email)
    loginService(fd).then((response) => {
      console.log('yes im logged in')
    })

  }
  return (

    <>
      <div className="w-full min-h-screen pt-20">
        <div className="container">
          <div className="flex justify-center items-center">

            <div className=''>

              <div className="">


                <h3 className="text-2xl font-bold text-center mb-5">
                  استعادة كلمة المرور
                </h3>


                <p className="text-muted font-semibold ">
                  يرجي إدخال بريدك الإلكتروني المسجل أدناه، وسنرسل لك تعليمات إعادة تعيين كلمة مرورك.
                </p>


                <form onSubmit={handleResetPassword} className="pt-20">


                  <div className="input-wrap mb-14">
                    <TextFieldNada
                      // errorMessage={formDateError.email}
                      label="البريد الالكتروني"
                      name="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      handleChange={inputChangeHandler}
                    ></TextFieldNada>
                  </div>



                  <div className="mt-4 flex items-center justify-center gap-4">
                    <button
                      type="submit"
                      className="base-btn min-w-[200px]"
                      onClick={confirmHandler}

                    >
                      تأكيد
                    </button>
                    <button
                      type="button"
                      className="btn-secondary px-10"

                    >
                      الغاء
                    </button>
                  </div>

                </form>
              </div>
          
          
            </div>


          </div>
        </div>
      </div>
    </>


  )
}

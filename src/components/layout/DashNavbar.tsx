import React from 'react'
import UIDarkBtn from '../ui/UIDarkBtn'
import LangSwitcher from '../shared/LangSwitcher'
import { getDictionary } from '@/app/dictionaries';

export default async function DashNavbar({lang, dict}) {
  return (
    <>
      <nav className="">
        <div className="flex justify-between items-center p-6">
          <div className="title font-bold text-lg">{dict.welcome}</div>
          <div className="flex justify-center items-center gap-4">
            <UIDarkBtn lang={lang} />
            <LangSwitcher dict={dict} />
            <div className="block md:hidden">
            <span className="mdi mdi-menu text-2xl"></span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

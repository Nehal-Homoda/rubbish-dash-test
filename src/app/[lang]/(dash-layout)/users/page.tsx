import UsersDataTable from '@/components/data-tables/UsersDataTable'
import UIDashCard from '@/components/ui/UICardYara'
import React from 'react'

export default function users() {
  return (
 <>    <UIDashCard shadow="shadow-xl">
           <UsersDataTable/>
         </UIDashCard></>
  )
}

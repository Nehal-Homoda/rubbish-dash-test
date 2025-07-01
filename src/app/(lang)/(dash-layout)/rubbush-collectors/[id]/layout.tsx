import React from 'react'
import CollectorHeader from './parts/CollectorsHeader';





type Props = {
    // children: React.ReactNode;
    content: React.ReactNode;
}




export default function CollectorsLayout({content}: Props) {
  return (
    <>
        <CollectorHeader></CollectorHeader>
        {/* {children} */}
        {content}
    </>
  )
}

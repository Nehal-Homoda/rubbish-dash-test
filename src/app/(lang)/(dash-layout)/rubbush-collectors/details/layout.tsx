import React from 'react'
import CollectorHeader from './CollectorsHeader';





type Props = {
    content: React.ReactNode;
}




export default function CollectorsLayout({content}: Props) {
  return (
    <>
        <CollectorHeader></CollectorHeader>
        {content}
    </>
  )
}

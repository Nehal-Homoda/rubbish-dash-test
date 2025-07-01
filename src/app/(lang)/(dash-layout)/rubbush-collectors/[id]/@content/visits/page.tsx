import React from 'react'
import Visits from './Visits';



export async function generateStaticParams() {
    return [
        { id: "1" },
    ];
}



export default function page() {
  return (
    <div>
        <Visits></Visits>
    </div>
  )
}



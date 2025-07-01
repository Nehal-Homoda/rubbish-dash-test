import React from 'react'
import Profile from './Profile';



export async function generateStaticParams() {
    return [
        { id: "1" },
    ];
}



export default function page() {
  return (
    <div>
        <Profile></Profile>
    </div>
  )
}



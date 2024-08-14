"use client";
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
type Props = {}

const Header = (props: Props) => {
    const router = useRouter()
    return (
        <div onClick={() => { router.push("/explore") }} className='w-full max-w-[388px] flex space-x-3 items-center mb-[30px]'>
            <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px]  cursor-pointer' />
            <h1 className='text-[18px] font-medium leading-[24.35px] text-[#FFFFFF] cursor-pointer'>Explore Coach</h1>
        </div>
    )
}

export default Header
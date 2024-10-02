"use client";
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
type Props = {}

const Header = (props: Props) => {
    const router = useRouter()
    return (
        <div className='flex items-center max-w-[388px] w-full justify-between mb-[30px]'>
            <div onClick={() => {
                router.push("/profile")
            }} className='cursor-pointer flex space-x-3 items-center'>
                <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px]  cursor-pointer' />
                <h1 className='text-[18px] font-medium leading-[24.35px] text-[#FFFFFF]'>Wallet</h1>
            </div>

        </div>
    )
}

export default Header
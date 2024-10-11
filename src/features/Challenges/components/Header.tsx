"use client";
import { ChallengeContext } from '@/context/ChallengeContext';
import React, { useContext, useState } from 'react'
import { useTranslations } from "next-intl";

type Props = {}

const Header = (props: Props) => {
    const { tab, setTab } = useContext(ChallengeContext)
    const t = useTranslations('Home.Challenge');
    return (

        <div className='w-full  max-w-[388px] h-[48px]'>
            <div className='w-full h-full border bg-[#1f1f1f] border-[#F5F7F8] rounded-[38px] flex '>
                <div onClick={() => { setTab(0) }} className={`w-1/2 h-full  ${tab === 0 && "bg-[#357EF8] rounded-[38px]"}  grid cursor-pointer place-items-center`}>
                    <h1 className='text-[16px] font-semibold leading-[12.13px] tracking-[0.3%] text-[#FFFFFF]'>{t("Challenges")}</h1>
                </div>

                <div onClick={() => { setTab(1) }} className={`w-1/2 h-full px-4 py-2  ${tab === 1 && "bg-[#357EF8] rounded-[38px]"} cursor-pointer  grid place-items-center`}>
                    <h1 className='text-[16px] font-semibold leading-[17.13px] tracking-[0.3%] text-[#FFFFFF]'>{t("Current")}</h1>
                </div>
            </div>
        </div>
    )
}

export default Header
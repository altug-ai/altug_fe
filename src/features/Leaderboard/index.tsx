"use client";
import Image from 'next/image'
import React, { useState } from 'react'
import TabBar from '../Profile/components/TabBar'
import Sort from './componets/Sort'
import Ranking from './componets/Ranking'
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import { IoIosMenu } from 'react-icons/io';
// import Widget from '@/components/Widget';
type Props = {}


const LeaderBoard = (props: Props) => {
    const router = useRouter()
    const [openn, setOpenn] = useState<boolean>(false)
    const t = useTranslations('Home.Leaderboard');

    return (
        <div className='py-[20px] px-[20px] h-full  flex flex-col items-center '>


            <div className='w-full cursor-pointer max-w-[388px] flex space-x-3 items-center mb-[30px]'>
                <Image onClick={() => {
                    router.push("/settings")
                }} src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px]  cursor-pointer' />
                <h1 className='text-[18px] font-medium leading-[24.35px] text-[#FFFFFF]'>{t("Leaderboard")}</h1>
            </div>

            {/* the select boxes */}
            <Sort />

            {/* The rankings */}
            <Ranking />
            <TabBar page='menu' />
        </div>
    )
}

export default LeaderBoard
"use client";
import Image from 'next/image';
import React from 'react'
import { useTranslations } from "next-intl";
import { useRouter } from '@/navigation';
import TabBar from '../Profile/components/TabBar';
type Props = {
    language: string;
}

const Language = ({ language }: Props) => {
    const t = useTranslations('Home.Settings');
    const router = useRouter();

    const ChangeToEnglish = () => {
        router.replace('/language', { locale: 'en' });
    }

    const ChangeToTurkish = () => {
        router.replace('/language', { locale: 'tr' });
    }

    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>

            {/* the header */}
            <div className='flex items-center max-w-[388px] w-full justify-between mb-[30px]'>
                <div onClick={() => {
                    router.push("/settings")
                }} className='cursor-pointer flex space-x-3 items-center'>
                    <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px]  cursor-pointer' />
                    <h1 className='text-[18px] font-medium leading-[24.35px] text-[#FFFFFF]'>{t("Language")}</h1>
                </div>
            </div>

            {/* the languages */}
            <div onClick={ChangeToTurkish} className='max-w-[388px] w-full flex justify-between mb-10 items-center cursor-pointer'>
                <div className='flex space-x-5 items-center'>
                    <Image className="w-[48px] h-[48px]" alt='The turkey flag' src={'/onboard/TurkeyFlag.png'} width={600} height={600} />
                    <h1 className='text-[16px] leading-[16px] font-medium text-white font-plus'>{t("Turkish")}</h1>
                </div>
                {   
                    language === "tr" && (
                        <Image src={"/auth/Check.png"} alt='Check' width={600} height={600} className='w-[18px] h-[18px]' />
                    )
                }
            </div>

            <div onClick={ChangeToEnglish} className='max-w-[388px] w-full flex justify-between items-center cursor-pointer'>
                <div className='flex space-x-5 items-center'>
                    <Image className="w-[48px] h-[48px]" alt='The turkey flag' src={'/onboard/USA.png'} width={600} height={600} />
                    <h1 className='text-[16px] leading-[16px] font-medium text-white font-plus'>{t("US")}</h1>
                </div>

                {
                    language === "en" && (
                        <Image src={"/auth/Check.png"} alt='Check' width={600} height={600} className='w-[18px] h-[18px]' />
                    )
                }

            </div>

            <TabBar page='menu' />
        </div>
    )
}

export default Language
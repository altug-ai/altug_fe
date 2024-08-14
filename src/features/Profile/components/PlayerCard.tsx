"use client";
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";


type Props = {
    coach?: boolean;
    name?: string;
    position?: string;
    picture?: string;
    clubLogo?: string;
    id?: number;
    point?: number;
}


const PlayerCard = ({ name, position, picture, clubLogo, coach, id, point }: Props) => {
    const router = useRouter()
    const t = useTranslations('Home.Profile');


    return (
        <div className='w-full h-full bg-[#181928] flex space-x-2 rounded-[8px] px-[10px] pt-[10px] mb-[10px]'>

            <div className='w-[70%] mb-[9px]'>

                <Image src={clubLogo ?? "/profile/unknownc.png"} alt='club' width={400} height={400} className='h-[24px] w-[24px] object-cover rounded-xl' />

                <div className='flex justify-between items-center'>
                    <div className='flex flex-col space-y-2'>
                        <h1 className="font-medium text-[14.02px] leading-[24.53px] tracking-[0.26px] text-white">{name}</h1>
                        <h1 className='text-[9px] font-medium text-[#F5F7F8] leading-[9.56px]'>{position ?? t("Coach")}</h1>
                    </div>

                    <div className='  h-[50.81px] w-[48.18px] bg-cover flex flex-col items-center justify-center' style={{ backgroundImage: 'url("/profile/Number.png")' }}>
                        <h1 className='font-bold text-[24px] leading-[12.54px]   text-white'>{point ?? ""}</h1>
                    </div>
                </div>

                <div onClick={() => {
                    if (coach) {
                        router.push(`/chat/coach/${id}`)
                    } else {
                        router.push(`/chat/player/${id}`)
                    }
                }} className='rounded-[35px] cursor-pointer mt-3 w-full gap-[12px] h-[35.01px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                    {t("Coached")}
                </div>

                <div onClick={() => {
                    if (name) {
                        router.push(coach ? `/coach/${id}` : `/player/${id}`)
                    }

                }} className='rounded-[35px] cursor-pointer mt-3 w-full gap-[12px] border border-[#F5F7F8] h-[35.01px] bg-[#181928]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                    {t("Profile")}
                </div>
            </div>

            <div className='h-full w-[30%]'>
                <Image src={picture ?? "/profile/unknownp.png"} width={500} height={500} alt='player image' className='h-full w-full object-cover object-top rounded-xl' />
            </div>

        </div>
    )
}

export default PlayerCard
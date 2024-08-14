"use client";
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
    page?: string;
}

const TabBar = ({ page }: Props) => {
    const router = useRouter();
    const t = useTranslations('Home.Tab');
    return (
        <div className='fixed bottom-0  w-full max-w-[388px] '>
            <div className='flex justify-between  bg-black bg-opacity-[75%] pb-[10px] px-[10px] items-center'>
                <div onClick={() => {
                    router.push("/profile")
                }} className={`flex flex-col w-[82px] cursor-pointer py-[5px] space-y-2 items-center ${page === "profile" && "border-t-[2px] border-t-[#357EF8]"}`}>
                    <Image src={`${page !== "profile" ? "/profile/SlateProfile.png" : "/profile/tabprof.png"}`} alt='profile' width={300} height={300} className='h-[24px] w-[24px] object-cover' />
                    <h1 className={`font-medium text-[12px] ${page === "profile" ? "text-[#357EF8]" : "text-white"}  leading-[18px] tracking-[0.15px] `}>{t("Profile")}</h1>
                </div>


                <div onClick={() => {
                    router.push("/explore")
                }} className={`flex flex-col w-[82px] cursor-pointer py-[5px] space-y-2 items-center ${page === "explore" && "border-t-[2px] border-t-[#357EF8]"}`}>
                    <Image src={`${page !== "explore" ? "/profile/discover.png" : "/tab/discover.png"}`} alt='explore' width={300} height={300} className='h-[24px] w-[24px] object-cover' />
                    <h1 className={`font-medium text-[12px] ${page === "explore" ? "text-[#357EF8]" : "text-white"}  leading-[18px] tracking-[0.15px] `}>{t("Explore")}</h1>
                </div>


                <div onClick={() => {
                    router.push("/challenge")
                }} className={`flex flex-col w-[82px] cursor-pointer py-[5px] space-y-2 items-center ${page === "challenge" && "border-t-[2px] border-t-[#357EF8]"}`}>
                    <Image src={`${page !== "challenge" ? "/profile/flag.png" : "/tab/flag.png"}`} alt='explore' width={300} height={300} className='h-[24px] w-[24px] object-cover' />
                    <h1 className={`font-medium text-[12px] ${page === "challenge" ? "text-[#357EF8]" : "text-white"}  leading-[18px] tracking-[0.15px] `}>{t("Challenge")}</h1>
                </div>


                <Popover>
                    <PopoverTrigger>
                        <div className={`flex flex-col w-[82px] cursor-pointer py-[5px] space-y-2 items-center ${page === "menu" && "border-t-[2px] border-t-[#357EF8]"}`}>
                            <Image src={`${page !== "menu" ? "/profile/menu.png" : "/tab/menu.png"}`} alt='explore' width={300} height={300} className='h-[24px] w-[24px] object-cover' />
                            <h1 className={`font-medium text-[12px] ${page === "menu" ? "text-[#357EF8]" : "text-white"}  leading-[18px] tracking-[0.15px] `}>{t("Menu")}</h1>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className='flex flex-col space-y-2 bg-black'>
                        <h1 onClick={() => {
                            router.push("/settings")
                        }} className='bg-[#357EF8] text-white  w-full py-3 px-3 rounded-md cursor-pointer'>{t("Settings")}</h1>
                        {/* <h1 onClick={() => {
                            router.push("/language")
                        }} className='bg-[#357EF8] text-white  w-full py-3 px-3 rounded-md cursor-pointer'>{t("Settings")}</h1> */}
                        <h1 onClick={() => {
                            router.push("/leaderboard")
                        }} className='bg-[#357EF8] text-white  w-full py-3 px-3 rounded-md cursor-pointer'>{t("Leaderboard")}</h1>
                    </PopoverContent>
                </Popover>



            </div>
        </div>
    )
}

export default TabBar
"use client";
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'
import { TbLoader3 } from 'react-icons/tb';
import { useTranslations } from "next-intl";

type Props = {
    handleSubmit: () => Promise<void>;
    loader: boolean;
}

const EmailVerified = ({ handleSubmit, loader }: Props) => {
    const router = useRouter()
    const t = useTranslations('Home.Password');

    return (
        <div className='py-[20px]  px-[20px] h-full flex flex-col items-center '>
            <div className='py-[20px] opacity-50  px-[20px] h-full flex flex-col items-center '>
                <div className='w-full max-w-[388px]'>
                    <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px] mb-[30px] cursor-pointer' />
                </div>


                <div className='flex flex-col space-y-2 mb-10 w-full max-w-[388px]'>
                    <h1 className='font-bold text-[36px] leading-[45.36px] text-[#F5F7F8]'>{t("EmailVeri")}</h1>
                    <h1 className='font-normal text-[20px] leading-[20px] tracking-[1px] text-[#F5F7F8]  '>{t("WeHave")}</h1>
                </div>
            </div>


            <div className='w-full z-50 max-w-[388px] mt-[30px] flex flex-col items-center'>
                <Image src={"/tab/Mark.png"} className='w-[185.93px] h-[180px]' alt='mark png' width={500} height={500} />

                <h1 className='max-w-[174px] text-[36px] font-bold leading-[44px] tracking-[0.15px] text-white mt-[5px]'>{t("Verified")}</h1>
                <div onClick={handleSubmit} className='rounded-[35px]  cursor-pointer mt-[40px] w-full max-w-[277px] gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                    {
                        loader ? (
                            <TbLoader3 className="text-white w-7 h-7 animate-spin" />
                        ) : (
                            t("Continue")
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default EmailVerified
"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { getTimeData } from '../functions/functions';

type Props = {
    system?: boolean;
    user?: boolean;
    message: string;
    date?: string;
    image?: string;
    premium?: boolean;
    voices?: any;
}

const Message = ({ system, user, message, date, image, premium, voices }: Props) => {


    const theSpeaker = async () => {
        console.log("here")
        const utterance = new SpeechSynthesisUtterance(message);
        if (voices?.[6]) {
            utterance.voice = voices[6];
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }





    return (
        <div className={`mb-[30px] ${user ? "flex justify-end" : "flex justify-start "}`}>

            {
                system ? (
                    <div className='flex space-x-3 items-start'>
                        <div className=" relative w-[20px] h-[20px]">
                            <Image src={image ?? "/onboard/account.png"} width={500}
                                height={500} alt='account icon'
                                className=' object-cover object-top  rounded-full h-[20px] w-[20px]' />
                        </div>

                        <div className='bg-[#F5F7F8] max-w-[90%] px-[20px] py-[10px] flex flex-col space-y-2 rounded-r-[12px] rounded-tl-[12px]'>
                            {
                                premium && (
                                    <div onClick={() => {
                                        theSpeaker()
                                    }} className='w-full flex justify-end'>
                                        <HiMiniSpeakerWave className='h-4 w-4 text-slate-800 cursor-pointer' />
                                    </div>

                                )
                            }
                            <h1 className='text-[14px] leading-[18px] font-medium text-[#181928]'>{message}</h1>
                            <h1 className='text-[#706A6A] text-[13px] leading-[16px] font-normal '>{date ? date : "10:54am"}</h1>
                        </div>
                    </div>
                ) : (
                    <div className=''>
                        <div className='bg-[#357EF8] px-[20px] py-[10px] flex flex-col space-y-2 rounded-l-[12px] rounded-tr-[12px]'>
                            <h1 className='text-[14px] leading-[18px] font-medium text-[#F5F7F8]'>{message}</h1>
                            <h1 className='text-[##E6E6E6] text-[13px] text-end leading-[16px] font-normal '>{date ? date : "10:54am"}</h1>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default Message
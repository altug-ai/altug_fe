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
    voice?: any;
    audioRef?: any;
    role?: any
}


const Message = ({ system, user, message, date, image, premium, voice, audioRef, role }: Props) => {





    const getElevenLabsResponse = async (text: string) => {
        const response = await fetch("/api/speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text,
                voice: voice
            })
        });

        if (response?.statusText === "Unauthorized") {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }

        const data = await response.blob();

        return data;
    };


    function removeTextBetweenDelimiters(text: string) {

        if (!text) {
            return ""
        }
        // Use regex to match the prompt and content
        const regex = /\$@@(.*)/;
        const match = text.match(regex);

        // If a match is found, extract the content after the prompt
        if (match) {
            return match[1];
        } else {
            // If no match is found, return the original string
            return text;
        }
    }


    const theSpeaker = async () => {
        const botVoiceResponse = await getElevenLabsResponse(message);
        const reader = new FileReader();
        reader.readAsDataURL(botVoiceResponse);
        reader.onload = () => {
            if (audioRef.current) {
                audioRef.current.src = reader.result as string;
                audioRef.current.play();
            }
        };
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

                            <h1 className='text-[14px] leading-[18px] font-medium text-[#181928]'>{removeTextBetweenDelimiters(message)}</h1>
                            <h1 className='text-[#706A6A] text-[13px] leading-[16px] font-normal '>{date ? date : "10:54am"}</h1>
                        </div>
                    </div>
                ) : (
                    <div className=''>
                        <div className='bg-[#357EF8] px-[20px] py-[10px] flex flex-col space-y-2 rounded-l-[12px] rounded-tr-[12px]'>
                            {
                                role === "tool" ? (
                                    <Image src={message} width={600} height={600} alt='Message image' className='max-w-[200px] max-h-[200px] object-cover rounded-md' />
                                ) : role === "data" ? (
                                    <video className='h-[192.52px] w-full object-cover rounded-md grid place-items-center my-7' controls preload="none">
                                        <source src={message} type="video/mp4" />
                                    </video>
                                ) : (
                                    <h1 className='text-[14px] leading-[18px] font-medium text-[#F5F7F8]'>{removeTextBetweenDelimiters(message)}</h1>
                                )
                            }
                            <h1 className='text-[##E6E6E6] text-[13px] text-end leading-[16px] font-normal '>{date ? date : "10:54am"}</h1>
                        </div>
                    </div>
                )
            }

        </div >
    )
}

export default Message     
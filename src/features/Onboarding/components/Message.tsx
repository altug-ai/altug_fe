"use client";
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { getTimeData } from '../functions/functions';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { CoachContext } from '@/context/CoachContext';
import { TbLoader3 } from 'react-icons/tb';

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
    audioEnabled?: boolean;
    setAudioEnabled?: Dispatch<SetStateAction<boolean>>;
    content?: any
}


const Message = ({ system, user, message, date, image, premium, voice, audioRef, role, audioEnabled, setAudioEnabled, content }: Props) => {

    let [isOpen, setIsOpen] = useState(false)
    const [loader, setLoader] = useState<boolean>(false)

    function removeAsterisks(str: string) {
        if (!str) {
            return "";
        }
        return str.replace(/[\*#]/g, '');
    }

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

        if (response?.status === 401) {
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
        try {
            setLoader(true)
            let mess = removeAsterisks(message)
            const botVoiceResponse = await getElevenLabsResponse(mess);
            const reader = new FileReader();
            reader.readAsDataURL(botVoiceResponse);
            reader.onload = () => {
                if (audioRef.current) {
                    audioRef.current.src = reader.result as string;
                    setLoader(false)
                    audioRef.current.play();
                }
            };
        } catch (error) {
            console.error("this is the error", error)
            setLoader(false)
        }
    }


    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    function extractUrlFromString(input: string): string | false {
        try {
            const fixedContent = input.replace(/\n\s*/g, "").trim();

            // Extract the URL using regex instead of JSON parsing
            const match = fixedContent.match(/url:(https?:\/\/[^\s]+)/);

            if (match) {
                return match[1];
            }

            return false;
        } catch (error) {
            return false;
        }
    }
    const extract = useMemo(() => extractUrlFromString(message), [message]);



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
                                        if (loader) {
                                            return
                                        }
                                        if (!audioEnabled) {
                                            open()
                                        } else {
                                            theSpeaker()
                                        }
                                    }} className='w-full flex justify-end'>
                                        {
                                            loader ? (
                                                <TbLoader3 className="text-[#1B76FF] w-4 h-4 animate-spin" />
                                            ) : (
                                                <HiMiniSpeakerWave className='h-4 w-4 text-[#1B76FF] cursor-pointer' />
                                            )
                                        }

                                    </div>

                                )
                            }

                            <h1 className='text-[14px] leading-[18px] font-medium text-[#181928]'>{removeAsterisks(removeTextBetweenDelimiters(message))}</h1>
                            <h1 className='text-[#706A6A] text-[13px] leading-[16px] font-normal '>{date ? date : "10:54am"}</h1>
                        </div>
                    </div>
                ) : (
                    <div className=''>
                        <div className='bg-[#357EF8] px-[20px] py-[10px] flex flex-col space-y-2 rounded-l-[12px] rounded-tr-[12px]'>
                            {
                                content?.image_url ? (
                                    <div>
                                        <Image src={content?.image_url?.url} width={600} height={600} alt='Message image' className='max-w-[200px] max-h-[200px] object-cover rounded-md' />
                                    </div>
                                ) : role === "tool" ? (
                                    <Image src={message} width={600} height={600} alt='Message image' className='max-w-[200px] max-h-[200px] object-cover rounded-md' />
                                ) : role === "data" ? (
                                    <video className='h-[192.52px] max-w-[300px] w-full   rounded-md  my-7' controls preload="none">
                                        <source src={message} type="video/mp4" />
                                    </video>
                                ) : (
                                    <>
                                        {
                                            message?.startsWith("data:image/") ? (
                                                <Image src={message} width={600} height={600} alt='Message image' className='max-w-[200px] max-h-[200px] object-cover rounded-md' />
                                            ) : (
                                                <>
                                                    {
                                                        extract ? (
                                                            <video className='max-h-[200px] min-w-[200px] max-w-[300px]   rounded-md  my-7' controls preload="none">
                                                                <source src={extract} type="video/mp4" />
                                                            </video>
                                                        ) : (
                                                            <h1 className='text-[14px] leading-[18px] font-medium text-[#F5F7F8]'>{removeTextBetweenDelimiters(message)}</h1>
                                                        )
                                                    }
                                                </>

                                            )
                                        }
                                    </>

                                )


                            }
                            <h1 className='text-[##E6E6E6] text-[13px] text-end leading-[16px] font-normal '>{date ? date : "10:54am"}</h1>
                        </div>
                    </div>
                )
            }


            {/* if the audio is not enabled */}
            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-[#262629] bg-opacity-95 backdrop-blur-md p-6  duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-3"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                Permission Required

                            </DialogTitle>
                            <p className="mt-2 text-sm/6 text-white">
                                Enable Audio?
                            </p>
                            <div className="mt-4 flex items-center space-x-2">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={close}
                                >
                                    No
                                </Button>
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={() => {
                                        const utterance = new SpeechSynthesisUtterance("");
                                        window.speechSynthesis.cancel();
                                        window.speechSynthesis.speak(utterance);
                                        if (audioRef?.current) {
                                            audioRef?.current?.play();
                                        }
                                        if (setAudioEnabled) {
                                            setAudioEnabled(true);
                                        }

                                        close();
                                        theSpeaker();
                                    }}
                                >
                                    Yes
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div >
            </Dialog >

        </div >
    )
}

export default Message     
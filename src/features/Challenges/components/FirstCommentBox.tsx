import Image from 'next/image'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { HiMiniSpeakerWave } from 'react-icons/hi2';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useTranslations } from "next-intl";
import { TbLoader3 } from 'react-icons/tb';

type Props = {
    nameHeader?: string | null;
    coach?: boolean;
    comment: string;
    profile: string;
    voice?: string;
    audioEnabled?: boolean;
    setAudioEnabled?: Dispatch<SetStateAction<boolean>>;

}

const FirstCommentBox = ({ nameHeader, coach, comment, profile, voice, audioEnabled, setAudioEnabled }: Props) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    let [isOpen, setIsOpen] = useState(false)
    const [loader, setLoader] = useState<boolean>(false)
    const t = useTranslations('Home.Comments');

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

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
                voice: voice ?? "Adam"
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


    const theSpeaker = async () => {
        try {
            setLoader(true)
            let mess = removeAsterisks(comment)
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

    return (
        <div className='flex space-x-4 items-start'>
            <div className='relative w-[26px] h-[26px]'>
                <Image
                    src={profile ?? "/profile/unknownp.png"}
                    alt='profile pic'
                    width={500}
                    height={500}
                    className='w-[26px] h-[26px] object-cover object-top rounded-full'
                />
            </div>

            {/* The name and the comment */}
            <div className='flex max-w-[90%] flex-col space-y-[4px]'>
                <div className='flex items-center space-x-[3px]'>
                    <h1 className='text-[14px] leading-[17.64px] font-bold text-[#EAFF62]'>{nameHeader}</h1>
                    {
                        coach && (
                            <div className='px-[8px] py-[1px] rounded-[8px] bg-[#EAFF62] text-black text-[12px] leading-[15.12px] font-medium font-plus'>
                                {t("Coach")}
                            </div>
                        )
                    }

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
                </div>
                <h1 className='text-[12px] leading-[13.8px] font-normal text-white'>
                    {comment}
                </h1>

            </div>

            <audio ref={audioRef}>
                <source type="audio/mp3" />
            </audio>


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
        </div>



    )
}

export default FirstCommentBox
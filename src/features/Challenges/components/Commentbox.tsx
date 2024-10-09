import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext, useRef, useState } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { FaHeart } from "react-icons/fa6";
import { AuthContext } from '@/context/AuthContext';
import axios from 'axios';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { HiMiniSpeakerWave } from 'react-icons/hi2';


type Props = {
    nameHeader?: string | null;
    time: string;
    comment: string;
    profile: string;
    newlikes: number[];
    id: number;
    coach?: boolean;
    audioEnabled?: boolean;
    setAudioEnabled?: Dispatch<SetStateAction<boolean>>;
    voice?: any;
}
const TimeAgo = (timestamp: any) => {
    const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

    return timeAgo
};

const Commentbox = ({ nameHeader, time, comment, profile, newlikes, id, coach, audioEnabled, setAudioEnabled, voice }: Props) => {
    const { profileId, jwt } = useContext(AuthContext)
    const [likes, setLikes] = useState<number[]>(newlikes)
    const audioRef = useRef<HTMLAudioElement>(null);
    let [isOpen, setIsOpen] = useState(false)



    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    const handleCommentLike = async () => {
        if (profileId) {
            setLikes([...likes, profileId])
        }

        try {
            const data = {
                data: {
                    likes: {
                        connect: [profileId],
                    },
                },
            };

            const updatelikes = await axios.put(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/comments/${id}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            return updatelikes
        } catch (error) {
            console.error(error);
        }
    }


    const handleCommentDislike = async () => {
        let newLike = likes?.filter((like) => {
            like !== profileId
        })
        setLikes(newLike)
        try {
            const data = {
                data: {
                    likes: {
                        disconnect: [profileId],
                    },
                },
            };

            const updatelikes = await axios.put(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/comments/${id}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            return updatelikes
        } catch (error) {
            console.error(error);
        }
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

        let mess = removeAsterisks(comment)
        const botVoiceResponse = await getElevenLabsResponse(mess);
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
        <div className='flex space-x-[12px] items-start my-[7px]'>
            <div className=' relative w-[32px] h-[32px]'>
                <Image src={profile ?? "/profile/unknownp.png"} alt='profile pic' width={500} height={500} className='w-[32px] h-[32px] object-cover object-top  rounded-full' />
            </div>

            {/* the name and the left */}
            <div className='flex flex-col space-y-[4px] max-w-[80%]'>
                <div className='flex items-center space-x-[3px]'>
                    <h1 className='text-[12px] leading-[19.2px] font-normal text-white'>{nameHeader} • {TimeAgo(time)}</h1>
                    {
                        coach && (
                            <div className='px-[8px] py-[1px] rounded-[8px] bg-[#EAFF62] text-black text-[12px] leading-[15.12px] font-medium font-plus'>
                                Coach
                            </div>
                        )
                    }

                    {
                        coach && (
                            <div onClick={() => {
                                if (!audioEnabled) {
                                    open()
                                } else {
                                    theSpeaker()
                                }
                            }} className='w-full flex justify-end'>
                                <HiMiniSpeakerWave className='h-4 w-4 text-[#1B76FF] cursor-pointer' />
                            </div>
                        )
                    }

                </div>
                <h1 className='text-[14px] leading-[21px] font-normal text-white'>{comment}</h1>

                <div className='flex space-x-[2.5px] items-center'>
                    {
                        profileId && (
                            <FaHeart onClick={() => {
                                if (likes?.includes(profileId)) {
                                    handleCommentDislike()
                                } else {
                                    handleCommentLike()
                                }
                            }} className={`cursor-pointer ${likes?.includes(profileId) ? "text-red-500" : "text-slate-200"}`} />
                        )
                    }

                    {/* <Image src={"/profile/like.png"} width={500} height={500} alt='like' className='h-[20px] w-[20px]' /> */}
                    <h1 className='text-[12px] leading-[14.52px] text-[#98A2B3]'>
                        {likes?.length}
                    </h1>
                </div>
            </div>
            <audio ref={audioRef}>
                <source type="audio/mp3" />
            </audio>


            {/* if the audio is not enabled */}
            <Dialog open={isOpen} as="div" className="relative z-[1000000000] focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-[10000000] w-screen overflow-y-auto">
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

export default Commentbox
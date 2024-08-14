"use client";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image';
import TabBar from '../Profile/components/TabBar';
import { Input } from '@/components/ui/input';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { TbLoader3 } from 'react-icons/tb';
import Message from '../Onboarding/components/Message';
import { ScrollArea } from "@/components/ui/scroll-area"
import { v4 as uuidv4 } from 'uuid';
import { Skeleton } from '@/components/ui/skeleton';
import { experimental_useAssistant as useAssistant } from "ai/react";
import { addMessageLeft, createChatt, existsIdInArray, followPlayer, UpdateChatt } from '../CoachChat/functions/functions';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

type Props = {}

const PlayerChat = (props: Props) => {
    const router = useRouter()
    const params = useParams();
    const { slug }: any = params;
    const { jwt, loading: loader, profileId, handleSubscribe, players, setPlayers, playerIds, setPlayerIds } = useContext(AuthContext)
    const [data, setData] = useState<any>({})
    const [prompt, setPrompt] = useState<string>("")
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [aiLoader, setAILoader] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [response, setResponse] = useState("")
    const [message, setMessage] = useState<any[]>([]);
    const [messagesLeft, setMessagesLeft] = useState<number>(3)
    const [tier, setTier] = useState<any>()
    const [chatId, setChatId] = useState()
    const [previous, setPrevious] = useState([])
    const [threadIdd, setThreadId] = useState("")
    const [paid, setPaid] = useState<boolean>(false)
    const [previousLoad, setPreviousLoad] = useState<boolean>(false)
    let [isOpen, setIsOpen] = useState(false)
    const hasFetchedChat = useRef(false);

    const {
        status,
        messages,
        input,
        submitMessage,
        handleInputChange,
        setInput,
        error,
        threadId,
    } = useAssistant({
        api: "/api/coach-assistant",
        body: {
            assistantId: data?.attributes?.assistantId,
            userThreadId: threadIdd,
            // fileId: fileId,
            // // userThreadId,
        },
    });

    useEffect(() => {
        const fetchMessages = async () => {
            setPreviousLoad(true);
            const response = await fetcher('/api/get-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ threadId: threadIdd }),
            });
            console.log("this is teh response", response)
            if (response?.data && response?.data?.length > 0) {
                setPrevious(response?.data)
            }
            setPreviousLoad(false);
        };
        if (threadIdd !== "") {
            fetchMessages();
        }

    }, [threadIdd]);

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    useEffect(() => {
        scrollToBottom();

    }, [messages, input, previous]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.value?.trim() === "") {
            setPrompt("")
            return
        }

        setPrompt(e.target.value)
    }

    useEffect(() => {
        const getCoach = async (slug: any) => {
            setLoading(true);
            return fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats?filters[client_profile][$eq]=${profileId}&filters[player][id][$eq]=${slug}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
                .then(async (data) => {
                    if (data?.data[0]?.id) {
                        setChatId(data?.data[0]?.id)
                        setThreadId(data?.data[0]?.attributes?.threadId)
                        setMessagesLeft(data?.data[0]?.attributes?.messagesLeft)
                        setPaid(data?.data[0]?.attributes?.paid)
                    } else {
                        let createChattt = await createChatt(slug, jwt, profileId)
                        const updatedSett = new Set(playerIds);
                        updatedSett?.add(parseInt(slug));
                        setThreadId(createChattt?.data?.data?.attributes?.threadId)
                        setChatId(createChattt?.data?.data?.id)
                        setPaid(createChattt?.data?.data?.attributes?.paid)
                        setPlayerIds(updatedSett)
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("An error occured", error);
                });
        };

        if (slug && jwt && profileId && !chatId && !hasFetchedChat.current) {
            hasFetchedChat.current = true; // Set the ref to true to prevent future calls
            getCoach(slug);
        }
    }, [slug, jwt, profileId]);

    useEffect(() => {
        const getCoach = async (slug: any) => {
            setLoading(true);
            return fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/players/${slug}?populate[0]=profile&populate[1]=club`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
                .then((data) => {
                    setData(data?.data)
                    if (data?.data?.attributes?.type === "premium") {
                        setTier("premium")
                    } else {
                        setTier("free")
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("An error occured", error);
                });
        };

        if (slug && jwt) {
            getCoach(slug);
        }
    }, [slug, jwt]);




    const handleChat = async () => {


        if (!(playerIds?.has(parseInt(slug)))) {
            let createChat = await createChatt(slug, jwt, profileId)
            const updatedSett = new Set(playerIds);
            updatedSett?.add(parseInt(slug));
            setPlayerIds(updatedSett)
        } else {
            let updateChat = await UpdateChatt(slug, jwt, profileId, chatId)
        }

        if (tier === "premium" && !paid) {
            let message = messagesLeft && messagesLeft - 1

            let response = await addMessageLeft(chatId, jwt, message)
            if (response?.data?.data?.id) {
                if (setMessagesLeft) {
                    setMessagesLeft(message)
                }
            }
        }


        if (players && players?.data && players?.data?.length > 0) {
            let checkifFollows = existsIdInArray(players?.data, parseInt(slug))

            if (!checkifFollows) {
                // if the coach is not followed then do this logic
                let follow = await followPlayer(slug, profileId, jwt)
                if (follow?.data?.data?.attributes) {
                    setPlayers(follow?.data?.data?.attributes?.players)
                }
            }
        } else {
            let follow = await followPlayer(slug, profileId, jwt)
            if (follow?.data?.data?.attributes) {
                setPlayers(follow?.data?.data?.attributes?.players)
            }
        }
        return;


    }


    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>
            <div onClick={() => { router.push("/explore") }} className='w-full max-w-[388px] flex space-x-3 items-center mb-[30px]'>
                <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px]  cursor-pointer' />
                <h1 className='text-[18px] font-medium leading-[24.35px] text-[#FFFFFF] cursor-pointer'>Back To Profile</h1>
            </div>


            {
                (loader || loading) && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }

            {/* the middle */}
            <div className='w-full  h-[80vh] relative rounded-[12px] max-w-[388px] bg-[#181928] min-h-[8px] mb-[60px]'>
                <ScrollArea className='w-full  h-[90%]  max-w-[388px] text-white px-2'>
                    <div className='flex space-x-3 h-[20%]  items-center'>
                        <div className='  h-[94px] w-[103px] bg-cover ' style={{ backgroundImage: 'url("/profile/shape.png")' }}>
                            <Image src={data?.attributes?.profile?.data?.attributes?.url ?? data?.attributes?.pic_url ?? "/profile/unknownp.png"} alt='player image' width={500} height={500} className='max-w-[103px] object-cover rounded-xl object-top h-[94px]' />
                        </div>

                        <div className='flex flex-col space-y-[12px]'>
                            <h1 className='text-[24px] leading-[24.54px] tracking-[0.26px] font-medium text-white'>{data?.attributes?.name}</h1>
                            {
                                (tier === "premium" && !paid) && (
                                    <div onClick={() => { handleSubscribe(`/chat/player/${slug}`, chatId) }} className='rounded-[47px] cursor-pointer  w-[185px] gap-[12px] h-[36px] bg-[#357EF8]  text-[12px] font-medium leading-[15.12px] text-white flex flex-col justify-center items-center'>
                                        Upgrade to premium
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className='mt-[50px]  w-full grid place-items-center'>


                        {
                            data?.attributes?.prompts?.map((prompt: any) => (
                                <div onClick={() => {
                                    setInput(prompt)
                                }} key={prompt} className='rounded-[44px] cursor-pointer mb-[16px] px-5 py-2  w-[335px] gap-[12px] min-h-[44px] bg-[#3B424F]   flex flex-col justify-center items-center'>
                                    <div className='flex space-x-[10px] items-center text-[12px] font-medium leading-[24px] text-white'>
                                        <Image src={"/profile/flash.png"} width={500} height={500} alt='flash' className='object-cover h-[24px] w-[24px]' />
                                        <h1>{prompt}</h1>
                                    </div>
                                </div>
                            ))
                        }


                    </div>
                    {
                        (previousLoad) && (
                            <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                                <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                            </div>
                        )
                    }

                    {
                        previous?.slice()?.reverse()?.map((info: any) => (
                            <Message
                                image={data?.attributes?.profile?.data?.attributes?.url ?? data?.attributes?.pic_url}
                                key={info.id}
                                message={info?.content[0]?.text?.value}
                                system={info?.role === "assistant" ? true : false}
                                user={info?.role === "user" ? true : false}
                            />
                        ))
                    }

                    {/* this is where the chats will show */}

                    {
                        messages?.map((info: any) => (
                            <Message image={data?.attributes?.profile?.data?.attributes?.url ?? data?.attributes?.pic_url} key={info.id} message={info?.content} system={info?.role === "assistant" ? true : false} user={info?.role === "user" ? true : false} />
                        ))
                    }

                    {
                        aiLoader && (
                            <div className="flex flex-col space-y-3 mt-7">
                                <Skeleton className="h-[50px] w-[80%] bg-[#357EF8] rounded-xl" />
                            </div>
                        )
                    }

                    <div ref={messagesEndRef} />
                </ScrollArea>



                <div className='  w-full  '>
                    {/* the input */}
                    <div className='w-full flex justify-center'>
                        <form onSubmit={async (e: any) => {
                            e.preventDefault();
                            if (messagesLeft < 1 && tier === "premium" && !paid) {
                                open()
                                return
                            }
                            let response = await submitMessage(e)
                            handleChat()
                        }} className='relative w-full max-w-[335px]'>
                            <Input disabled={status === "in_progress"} onChange={handleInputChange} value={input} required className='rounded-l-[49px] text-[16px] rounded-r-[49px] h-[48px]' placeholder='Ask your questions here' />

                            <button disabled={status === "in_progress"} type='submit'>
                                <Image src={"/onboard/send.png"} alt='send icon' width={500} height={500} className='h-[48px] w-[48px] cursor-pointer absolute right-0 top-0' />
                            </button>

                        </form>
                    </div>
                </div>


            </div>

            <TabBar page='explore' />

            {/* the dialog */}
            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-3xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-3"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                Maximum messages reached
                            </DialogTitle>
                            <p className="mt-2 text-sm/6 text-white">
                                Upgrade to Premium
                            </p>
                            <div className="mt-4 flex items-center space-x-2">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={close}
                                >
                                    Not now
                                </Button>
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={() => { handleSubscribe(`/chat/player/${slug}`, chatId) }}
                                >
                                    Upgrade
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default PlayerChat
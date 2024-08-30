"use client";
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/functions';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { experimental_useAssistant as useAssistant } from "ai/react";
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import OpenAI from 'openai';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TbLoader3 } from 'react-icons/tb';
import Message from '../Onboarding/components/Message';
import TabBar from '../Profile/components/TabBar';
import MediaModal from './components/MediaModal';
import { addMessageLeft, createChat, existsIdInArray, followCoach, UpdateChat } from './functions/functions';
import { CoachContext } from '@/context/CoachContext';

type Props = {}

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    dangerouslyAllowBrowser: true,
});


const CoachChat = (props: Props) => {
    const router = useRouter()
    const params = useParams();
    const { slug }: any = params;
    const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>();
    const { jwt, loading: loader, profileId, handleSubscribe, coaches, setCoaches, coachIds, setCoachIds } = useContext(AuthContext)
    const [data, setData] = useState<any>({})
    const [prompt, setPrompt] = useState<string>("")
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [aiLoader, setAILoader] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [response, setResponse] = useState("")
    const [message, setMessage] = useState<any[]>([]);
    const [voice, setVoice] = useState<string>("Adam")
    const { toast } = useToast();
    const [messagesLeft, setMessagesLeft] = useState<number>(3)
    const [tier, setTier] = useState<any>()
    const [load, setLoad] = useState<boolean>(false);
    const [chatId, setChatId] = useState()
    const [previous, setPrevious] = useState([])
    const [threadIdd, setThreadId] = useState("")
    const [paid, setPaid] = useState<boolean>(false)
    const [previousLoad, setPreviousLoad] = useState<boolean>(false)
    const [fileId, setFileId] = useState();
    const audioRef = useRef<HTMLAudioElement>(null);
    let [isOpen, setIsOpen] = useState(false)
    let [isOpenn, setIsOpenn] = useState(false)
    const [audioEnabled, setAudioEnabled] = useState<boolean>(false)
    useEffect(() => {
        if (!audioEnabled && tier === "premium") {
            setIsOpenn(true)
        }
    }, [tier])


    // Ref to track whether getCoach has been executed once
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
        setMessages
    } = useAssistant({
        api: "/api/coach-assistant",
        body: {
            assistantId: data?.attributes?.assistantId,
            userThreadId: threadIdd,
            fileId: fileId,
            // // userThreadId,
        },
    });





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


    useEffect(() => {
        const playAudio = async () => {
            let content: any = messages[messages?.length - 1]?.content
            if (content?.role === "assistant") {
                const botVoiceResponse = await getElevenLabsResponse(content);
                const reader = new FileReader();
                reader.readAsDataURL(botVoiceResponse);
                reader.onload = () => {
                    if (audioRef.current) {
                        audioRef.current.src = reader.result as string;
                        audioRef.current.play();
                    }
                };
            }

        }

        if (status !== "in_progress" && tier === "premium") {
            playAudio()
        }
    }, [messages, status])


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
            if (response?.data && response?.data?.length > 0) {
                setPrevious(response?.data)
            }
            setPreviousLoad(false);
        };
        if (threadIdd !== "") {
            fetchMessages();
        }

    }, [threadIdd]);


    useEffect(() => {
        const getCoach = async (slug: any) => {
            setLoading(true);
            return fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/chats?filters[client_profile][$eq]=${profileId}&filters[coach][id][$eq]=${slug}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
                .then(async (data) => {
                    if (data?.data[0]?.id) {
                        setThreadId(data?.data[0]?.attributes?.threadId)
                        setChatId(data?.data[0]?.id)
                        setMessagesLeft(data?.data[0]?.attributes?.messagesLeft)
                        setPaid(data?.data[0]?.attributes?.paid)
                    } else {
                        let createChatt = await createChat(slug, jwt, profileId)
                        const updatedSett = new Set(coachIds);
                        updatedSett?.add(parseInt(slug));
                        setThreadId(createChatt?.data?.data?.attributes?.threadId)
                        setChatId(createChatt?.data?.data?.id)
                        setPaid(createChatt?.data?.data?.attributes?.paid)
                        setCoachIds(updatedSett)
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
    }, [jwt, profileId, slug]);


    // console.log("this is the coaches", coaches)

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    function openn() {
        setIsOpenn(true)
    }

    function closee() {
        setIsOpenn(false)
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
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/coaches/${slug}?populate[0]=profile&populate[1]=club`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
                .then((data) => {
                    setData(data?.data)
                    setVoice(data?.data?.attributes?.voice ?? "Adam")
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







    const handleChat = async (message: any) => {


        if (!(coachIds?.has(parseInt(slug)))) {
            let createChatt = await createChat(slug, jwt, profileId)
            const updatedSett = new Set(coachIds);
            updatedSett?.add(parseInt(slug));
            setCoachIds(updatedSett)
        } else {
            let updateChatt = await UpdateChat(slug, jwt, profileId, chatId)
        }
        // if the tier is premium
        if (tier === "premium" && !paid) {
            let message = messagesLeft && messagesLeft - 1
            let response = await addMessageLeft(chatId, jwt, message)
            if (response?.data?.data?.id) {
                if (setMessagesLeft) {
                    setMessagesLeft(message)
                }
            }
        }

        // check if the user is already following, if they are following do nothing,if they are not following, then follow the coach
        if (coaches && coaches?.data && coaches?.data?.length > 0) {
            let checkifFollows = existsIdInArray(coaches?.data, parseInt(slug))
            if (!checkifFollows) {
                // if the coach is not followed then do this logic
                let follow = await followCoach(slug, profileId, jwt)
                if (follow?.data?.data?.attributes) {
                    setCoaches(follow?.data?.data?.attributes?.coaches)
                }
            }
        } else {
            let follow = await followCoach(slug, profileId, jwt)
            if (follow?.data?.data?.attributes) {
                setCoaches(follow?.data?.data?.attributes?.coaches)
            }
        }

        return;
    }






    const removeTextBetweenDelimiters = (text: string): string => {
        if (!text) {
            return "";
        }
        // This regex matches everything from the start of the string up to and including the last occurrence of $@@
        return text.replace(/.*?\$@@/, '');
    };





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
                            <Image src={data?.attributes?.profile?.data?.attributes?.url ?? data?.attributes?.pic_url ?? "/profile/unknownp.png"} alt='player image' width={500} height={500} className='max-w-[103px] object-cover object-top h-[94px] rounded-xl' />
                        </div>

                        <div className='flex flex-col space-y-[12px]'>
                            <h1 className='text-[24px] leading-[24.54px] tracking-[0.26px] font-medium text-white'>{data?.attributes?.name}</h1>
                            {
                                (tier === "premium" && !paid) && (
                                    <div onClick={() => { handleSubscribe(`/chat/coach/${slug}`, chatId) }} className='rounded-[47px] cursor-pointer  w-[185px] gap-[12px] h-[36px] bg-[#357EF8]  text-[12px] font-medium leading-[15.12px] text-white flex flex-col justify-center items-center'>
                                        Upgrade to premium
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className='mt-[50px] h-[10%]  w-full grid place-items-center'>
                        {
                            data?.attributes?.prompts?.map((prompt: any) => (
                                <div onClick={() => {
                                    if (prompt?.prompt) {
                                        setInput(prompt?.prompt)
                                    } else {
                                        setInput(prompt)
                                    }

                                }} key={prompt} className='rounded-[44px] cursor-pointer mb-[16px] px-5 py-2 w-full  max-w-[335px] gap-[12px] min-h-[44px] bg-[#3B424F]   flex flex-col justify-center items-center'>
                                    <div className='flex space-x-[10px] items-center text-[12px] font-medium leading-[24px] text-white'>
                                        <Image src={"/profile/flash.png"} width={500} height={500} alt='flash' className='object-cover h-[24px] w-[24px]' />
                                        <h1>{prompt?.prompt ?? prompt}</h1>
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
                        previous?.slice()?.reverse()?.map((info: any, index) => (
                            <Message
                                voice={voice}
                                audioRef={audioRef}
                                premium={tier === "premium"}
                                image={data?.attributes?.profile?.data?.attributes?.url ?? data?.attributes?.pic_url}
                                audioEnabled={audioEnabled}
                                setAudioEnabled={setAudioEnabled}
                                key={`${info.id} - ${index}`}
                                message={info?.content[0]?.text?.value}
                                content={info?.content[0]}
                                system={info?.role === "assistant" ? true : false}
                                user={(info?.role === "user" || info?.role === "tool" || info?.role === "data") ? true : false}
                                role={info?.role}
                            />
                        ))
                    }

                    {
                        messages?.map((info: any, index) => (

                            <Message audioRef={audioRef}
                                voice={voice}
                                premium={tier === "premium"}
                                image={data?.attributes?.profile?.data?.attributes?.url ?? data?.attributes?.pic_url} key={`${info.id} - ${index}`}
                                audioEnabled={audioEnabled}
                                setAudioEnabled={setAudioEnabled}
                                message={info?.content} system={info?.role === "assistant" ? true : false}
                                user={(info?.role === "user" || info?.role === "tool" || info?.role === "data") ? true : false}
                                role={info?.role}
                            />

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
                            handleChat(messages)

                        }} className='relative w-full max-w-[335px] rounded-[49px]  h-12 bg-white'>

                            <Input disabled={status === "in_progress" || load} onChange={handleInputChange} value={removeTextBetweenDelimiters(input)} required className='rounded-l-[49px] w-[80%] text-[16px] border-none focus-visible:ring-0  h-[48px]' placeholder='Ask your questions here' />

                            <div className='flex space-x-2 items-center absolute right-0 top-0'>

                                <MediaModal threadId={threadIdd} load={load} setLoad={setLoad} setMessages={setMessages} setInput={setInput} status={status} fileId={fileId} handleInputChange={handleInputChange} input={input} messages={messages} setFileId={setFileId} submitMessage={submitMessage} />
                                <button disabled={status === "in_progress" || load} type='submit'>
                                    <Image src={"/onboard/send.png"} alt='send icon' width={500} height={500} className={`h-[48px] ${(status === "in_progress" || load) && "animate-pulse"} w-[48px] cursor-pointer `} />
                                </button>
                            </div>

                        </form>
                    </div>


                </div>


            </div>

            <TabBar page='explore' />


            <audio ref={audioRef}>
                <source type="audio/mp3" />
            </audio>
            {/* 
            <audio ref={audioRef} controls className="mb-2 hidden" /> */}


            {/* the dialog */}
            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-[#262629] bg-opacity-95 backdrop-blur-md p-6  duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-3"
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
                                    onClick={() => { handleSubscribe(`/chat/coach/${slug}`, chatId) }}
                                >
                                    Upgrade
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>


            <Dialog open={isOpenn} as="div" className="relative z-10 focus:outline-none" onClose={closee}>
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
                                    onClick={closee}
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
                                        setAudioEnabled(true);
                                        closee();
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

export default CoachChat
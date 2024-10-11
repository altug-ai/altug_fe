"use client";
import Image from 'next/image'
import React, { useContext, useState, useRef, useEffect } from 'react'
import Commentbox from './Commentbox'
import { Input } from '@/components/ui/input'
import { useGetComments } from '@/hooks/useGetComments';
import { TbLoader3 } from 'react-icons/tb';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IoMdClose } from "react-icons/io";

type Props = {
    id?: number;
    setShowOverlay?: React.Dispatch<React.SetStateAction<boolean>>;
    reloadd: boolean;
    setReloadd: React.Dispatch<React.SetStateAction<boolean>>;
    dLength: number;
    clientId?: number;
    challengeId?: number;
}

const CommentsOverlay = ({ id, setShowOverlay, reloadd, setReloadd, dLength, clientId, challengeId }: Props) => {
    const { data, reload, setReload, loading, hasMore, loadMore, likes, setLikes, setData } = useGetComments(id)
    const { jwt, profileId } = useContext(AuthContext)
    const [comment, setComment] = useState<string>("")
    const [load, setLoad] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);  // Scroll re
    const [audioEnabled, setAudioEnabled] = useState<boolean>(false);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();

    }, [data]);



    const handleSubmitComment = async () => {
        setLoad(true);
        const newData = {
            data: {
                client_profile: profileId,
                comment: comment,
                submitted_challenge: id
            }
        }
        try {
            const submitComment = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/comments`,
                newData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            if (submitComment?.data?.data?.id) {
                setComment("")
                setReload(!reload)
                if (dLength === 0) {
                    setReloadd(!reloadd);
                }
                setLoad(false)
            }

        } catch (error) {

            setLoad(false)
            console.error(error)
        }
    }

    return (
        <div className="fixed bottom-0 flex flex-col w-full py-[12px] z-[10000] max-w-[388px]">
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[10000]">

                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[10000]">
                    <div className="bg-[#2E3E5C] h-[622px] absolute border-t border-black rounded-t-[44px]  w-full bottom-0 p-4 ">
                        <div className="flex justify-center cursor-pointer mt-[12px] mb-[30px]">
                            <Image
                                onClick={() => {
                                    if (setShowOverlay) {
                                        setShowOverlay(false);
                                    }
                                }}
                                src={"/profile/linew.png"}
                                className="w-[60px]"
                                width={500}
                                height={500}
                                alt="line"
                            />
                        </div>

                        <IoMdClose onClick={() => {
                            if (setShowOverlay) {
                                setShowOverlay(false);
                            }
                        }} className='text-red-500 h-[30px] w-[30px] cursor-pointer' />

                        <h1 className='text-[16px] font-bold leading-[17.6px] text-white'>{data?.length} {data?.length < 2 ? "Comment" : "Comments"}</h1>
                        <div className='mt-[20px] flex flex-col h-[500px] space-y-[16px] pb-[50px]'>
                            <div id="scrollableDiv" style={{ overflow: "auto" }}>

                                <InfiniteScroll
                                    dataLength={data.length}
                                    next={loadMore}
                                    hasMore={hasMore}
                                    scrollableTarget="scrollableDiv"
                                    loader={
                                        <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                                            <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                                        </div>
                                    }
                                    // scrollableTarget="scrollableDiv"
                                    endMessage={<p className='text-center my-2 text-slate-400'>No more comments</p>}
                                >
                                    {
                                        data?.map((dat) => {


                                            let newLikes = dat?.attributes?.likes?.data?.map((per: any) => {
                                                return per?.id
                                            })

                                            let profile = dat?.attributes?.client_profile?.data?.attributes?.profile_pic?.data?.attributes?.url
                                            let nameHeader = dat?.attributes?.client_profile?.data?.attributes?.username
                                            let coachId = dat?.attributes?.coach?.data?.id;
                                            let voice
                                            let coach = false
                                            if (!coachId) {
                                                coachId = dat?.attributes?.player?.data?.id
                                                if (coachId) {
                                                    profile = dat?.attributes?.player?.data?.attributes?.profile?.data?.attributes?.url ?? dat?.attributes?.player?.data?.attributes?.pic_url ?? "/profile/unknownp.png";
                                                    nameHeader = dat?.attributes?.player?.data?.attributes?.name;
                                                    voice =  dat?.attributes?.player?.data?.attributes?.voice;
                                                    coach = true;
                                                }
                                            } else {
                                                profile = dat?.attributes?.coach?.data?.attributes?.profile?.data?.attributes?.url ?? dat?.attributes?.coach?.data?.attributes?.pic_url ?? "/profile/unknownp.png";
                                                nameHeader = dat?.attributes?.coach?.data?.attributes?.name;
                                                voice =  dat?.attributes?.coach?.data?.attributes?.voice;
                                                coach = true;
                                            }

                                            return (
                                                <Commentbox voice={voice} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} coach={coach} id={dat?.id} newlikes={newLikes} key={dat?.id} profile={profile} comment={dat?.attributes?.comment} nameHeader={nameHeader} time={dat?.attributes?.createdAt} />
                                            )
                                        })
                                    }
                                </InfiniteScroll>
                                <div ref={scrollRef} />
                            </div>
                        </div>


                        {/* the input */}
                        <div className='  w-full max-w-[335px]  mt-[30px] fixed bottom-[20px]'>
                            {/* the input */}
                            <div className='w-full flex justify-center'>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    if (comment?.trim() == "") {
                                        return;
                                    }
                                    handleSubmitComment();
                                }} className='relative w-full max-w-[335px] rounded-[49px]  h-12 bg-[#838c9e]'>

                                    <Input value={comment} onChange={(e) => {
                                        setComment(e.target.value)
                                    }} required className='rounded-l-[49px] w-[80%] text-[16px] text-white placeholder:text-white bg-[#838c9e] leading-[24px] font-semibold border-none focus-visible:ring-0  h-[48px]' placeholder='Leave comment here' />

                                    <div className='flex space-x-2 items-center absolute right-5 top-3'>
                                        <button disabled={load} type='submit'>
                                            {
                                                load ? (
                                                    <TbLoader3 className="text-white w-6 h-6 animate-spin" />
                                                ) : <Image src={"/profile/send.png"} alt='send icon' width={500} height={500} className={`h-[20px] w-[20px] cursor-pointer `} />
                                            }
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div >

    )
}

export default CommentsOverlay
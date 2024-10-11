"use client";
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from '@/context/AuthContext';
import { acceptChallenge, likeChallenge } from '../functions/function';
import { TbLoader3 } from 'react-icons/tb';
import { ChallengeContext } from '@/context/ChallengeContext';
import { useTranslations } from "next-intl";
import { FaHeart } from 'react-icons/fa';
import { SlActionRedo } from 'react-icons/sl';
import FirstCommentBox from './FirstCommentBox';
import CommentsOverlay from './CommentsOverlay';
import { useGetFirstComments } from '@/hooks/useGetFirstComment';
import { Comment } from '@/context/types';

type Props = {
    submission?: boolean;
    challengeHeader?: boolean;
    title?: string;
    goal?: string;
    video?: string;
    id?: number;
    submitId?: number;
    accepted?: any;
    image?: string;
    submit?: boolean;
    audioEnabled?: boolean;
    setAudioEnabled?: Dispatch<SetStateAction<boolean>>;
    clientId?: number;
    challengeId?: number;
    liked?: any; 
};

const ChallengeBox = ({ clientId, challengeId, submission, challengeHeader, title, goal, video, id, accepted, image, liked, submit, submitId, audioEnabled, setAudioEnabled }: Props) => {
    const router = useRouter();
    const [loader, setLoader] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false); // State to track if the challenge is liked
    const [likeCount, setLikeCount] = useState<number>(liked?.length || 0); // Count of likes
    const [loading, setLoading] = useState<boolean>(false)
    const [profiles, setProfiles] = useState(new Set()); // State to track accepted profiles
    const { jwt, profileId } = useContext(AuthContext);
    const { challengeLoader, setChallengeLoader, handleShare } = useContext(ChallengeContext);
    const { toast } = useToast();
    const [data, setData] = useState<Comment[]>([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [reload, setReload] = useState<boolean>(false)
    const t = useTranslations('Home.Challenge');


    useEffect(() => {
        async function getComments() {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/comments?sort=id:ASC&filters[submitted_challenge][id][$eq]=${submitId}&filters[$or][0][coach][id][$notNull][$eq]=true&filters[$or][1][player][id][$notNull][$eq]=true&populate[0]=client_profile.profile_pic&populate[1]=likes&populate[2]=coach.profile&populate[3]=player.profile&pagination[pageSize]=${1}`

            const personal = await fetcher(
                url,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            if (personal?.data) {
                await setData(personal?.data);

            }

            setLoading(false);
        }

        if (submitId) {
            getComments();
        }
    }, [submitId, reload])

    useEffect(() => {
        if (accepted?.length > 0) {
            const updatedSet = new Set(profiles);
            accepted?.forEach((dat: any) => {
                updatedSet.add(dat?.id);
            });
            setProfiles(updatedSet);
        }
    }, [accepted]);

    useEffect(() => {
        if (liked && liked.some((user: any) => user?.id === profileId)) {
            setIsLiked(true);
        }
    }, [liked, profileId]);

    const acceptChallenges = async () => {
        setLoader(true);
        try {
            const response = await acceptChallenge(id, profileId, jwt);
            if (response?.data?.data?.id) {
                setLoader(false)
                setChallengeLoader(!challengeLoader)
                const updatedSet = new Set(profiles);
                updatedSet?.add(profileId);
                setProfiles(updatedSet);
                router.push(`/challenge/${id}`)
                toast({
                    description: t("ChallengeAccepted"),
                });
            } else {
                setLoader(false);
                toast({
                    variant: "destructive",
                    description: t("ChallengeNotAccepted"),
                });
            }
        } catch (error) {
            setLoader(false);
            toast({
                variant: "destructive",
                description: t("ChallengeNotAccepted"),
            });
        }
    };

    const likeChallenges = async () => {
        setLoader(true);
        try {
            const response = await likeChallenge(id, profileId, isLiked, jwt);

            if ((response?.data?.data?.id)) {
                setIsLiked(!isLiked);
                setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
            }
            setLoader(false);
        } catch (error) {
            setLoader(false);
            toast({
                variant: "destructive",
                description: 'Something went wrong!',
            });
        }
    };

    return (
        <div className='max-w-[388px] w-full mb-[20px]'>
            <div className={`w-full h-full rounded-[8px] ${!challengeHeader && "border border-[#D5D5D5]"}`}>
                <video className='h-[192.52px] w-full rounded-md grid place-items-center' controls preload="none" poster={image}>
                    <source src={video} type="video/mp4" />
                    {t("Tag")}
                </video>

                <div className='flex space-x-2 items-center px-[8px] py-[8px]'>
                    <Image src={image ?? "/profile/unknownp.png"} width={500} height={500} alt='tab ball' className='h-[48px] w-[48px] rounded-full object-cover object-top' />
                    <div className='h-[20%] flex flex-col pr-[15px]'>
                        <h1 className='text-[18px] leading-[24.35px] font-medium text-white line-clamp-1'>{title}</h1>
                        <h1 className='text-[18px] leading-[24.35px] font-medium text-white line-clamp-1'> 
                            <span className='font-bold text-[#357EF8]'>{t("Goal")}:</span> {goal}
                        </h1>
                    </div>
                </div>

                <div className='flex space-x-5 items-center pb-[7px] mt-[10px] px-[8px]'>
                    {/* Render accepted users */}
                    {accepted?.length > 0 && (
                        <div className="flex">
                            <span className="rounded-full z-20 flex justify-center items-center">
                                <Image
                                    alt={"profile pic"}
                                    width={500}
                                    height={500}
                                    className="rounded-full object-cover object-top h-[40px] w-[40px]"
                                    src={accepted[0]?.attributes?.profile_pic?.data?.attributes?.url ?? "/profile/unknownc.png"}
                                />
                            </span>

                            {accepted?.slice(1).slice(0, 3).map((user: any, index: any) => (
                                <span key={user?.id ?? index} className="rounded-full -ml-3 z-20 flex justify-center items-center ">
                                    <Image
                                        alt={user?.attributes?.profile_pic?.data?.attributes?.url ?? "/profile/unknownc.png"}
                                        width={500}
                                        height={500}
                                        className="rounded-full object-cover object-top h-[40px] w-[40px]"
                                        src={user?.attributes?.profile_pic?.data?.attributes?.url ?? "/profile/unknownc.png"}
                                    />
                                </span>
                            ))}
                        </div>
                    )}

                    {accepted?.length !== 0 && (
                        <h1 className='text-[12px] leading-[16.24px] font-medium text-white'>
                            {t("Accept")} {accepted?.length > 0 && accepted?.length} {accepted?.length === 1 ? t("Person") : t("People")}
                        </h1>
                    )}

                    <div className="flex items-center space-x-1 justify-end w-[95%]">
                        <div
                            onClick={() => { if (id) handleShare(id) }}
                            className='cursor-pointer flex justify-center items-center'
                        >
                            <SlActionRedo className="text-white" />
                        </div>

                        <FaHeart
                            className={`cursor-pointer ${isLiked ? 'text-red-500' : 'text-white'} ${loader ? 'cursor-not-allowed' : ''}`}
                            onClick={!loader ? likeChallenges : undefined}
                        />
                        <span className="text-[12px] leading-[16.24px] font-medium text-white">{likeCount || 0}</span>
                    </div>
                </div>

                {/* this is for the comments */}
                {
                    (submit) && (
                        <div className='px-[8px]'>
                            {
                                loading && (
                                    <div className='flex justify-center my-4'>
                                        <TbLoader3 className="text-white w-7 h-7  animate-spin" />
                                    </div>
                                )
                            }
                            {
                                data?.map((dat) => (
                                    <FirstCommentBox coach key={dat?.id} profile={
                                        dat?.attributes?.coach?.data?.id ?
                                            dat?.attributes?.coach?.data?.attributes?.profile?.data?.attributes?.url ?? dat?.attributes?.coach?.data?.attributes?.pic_url ?? "/profile/unknownp.png" :
                                            dat?.attributes?.player?.data?.attributes?.profile?.data?.attributes?.url ?? dat?.attributes?.player?.data?.attributes?.pic_url ?? "/profile/unknownp.png"
                                    } comment={dat?.attributes?.comment} nameHeader={dat?.attributes?.coach?.data?.id ?
                                        dat?.attributes?.coach?.data?.attributes?.name :
                                        dat?.attributes?.player?.data?.attributes?.name} voice={dat?.attributes?.coach?.data?.id ?
                                            dat?.attributes?.coach?.data?.attributes?.voice :
                                            dat?.attributes?.player?.data?.attributes?.voice

                                        } audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} />
                                ))
                            }

                            <h1 onClick={() => {
                                setShowOverlay(true)
                            }} className='text-[12px] font-bold leading-[26.63px] cursor-pointer text-[#1B76FF]'>{t("AllComments")}</h1>
                        </div>
                    )
                }

                {/* challenge and accept */}
                {!submission && (
                    <div className='flex items-center space-x-2 px-[8px] pb-[12px]'>
                        {profiles?.has(profileId) ? (
                            <div onClick={() => { router?.push(`/challenge/${id}`) }} className='rounded-[35px] cursor-pointer mt-3 w-full gap-[12px] h-[35.01px] bg-[#357EF8] text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                {t("View")}
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger className='w-full'>
                                    <div onClick={() => { }} className='rounded-[35px] cursor-pointer mt-3 w-full gap-[12px] h-[35.01px] bg-[#357EF8] text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                        {loader ? (
                                            <TbLoader3 className="text-white w-7 h-7 animate-spin" />
                                        ) : t("AcceptChallenge")}
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className='flex flex-col space-y-2'>
                                        <h1 className='text-[12px] text-center font-medium'>{t("Sure")}</h1>
                                        <div onClick={acceptChallenges} className='bg-[#357EF8] rounded-md text-white px-2 py-2 cursor-pointer'>
                                            {loader ? (
                                                <TbLoader3 className="text-white w-7 h-7 animate-spin" />
                                            ) : t("Yes")}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                )}
            </div>
            {
                showOverlay && (
                    <CommentsOverlay challengeId={challengeId} clientId={clientId} dLength={data?.length} reloadd={reload} setReloadd={setReload} id={submitId} setShowOverlay={setShowOverlay} />
                )
            }

        </div>
    );
};

export default ChallengeBox;

"use client";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from '@/context/AuthContext';
import { ChallengeContext } from '@/context/ChallengeContext';
import { useGetChallenges } from '@/hooks/useGetChallenges';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from 'react';
import { TbLoader3 } from 'react-icons/tb';
import TabBar from '../Profile/components/TabBar';
import Header from './challengePageComponents/PageHeader';
import Recording from './challengePageComponents/Recording';
import SubmissionCompleted from './challengePageComponents/SubmissionCompleted';
import SubmissionLoad from './challengePageComponents/SubmissionLoad';
import Submissionupload from './challengePageComponents/Submissionupload';
import ChallengeBox from './components/ChallengeBox';
import { acceptChallenge, sendNotification } from './functions/function';
import { useGetSubmitted } from '@/hooks/useGetSubmitted';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {}

const ChallengePage = (props: Props) => {

    const { loading, profileId, jwt } = useContext(AuthContext)
    const params = useParams();
    const { slug }: any = params;
    const { handleStartCaptureClick, route, setRoute, setVideoUrl, setVideoBlob, point, challengeLoader, setChallengeLoader, chal, setChal } = useContext(ChallengeContext)
    const [profiles, setProfiles] = useState(new Set());
    const [profiless, setProfiless] = useState(new Set());
    const t = useTranslations('Home.ChallengePage');
    const { toast } = useToast();
    const [openn, setOpenn] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const { data, loading: challengeLoaderr } = useGetChallenges(slug)
    const { data: submitted, hasMore, loadMore } = useGetSubmitted(data?.id)
    let [isOpen, setIsOpen] = useState(false)
    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }
    useEffect(() => {
        if (data?.attributes?.accepted?.data?.length > 0) {
            const updatedSet = new Set(profiless);
            data?.attributes?.accepted?.data?.map(async (dat: any) => {
                updatedSet?.add(dat?.id);
            });
            setProfiless(updatedSet);
        }
    }, [data?.attributes?.accepted?.data])

    useEffect(() => {
        setProfiles(new Set());
        if (data?.attributes?.submitted_challenges?.data?.length > 0) {
            let chal = false
            const updatedSet = new Set(profiles);
            data?.attributes?.submitted_challenges?.data?.map(async (dat: any) => {
                if (dat?.attributes?.client_profile?.data?.id === profileId) {
                    chal = true
                    setChal(dat)
                }
                updatedSet?.add(dat?.attributes?.client_profile?.data?.id);
            });
            setProfiles(updatedSet);
            if (!chal) {
                setChal(null)
            }
        }
    }, [data?.attributes?.submitted_challenges?.data])



    const handleVideoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const videoFile = event.target.files?.[0];

        var getDuration = async function (url: any) {
            var _player = new Audio(url);
            return new Promise((resolve) => {
                _player.addEventListener(
                    'durationchange',
                    function (e) {
                        if (this.duration != Infinity) {
                            const duration = this.duration;
                            _player.remove();
                            resolve(duration);
                        }
                    },
                    false
                );
                _player.load();
                _player.currentTime = 24 * 60 * 60; //fake big time
                _player.volume = 0;
                _player.play();
            });
        };


        // Basic validation (optional):
        if (!videoFile || !videoFile.type.startsWith('video/')) {
            alert('Please select a valid video file.');
            return;
        }

        // Create object URL for the video file:
        const videoObjectUrl = URL.createObjectURL(videoFile);

        let duration: any = await getDuration(videoObjectUrl); // Await the duration

        if (duration > 120) {
            open();
            return
        } else {

            // Set the object URL to state or use as needed:
            setVideoUrl(videoObjectUrl); // Store the object URL for displaying or further processing

            // Optionally, store the Blob object for uploading or further processing:
            setVideoBlob(videoFile); // Store the Blob object for uploading or further processing


            // Optionally, set route or perform other actions:
            setRoute(1);
        }



        // Clean up the object URL when it's no longer needed (e.g., component unmounts):
        // URL.revokeObjectURL(videoObjectUrl);
    };


    // console.log("the selectedVIDEO", videoUrl)

    const acceptChallenges = async () => {
        setLoader(true);
        try {
            const response = await acceptChallenge(data.id, profileId, jwt)
            if (response?.data?.data?.id) {
                if (search) {
                    const responsee = await sendNotification(search, profileId, jwt, slug)
                }
                setLoader(false)
                setChallengeLoader(!challengeLoader)
                toast({
                    description: t("ChallengeAccepted"),
                });
            } else {
                setLoader(false)
                toast({
                    variant: "destructive",
                    description: t("ChallengeNotAccepted"),
                });
            }
        } catch (error) {
            setLoader(false)
            toast({
                variant: "destructive",
                description: t("ChallengeNotAccepted"),
            });
        }
    }

    return (
        <div className='py-[20px] px-[20px] h-full  flex flex-col items-center '>

            <Header title={data?.attributes?.title} route={route} setRoute={setRoute} />

            {/* <VideoRecorder /> */}
            {/* the loader */}
            {
                (loading || challengeLoaderr) && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }

            {
                (route === 0 && data?.attributes) && (
                    <div className='py-[20px]  h-full  flex flex-col items-center '>
                        <div className='mt-[30px]'>
                            <ChallengeBox 
                                id={data?.id}
                                image={data?.attributes?.banner?.data?.attributes?.url} 
                                accepted={data?.attributes?.accepted?.data}
                                liked={data?.attributes?.liked?.data} 
                                title={data?.attributes?.title} 
                                video={data?.attributes?.video?.data?.attributes?.url} 
                                goal={data?.attributes?.goal} submission challengeHeader 
                            />
                        </div>

                        <div className='w-full max-w-[388px] mt-[20px] mb-[70px] flex flex-col space-y-9'>
                            <div className='flex flex-col space-y-2'>
                                <h1 className='font-medium text-[24px] leading-[32.47px] text-[#FFFFFF]'>{t("Instructions")}</h1>
                                <h1 className='text-[#FFFFFF] font-medium leading-[16.24px] text-[12px] '>Description : {data?.attributes?.description}</h1>
                                <h1 className='text-[#FFFFFF] font-medium leading-[16.24px] text-[12px] '>Goal : {data?.attributes?.goal}</h1>
                            </div>
                            <h1 className='font-medium text-[24px] mt-[10px] leading-[32.47px] text-[#FFFFFF]'>{t("Submitted")}</h1>
                            <div className='mt-[10px] pb-[90px]'>
                                <InfiniteScroll
                                    dataLength={submitted.length}
                                    next={loadMore}
                                    hasMore={hasMore}
                                    loader={
                                        <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                                            <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                                        </div>
                                    }
                                    endMessage={<p className='text-center my-2 text-slate-400'>No more submitted challenges</p>}
                                >
                                    {
                                        submitted?.map((submit: any) => (
                                            <ChallengeBox image={submit?.attributes?.client_profile?.data?.attributes?.profile_pic?.data?.attributes?.url} goal={data?.attributes?.goal} key={submit?.id} title={data?.attributes?.title} video={submit?.attributes?.video?.data?.attributes?.url} submission />
                                        ))
                                    }
                                </InfiniteScroll>
                            </div>
                        </div>

                        <div className='w-full max-w-[388px]'>


                            {
                                profiless?.has(profileId) ? (
                                    <div className='w-full max-w-[388px] '>
                                        {
                                            !profiles?.has(profileId) && (
                                                <div className='w-full max-w-[388px] fixed bottom-[20%] '>
                                                    <Input
                                                        id='video'
                                                        type="file"
                                                        accept="video/*"
                                                        style={{ display: 'none' }}
                                                        onChange={handleVideoChange}
                                                    />
                                                    <Label htmlFor="video" >
                                                        <div className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                                            {t("Testing")}
                                                        </div>
                                                    </Label>
                                                </div>
                                            )
                                        }




                                        {/* Start Recording */}
                                        {
                                            profiles?.has(profileId) ? (
                                                <div className='w-full max-w-[388px] fixed bottom-[10%] '>
                                                    <div className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                                        {t("Submit")}
                                                    </div>
                                                    {
                                                        chal?.attributes?.points === 0 && (
                                                            <div className='w-full max-w-[388px] fixed bottom-[20%] '>
                                                                <Input
                                                                    id='video'
                                                                    type="file"
                                                                    accept="video/*"
                                                                    style={{ display: 'none' }}
                                                                    onChange={handleVideoChange}
                                                                />
                                                                <Label htmlFor="video" >
                                                                    <div className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                                                        Redo challenge
                                                                    </div>
                                                                </Label>
                                                            </div>
                                                        )

                                                    }
                                                </div>
                                            ) : (<div className='w-full max-w-[388px] fixed bottom-[10%] '>
                                                <div onClick={
                                                    () => {
                                                        setRoute(5)
                                                        handleStartCaptureClick();
                                                    }
                                                } className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                                    {t("Record")}
                                                </div>
                                            </div>)
                                        }
                                    </div>
                                ) : (
                                    <div onClick={acceptChallenges} className='rounded-[35px] fixed bottom-[10%]  max-w-[388px] cursor-pointer mt-3 w-full gap-[12px] h-[35.01px] bg-[#357EF8]  text-[13px] py-2 font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                        {
                                            loader ? (
                                                <TbLoader3 className="text-white w-7 h-7 animate-spin" />
                                            ) : t("AcceptChallenge")
                                        }
                                    </div>
                                )
                            }


                        </div >
                    </div >
                )
            }

            {
                route === 5 && (
                    <Recording setRoute={setRoute} />
                )
            }

            {
                route === 1 && (
                    <Submissionupload setRoute={setRoute} />
                )
            }

            {
                route === 2 && (
                    <SubmissionLoad image={data?.attributes?.banner?.data?.attributes?.url} accepted={data?.attributes?.accepted?.data} description={data?.attributes?.description} goal={data?.attributes?.goal} title={data?.attributes?.title} setRoute={setRoute} />
                )
            }

            {
                route === 3 && (
                    <SubmissionCompleted setRoute={setRoute} point={data?.attributes?.points} stat={data?.attributes?.stat} />
                )
            }

            {
                route !== 5 && (
                    <TabBar page='challenge' />
                )
            }

            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-3xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-3"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                Z-baller alert
                            </DialogTitle>
                            <p className="mt-2 text-sm/6 text-white">
                                Videos must be at most 2 minutes long.
                            </p>
                            <div className="mt-4 flex items-center space-x-2">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={close}
                                >
                                    Ok
                                </Button>

                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

        </div >
    )
}

export default ChallengePage
"use client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { AuthContext } from '@/context/AuthContext';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { TbLoader3 } from 'react-icons/tb';
import PlayerCard from './components/PlayerCard';
import RatingsBar from './components/RatingsBar';
import TabBar from './components/TabBar';
// import { useGetAcceptedChallenges } from '@/hooks/useGetAcceptedChallenges';
import { Stat } from '@/context/types';
import { useGetSubmittedChallenges } from '@/hooks/useGetSubmittedChallenges';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useTranslations } from "next-intl";
import Banner from './components/Banner';
import Header from './components/Header';
import { useGetChattedCoaches } from "@/hooks/useGetChattedCoaches";
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {}

const ProfileScreen = (props: Props) => {
    const { loading, coaches, players } = useContext(AuthContext)
    const [daysSelect, setDaysSelect] = useState<string>("7")
    const { data: accepted, loading: acceptedLoader, stats } = useGetSubmittedChallenges(parseInt(daysSelect));
    const { data: session }: any = useSession();
    const { toast } = useToast();
    const router = useRouter();
    const [openn, setOpenn] = useState<boolean>(false)
    let [isOpen, setIsOpen] = useState(false)
    const { hasMore, loadMore, data, loading: chatLoading } = useGetChattedCoaches()



    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    let stat: Stat = stats
    const t = useTranslations('Home.Profile');


    useEffect(() => {
        if (session?.error) {
            toast({
                variant: "destructive",
                description: session?.error,
            });
            signOut()
        }
    }, [session])



    return (
        <div className='py-[20px] px-[20px] h-full  flex flex-col items-center '>



            {/* the header */}
            <Header />


            {/* the loader when the profile is loading */}
            {
                (loading || acceptedLoader) && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }

            {/* the bannner */}
            <div>
                <Banner />
            </div>

            {/* performance overview */}
            <div className='w-full max-w-[388px] flex justify-between items-center my-[30px]'>
                <h1 className='font-semibold text-[16px] leading-[12.25px] tracking-[0.3%] text-white'>{t("Title")}</h1>

                <Select onValueChange={(e) => {
                    setDaysSelect(e)
                }}>
                    <SelectTrigger className="w-[105px] h-[28px] px-[5px] bg-black text-white">
                        <SelectValue placeholder={t("7Days")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t("Days")}</SelectLabel>
                            <SelectItem value="7">{t("7Days")}</SelectItem>
                            <SelectItem value="14">{t("14Days")}</SelectItem>
                            <SelectItem value="30">{t("30Days")}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>


            {/* the graph */}
            <div className='flex w-full justify-center h-[224.85px] max-w-[388px] my-[30px] ' >
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stat.accuracy} stat={t("Accuracy")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stat.shooting} stat={t("Shooting")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stat.defense} stat={t("Defense")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stat.strength} stat={t("Strength")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stat.stamina} stat={t("Stamina")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stat.passing} stat={t("Passing")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
            </div>


            {/* the coaches and my chats */}
            <div className='w-full max-w-[388px] mt-[30px] flex justify-between items-center'>
                <h1 className='font-semibold text-[16px] leading-[12.25px] tracking-[0.3%] text-white'>{t("Coaches")}</h1>
                {
                    ((coaches?.data && coaches?.data?.length > 0) || (players?.data && players?.data?.length > 0)) && (
                        <h1 onClick={() => {
                            open();
                        }} className='text-[#357EF8] text-[12px] tracking-[0.3%] cursor-pointer leading-[12.13px] font-semibold'>{t("Chats")}</h1>
                    )
                }

            </div>




            <div className='w-full flex flex-col max-w-[388px] mt-[30px] mb-[50px]'>
                {
                    loading && (
                        <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                            <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                        </div>
                    )
                }
                {
                    (!loading && coaches?.data && coaches?.data?.length < 1 && data?.length < 1) && (
                        <div className='text-white flex flex-col mt-[20px] items-center h-full text-center'>
                            <h1>{t("Followed")}</h1>
                            <h1>{t("FollowCoaches")} </h1>

                            <div onClick={() => {
                                router.push("/explore")
                            }} className='rounded-[35px] cursor-pointer mt-3 w-[70%] gap-[12px] h-[35.01px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                {t("Explore")}
                            </div>
                        </div>
                    )

                }

                {
                    data?.map((dat: any) => {
                        let coach = dat?.attributes?.coach?.data

                        if (!dat?.attributes?.coach?.data) {
                            coach = dat?.attributes?.player?.data
                        }

                        if (!coach?.id) {
                            return
                        }
                        return (
                            <PlayerCard point={coach?.attributes?.point} clubLogo={coach?.attributes?.club?.data?.attributes?.logo?.data?.attributes?.url} coach id={coach?.id} key={coach?.id} name={coach?.attributes?.name} picture={coach?.attributes?.profile?.data?.attributes?.url ?? coach?.attributes?.pic_url} />
                        )

                    })
                }

            </div>


            {/* the tab button */}

            <TabBar page='profile' />

            {/* THE DIALONG pane */}
            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-[#262629] bg-opacity-95 backdrop-blur-md p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-3"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                {t("AllChats")}
                            </DialogTitle>
                            <InfiniteScroll
                                dataLength={data.length}
                                next={loadMore}
                                hasMore={hasMore}
                                loader={
                                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                                    </div>
                                }
                                endMessage={<p className='text-center my-2 text-slate-400'>No more chats</p>}
                            >
                                {
                                    data?.map((dat: any) => {
                                        let coach = dat?.attributes?.coach?.data

                                        if (!dat?.attributes?.coach?.data) {
                                            coach = dat?.attributes?.player?.data
                                        }

                                        if (!coach?.id) {
                                            return
                                        }
                                        return (
                                            <PlayerCard point={coach?.attributes?.point} clubLogo={coach?.attributes?.club?.data?.attributes?.logo?.data?.attributes?.url} coach id={coach?.id} key={coach?.id} name={coach?.attributes?.name} picture={coach?.attributes?.profile?.data?.attributes?.url ?? coach?.attributes?.pic_url} />
                                        )

                                    })
                                }

                            </InfiniteScroll>


                            <div className="mt-4 flex items-center space-x-2">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={close}
                                >
                                    {t("Close")}
                                </Button>

                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default ProfileScreen

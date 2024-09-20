"use client";
import React, { useContext, useState } from 'react'
import TabBar from '../Profile/components/TabBar'
import Header from './components/Header'
import ChallengeBox from './components/ChallengeBox'
import { AuthContext } from '@/context/AuthContext';
import { useGetChallenges } from '@/hooks/useGetChallenges';
import { TbLoader3 } from 'react-icons/tb';
import { ChallengeContext } from '@/context/ChallengeContext';
import { useGetAcceptedChallenges } from '@/hooks/useGetAcceptedChallenges';
import { PiEmptyBold } from "react-icons/pi";
import { useTranslations } from "next-intl";
import { IoIosMenu } from 'react-icons/io';
import Widget from '@/components/Widget';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {}

const Challenges = (props: Props) => {
    const { loading } = useContext(AuthContext)
    const { data, loading: challengeLoader, hasMore, loadMore } = useGetChallenges()
    const { data: accepted, loading: acceptedLoader, hasMore: acceptedHasMore, loadMore: acceptedLoadMore } = useGetAcceptedChallenges();
    const [openn, setOpenn] = useState<boolean>(false)
    const { tab, setTab } = useContext(ChallengeContext)
    const t = useTranslations('Home.Challenge');

    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center'>


            {/* the header */}
            <Header />


            {/* my challenges load */}
            {
                ((acceptedLoader && tab === 0) || (loading && tab === 0)) && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }

            {/* current challenges load */}
            {
                ((challengeLoader && tab === 1) || (loading && tab === 1)) && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }

            {/* if there is no my challenges */}
            {
                (tab === 0 && !acceptedLoader && !loading && accepted.length < 1) && (
                    <div className='text-white flex flex-col mt-[20px] items-center h-full text-center'>
                        <h1>{t("Yet")}</h1>
                        <h1>{t("Here")}</h1>

                        <PiEmptyBold className='text-white h-5 w-5' />
                    </div>
                )
            }


            {
                (tab === 1 && !challengeLoader && !loading && data.length < 1) && (
                    <div className='text-white flex flex-col mt-[20px] items-center h-full text-center'>
                        <h1>{t("Not")}</h1>
                        <h1>{t("There")}</h1>

                        <PiEmptyBold className='text-white h-5 w-5' />
                    </div>
                )
            }

            {/* my challenges */}
            {
                tab === 0 && (
                    <div className='mt-[30px] mb-[50px]'>
                        <InfiniteScroll
                            dataLength={accepted.length}
                            next={acceptedLoadMore}
                            hasMore={acceptedHasMore}
                            loader={
                                <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                                    <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                                </div>
                            }
                            endMessage={<p className='text-center my-2 text-slate-400'>No more accepted challenges</p>}
                        >
                            {
                                accepted?.map((challenge: any) => (
                                    <ChallengeBox 
                                    image={challenge?.attributes?.banner?.data?.attributes?.url} 
                                    accepted={challenge?.attributes?.accepted?.data}
                                    liked={challenge?.attributes?.liked?.data} 
                                    id={challenge?.id} 
                                    title={challenge?.attributes?.title} 
                                    video={challenge?.attributes?.video?.data?.attributes?.url} 
                                    goal={challenge?.attributes?.goal} key={challenge?.id}
                                    />
                                ))
                            }
                        </InfiniteScroll>
                    </div>
                )
            }

            {/* the current challenges */}
            {
                tab === 1 && (
                    <div className='mt-[30px] mb-[50px]'>
                        <InfiniteScroll
                            dataLength={data.length}
                            next={loadMore}
                            hasMore={hasMore}
                            loader={
                                <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                                    <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                                </div>
                            }
                            endMessage={<p className='text-center my-2 text-slate-400'>No more challenges</p>}
                        >   {
                                data?.map((challenge: any) => (
                                    <ChallengeBox 
                                        image={challenge?.attributes?.banner?.data?.attributes?.url} 
                                        accepted={challenge?.attributes?.accepted?.data}
                                        liked={challenge?.attributes?.liked?.data} 
                                        id={challenge?.id} 
                                        title={challenge?.attributes?.title} 
                                        video={challenge?.attributes?.video?.data?.attributes?.url} 
                                        goal={challenge?.attributes?.goal} 
                                        key={challenge?.id} 
                                    />
                                ))
                            }</InfiniteScroll>


                    </div>
                )
            }



            <TabBar page='challenge' />
        </div>
    )
}

export default Challenges
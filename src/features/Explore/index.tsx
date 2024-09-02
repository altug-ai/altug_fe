"use client";
import { AuthContext } from '@/context/AuthContext';
import { useGetCoaches } from '@/hooks/useGetCoaches';
import { useGetPlayers } from '@/hooks/useGetPlayers';
import { useTranslations } from "next-intl";
import { useContext, useState } from 'react';
import { TbLoader3 } from 'react-icons/tb';
import PlayerCard from '../Profile/components/PlayerCard';
import TabBar from '../Profile/components/TabBar';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {}

const Explore = (props: Props) => {
    const [route, setRoute] = useState<number>(0)
    const { loading } = useContext(AuthContext)
    const { data: Coaches, loading: CoachLoad, hasMore, loadMore } = useGetCoaches()
    const { data: Players, loading: PlayerLoad, hasMore: phasMore, loadMore: ploadMore } = useGetPlayers()
    const t = useTranslations('Home.Explore');


    return (
        <div className='py-[20px] px-[20px] h-full  flex flex-col items-center '>


            {/* the header */}
            <div className='w-full  max-w-[388px] h-[48px]'>
                <div className='w-full h-full border border-[#F5F7F8] rounded-[38px] flex '>
                    <div onClick={() => { setRoute(0) }} className={`w-1/2 h-full  ${route === 0 && "bg-[#357EF8] rounded-[38px]"}  grid cursor-pointer place-items-center`}>
                        <h1 className='text-[16px] font-semibold leading-[12.13px] tracking-[0.3%] text-[#FFFFFF]'>{t("Coaches")}</h1>
                    </div>

                    <div onClick={() => { setRoute(1) }} className={`w-1/2 h-full  ${route === 1 && "bg-[#357EF8] rounded-[38px]"} cursor-pointer  grid place-items-center`}>
                        <h1 className='text-[16px] font-semibold leading-[12.13px] tracking-[0.3%] text-[#FFFFFF]'>{t("Professional")}</h1>
                    </div>
                </div>
            </div>


            {/* coaches load */}
            {
                ((CoachLoad && route === 0) || (loading && route === 0)) && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }

            {/* players load */}
            {
                ((PlayerLoad && route === 1) || (loading && route === 1)) && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }


            {/* the coaches tab */}
            {
                route === 0 && (
                    <div className='w-full flex flex-col max-w-[388px] mt-[30px] mb-[50px]'>
                        <InfiniteScroll
                            dataLength={Coaches.length}
                            next={loadMore}
                            hasMore={hasMore}
                            loader={
                                <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                                    <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                                </div>
                            }

                            endMessage={<p className='text-center my-2 text-slate-400'></p>}
                        >
                            {
                                Coaches?.map((coach: any) => {

                                    return (
                                        <PlayerCard key={coach.id} point={coach?.attributes?.point} id={coach?.id} name={coach?.attributes?.name} coach picture={coach?.attributes?.profile?.data?.attributes?.url ?? coach?.attributes?.pic_url} clubLogo={coach?.attributes?.club?.data?.attributes?.logo?.data?.attributes?.url} />

                                    )
                                })
                            }
                        </InfiniteScroll>
                    </div>
                )
            }

            {
                route === 1 && (
                    <div className='w-full flex flex-col max-w-[388px] mt-[30px] mb-[50px]'>
                        <InfiniteScroll
                            dataLength={Coaches.length}
                            next={ploadMore}
                            hasMore={phasMore}
                            loader={
                                <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                                    <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                                </div>
                            }
                            endMessage={<p className='text-center my-2 text-slate-400'></p>}
                        >
                            {
                                Players?.map((player: any) => {
                                    return (

                                        <PlayerCard key={player.id} point={player?.attributes?.point} id={player?.id} position={player?.attributes?.position} name={player?.attributes?.name} picture={player?.attributes?.profile?.data?.attributes?.url ?? player?.attributes?.pic_url} clubLogo={player?.attributes?.club?.data?.attributes?.logo?.data?.attributes?.url} />

                                    )
                                })
                            }
                        </InfiniteScroll>
                    </div>
                )
            }


            {/* the tab button */}

            < TabBar page='explore' />
        </div>
    )
}

export default Explore
'use client';
import { AuthContext } from '@/context/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import TabBar from '../Profile/components/TabBar';
import { useGetNotifications } from '@/hooks/useGetNotifications';
import Header from '../Profile/components/Header';
import { CheckNots, readMany, ViewNot } from './functions/functions';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TbLoader3 } from 'react-icons/tb';

type Props = {};

const Notifications = (props: Props) => {
    const { jwt, profileId, setUnRead, unRead, setReloadRead, reloadRead } = useContext(AuthContext);
    const { data, loading: ProfLoading, hasMore, loadMore, allIds } = useGetNotifications();
    const router = useRouter();
    const [markLoading, setMarkLoading] = useState<boolean>(false)
    const [checkedNots, setCheckedNots] = useState<{ [key: string]: boolean }>({});

    const checkNotifications = useCallback(async () => {
        if (data) {
            const checks = await Promise.all(
                data.map(async (dat: any) => {
                    const check = await CheckNots(dat?.id, profileId, jwt);
                    return { id: dat?.id, check };
                })
            );
            const checksMap = checks.reduce((acc, curr) => {
                acc[curr.id] = curr.check;
                return acc;
            }, {} as { [key: string]: boolean });
            setCheckedNots(checksMap);
        }
    }, [data, profileId, jwt]);

    useEffect(() => {
        checkNotifications();
    }, [checkNotifications]);


    console.log("these are the checkednots", checkedNots)

    const handleNotificationClick = async (dat: any, url: string) => {
        if (checkedNots[dat?.id]) {
            await ViewNot(dat?.id, profileId, jwt);
            if (unRead > 0) {
                setUnRead(unRead - 1);
            }
        }
        router.push(url);
    };

    // console.log("these are the checkNots", checkedNots)

    const notificationElements = useMemo(() => {
        return data?.map((dat: any) => {
            let url = '';

            let header = "Coach / Player Alert"
            let text = dat?.attributes?.text
            let prof = "/auth/Timer.png"

            if (dat?.attributes?.type === 'Coach' || dat?.attributes?.type === 'Player') {
                let boy = dat?.attributes?.type === 'Player' ? 'player' : 'coach';
                url = `/chat/${boy}/${dat?.attributes?.coachId}`

            } else if (dat?.attributes?.type === 'Challenge') {
                url = `/challenge/${dat?.attributes?.coachId}`;
                header = 'New Challenge Alert'
                prof = "/auth/Data.png"
            } else if (dat?.attributes?.type === 'Submission' && dat?.attributes?.client_profile?.data?.id !== profileId) {
                url = `/challenge/${dat?.attributes?.coachId}`;
                header = 'New Challenge Submission Alert'
                prof = "/auth/RedCal.png"
                text = `${dat?.attributes?.client_profile?.data?.attributes?.username} ${dat?.attributes?.text}`
            } else if (dat?.attributes?.type === 'Accept') {
                url = `/challenge/${dat?.attributes?.coachId}`;
                header = 'Challenge Accepted'
                prof = "/auth/Data.png"
                text = `${dat?.attributes?.client_profile?.data?.attributes?.username} ${dat?.attributes?.text}`
            } else if (dat?.attributes?.type === 'Leaderboard') {
                url = `/leaderboard`;
                header = 'You have been passed'
                prof = "/auth/RedCal.png"
                text = `${dat?.attributes?.client_profile?.data?.attributes?.username} ${dat?.attributes?.text}`
            } else if (dat?.attributes?.type === 'CoachMessage' || dat?.attributes?.type === 'PlayerMessage') {
                let boy = dat?.attributes?.type === 'Player' ? 'player' : 'coach';
                url = `/chat/${boy}/${dat?.attributes?.coachId}`
            } else {
                return
            }

            return (
                <div
                    onClick={() => handleNotificationClick(dat, url)}
                    key={dat?.id}
                    className={`px-2 mt-4 py-3 border cursor-pointer ${checkedNots[dat?.id] ? 'border-white ' : 'border-[#40404A]'} rounded-[10px] bg-[#0B0B0D] flex flex-col space-y-2`}
                >
                    <div className='flex space-x-3 items-center'>
                        <Image src={prof} alt='Timer' width={500} height={500} className='w-[20px] h-[20px]' />
                        <h1 className='text-[12px] leading-[12px] font-medium text-white'> {header} </h1>
                    </div>
                    <div className='text-[12px] leading-[12px] font-normal text-[#BCBCC8]'>{text}</div>
                </div>
            );
        });
    }, [data, checkedNots]);


    const markAllAsRead = async () => {
        setMarkLoading(true);

        try {
            const response = await readMany(allIds, jwt, profileId, setUnRead, unRead, reloadRead, setReloadRead)
            setReloadRead(!reloadRead)
            checkNotifications()
            setMarkLoading(false)
        } catch (error) {
            console.error(error);
            setReloadRead(!reloadRead)
            setMarkLoading(false)
        }
    }

 

    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>
            <Header />

            <div className='bg-[#181928] py-[10px] px-[10px] rounded-[17px] w-full max-w-[388px] mt-8 mb-[50px]'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-white text-xl font-medium text-[20px] leading-[20px]'>Notifications</h1>
                    <h1 onClick={markAllAsRead} className='text-[#357EF8] cursor-pointer text-[12px] font-medium leading-[16px]'>
                        {
                            markLoading ? <TbLoader3 className="text-white w-10 h-10 animate-spin" /> : "Mark all as read"
                        }
                    </h1>
                </div>

                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={
                        <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                            <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                        </div>
                    }
                    endMessage={<p className='text-center my-2 text-slate-400'>No more notifications to show.</p>}
                >
                    {notificationElements}
                </InfiniteScroll>
                {/* <h1 className='w-full text-center text-[#357EF8] text-[16px] leading-[24px] font-medium mt-3'>View All</h1> */}
            </div>

            <TabBar page='profile' />
        </div>
    );
};

export default Notifications;

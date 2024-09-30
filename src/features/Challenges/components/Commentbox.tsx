import Image from 'next/image'
import React from 'react'
import { formatDistanceToNow } from 'date-fns';

type Props = {
    nameHeader?: string | null;
    time: string;
    comment: string;
    profile: string;
}
const TimeAgo = (timestamp: any) => {
    const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

    return timeAgo
};

const Commentbox = ({ nameHeader, time, comment, profile }: Props) => {
    return (
        <div className='flex space-x-[12px] items-start my-[7px]'>
            <div className=' relative w-[32px] h-[32px]'>
                <Image src={profile ?? "/profile/unknownp.png"} alt='profile pic' width={500} height={500} className='w-[32px] h-[32px] object-cover object-top  rounded-full' />
            </div>

            {/* the name and the left */}
            <div className='flex flex-col space-y-[4px]'>
                <div className='flex items-center space-x-[3px]'>
                    <h1 className='text-[12px] leading-[19.2px] font-normal text-white'>{nameHeader} • {TimeAgo(time)}</h1>
                </div>
                <h1 className='text-[14px] leading-[21px] font-normal text-white'>{comment}</h1>

                <div className='flex space-x-[2.5px] items-center'>
                    <Image src={"/profile/like.png"} width={500} height={500} alt='like' className='h-[20px] w-[20px]' />
                    <h1 className='text-[12px] leading-[14.52px] text-[#98A2B3]'>2k</h1>
                </div>
            </div>


        </div>
    )
}

export default Commentbox
import Image from 'next/image'
import React from 'react'

type Props = {}

const FirstCommentBox = (props: Props) => {
    return (
        <div className='flex space-x-3 items-start'>
            <div className=' relative w-[26px] h-[26px]'>
                <Image src={"/profile/co.png"} alt='profile pic' width={500} height={500} className='w-[26px] h-[26px] object-cover object-top  rounded-full' />
            </div>

            {/* the name and the left */}
            <div className='flex flex-col space-y-[4px]'>
                <div className='flex items-center space-x-[3px]'>
                    <h1 className='text-[14px] leading-[17.64px] font-bold text-[#EAFF62]'>Erman Ozgur</h1>
                    <div className='px-[17px] py-[1px] rounded-[8px] bg-[#EAFF62] text-black text-[12px] leading-[15.12px] font-medium font-plus'>
                        Coach
                    </div>
                </div>
                <h1 className='text-[12px] leading-[13.8px] font-normal text-white'>Hi Altug, your dribbling looks great. It might be good if we work together on the shooting.</h1>
            </div>


        </div>
    )
}

export default FirstCommentBox
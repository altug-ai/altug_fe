import Image from 'next/image'
import React from 'react'

type Props = {}

const Commentbox = (props: Props) => {
    return (
        <div className='flex space-x-[12px] items-start'>
            <div className=' relative w-[32px] h-[32px]'>
                <Image src={"/profile/img.png"} alt='profile pic' width={500} height={500} className='w-[32px] h-[32px] object-cover object-top  rounded-full' />
            </div>

            {/* the name and the left */}
            <div className='flex flex-col space-y-[4px]'>
                <div className='flex items-center space-x-[3px]'>
                    <h1 className='text-[12px] leading-[19.2px] font-normal text-white'>nevzat • 20min</h1>
                </div>
                <h1 className='text-[14px] leading-[21px] font-normal text-white'>Her daughter is so smart!</h1>

                <div className='flex space-x-[2.5px] items-center'>
                    <Image src={"/profile/like.png"} width={500} height={500} alt='like' className='h-[20px] w-[20px]' />
                    <h1 className='text-[12px] leading-[14.52px] text-[#98A2B3]'>2k</h1>
                </div>
            </div>


        </div>
    )
}

export default Commentbox
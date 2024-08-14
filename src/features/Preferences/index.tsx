import Image from 'next/image';
import React from 'react'

type Props = {}

const Preferences = (props: Props) => {
    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>


            <div className='flex items-center max-w-[388px] w-full justify-between mb-[30px]'>
                <div className=' cursor-pointer  flex space-x-3 items-center '>
                    <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px]  cursor-pointer' />
                    <h1 className='text-[18px] font-medium leading-[24.35px] text-[#FFFFFF]'>My Preferences</h1>
                </div>
                <h1 className='text-[12px] cursor-pointer leading-[12.13px] tracking-[0.3%] font-semibold text-[#357EF8]'>Reset Preferences</h1>
            </div>

            <div className='flex flex-col space-y-6 max-w-[388px] w-full'>

                {/* AGE */}
                <div className='flex flex-col space-y-4 w-full'>
                    <h1 className=' font-medium text-[16px] leading-[14.02px] text-white'>Age</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>26 years</h1>
                </div>

                {/* Team participation */}
                <div className='flex flex-col space-y-4 w-full'>
                    <h1 className=' font-medium text-[16px] leading-[14.02px] text-white'>Team Participation</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>Playing for XYZ Club</h1>
                </div>


                {/* Training Frequency */}
                <div className='flex flex-col space-y-4 w-full'>
                    <h1 className=' font-medium text-[16px] leading-[14.02px] text-white'>Training Frequency</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>3-4 times a week</h1>
                </div>

                {/* My Goals: */}
                <div className='flex flex-col space-y-4 w-full'>
                    <h1 className=' font-medium text-[16px] leading-[14.02px] text-white'>My Goals:</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>Improve technical skills,</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>Enhance physical fitness</h1>
                    <h1 className=' font-medium text-[24px] leading-[30px] text-white '>Get advice from professional footballers</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px]  text-white '>Get daily routine advice</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px]  text-white '>Get health and food advice</h1>
                </div>

                {/* favorite Footballers */}
                <div className='flex flex-col space-y-4 w-full'>
                    <h1 className=' font-medium text-[16px] leading-[14.02px] text-white'>Favorite Footballers:</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>Cristiano Ronaldo, Lionel Messi</h1>
                </div>


                {/* content preferences */}
                <div className='flex flex-col space-y-4 w-full'>
                    <h1 className=' font-medium text-[16px] leading-[14.02px] text-white'>Content Preferences:</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>Video tutorials</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>Chat with professionals</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>Live sessions</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>Written guides</h1>
                    <h1 className=' font-medium text-[24px] leading-[25px] text-white'>Interactive challenges</h1>
                </div>

            </div>


        </div>
    )
}

export default Preferences
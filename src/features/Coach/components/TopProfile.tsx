"use client";
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation';

type Props = {
    name?: string;
    position?: string;
    club?: string;
    DOB?: string;
    coach?: boolean;
    height?: string;
    weight?: string;
    foot?: string;
    profilepic?: string;
    id?: string;
}

const TopProfile = ({ name, position, DOB, club, coach, height, weight, foot, profilepic, id }: Props) => {

    const router = useRouter()

    return (
        <div className='w-full rounded-[12px] max-w-[388px] bg-[#181928] min-h-[8px]'>

            <div className='  h-[327px] w-full bg-cover flex justify-center' style={{ backgroundImage: 'url("/profile/shape.png")' }}>
                <Image src={profilepic ?? "/profile/unknownp.png"} alt='player image' width={500} height={500} className='max-w-[359px] w-full object-cover object-top h-[334px]' />
            </div>


            <div className=' px-[24px] py-[14px]'>
                <h1 className='text-[24px] leading-[24.53px] tracking-[0.26px] font-medium text-white'>{name}</h1>
                <h1 className='text-[14px] font-normal leading-[20px] text-[#FFFFFF] mt-[16px]'>{position ? `${position} :` : ""} <span className='font-bold '>{club}</span></h1>
                {
                    !coach && (
                        <h1 className='text-[14px] font-normal leading-[20px] text-[#FFFFFF] mt-[16px]'>Date Of Birth: <span className='font-bold '>{DOB}</span></h1>
                    )
                }


                <div className='flex justify-between flex-wrap mt-[16px]'>
                    <h1 className='text-[14px] font-normal leading-[20px] text-[#FFFFFF]'>Height: <span className='font-bold '>{height}</span></h1>
                    <h1 className='text-[14px] font-normal leading-[20px] text-[#FFFFFF] '>Weight: <span className='font-bold '>{weight}</span></h1>
                    {
                        !coach && (
                            <h1 className='text-[14px] font-normal leading-[20px] text-[#FFFFFF]'>Foot: <span className='font-bold '>{foot}</span></h1>
                        )
                    }

                </div>

                {/* Get coached by the coached */}
                <div onClick={() => {
                    if (coach) {
                        router.push(`/chat/coach/${id}`)
                    } else {
                        router.push(`/chat/player/${id}`)
                    }

                }} className='rounded-[35px] cursor-pointer mt-[16px] w-full gap-[12px] h-[36px] bg-[#357EF8]  text-[12px] font-medium leading-[15.12px] text-[#F5F7F8] flex flex-col justify-center items-center'>
                    Get coached by {name}
                </div>
            </div>

        </div>
    )
}

export default TopProfile
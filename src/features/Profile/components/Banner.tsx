"use client";
import { AuthContext } from '@/context/AuthContext';
import Image from 'next/image';
import React, { useContext } from 'react'
import { countries } from 'countries-list'
import Flag from 'react-flagkit';

type Props = {}

const Banner = (props: Props) => {
    const { profilepic, profile, totalPoint, stats, position, country, pref } = useContext(AuthContext)


    const getCountryCode = (country: string) => {
        const entry = Object.entries(countries).find(([key, value]) => value.name === country);
        return entry ? entry[0] : undefined;
    };
    return (
        <div className='w-full max-w-[388px] bg-[#38374B] rounded-[24px] relative px-[15px] py-[8px]'>

            <div className='max-w-[358px] w-full h-[320px] overflow-hidden bg-cover bg-center relative' style={{ backgroundImage: 'url("/profile/Head.svg")', clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)' }}>
                <div className='max-w-[358px] w-full h-[320px] bg-cover bg-center relative' style={{ backgroundImage: 'url("/profile/logoplay.png")' }}>
                    <div className='absolute inset-0 bg-black opacity-40 z-0' ></div>


                    <div className='flex justify-between px-[20px] z-10  absolute'>

                        {/* Profile pic */}
                        <div className='h-full w-full'>
                            <Image alt='profile pic' src={profilepic ?? "/profile/unknownp.png"} width={1000} height={1000} className='h-[320px]  z-10  rounded-xl object-cover object-top' />
                        </div>

                        {/* Right hand */}
                    </div>


                    <div className='flex justify-between px-[20px] z-10  invisible'>

                        {/* Profile pic */}
                        <div className='h-full w-full'>
                            <Image alt='profile pic' src={"/profile/unknownp.png"} width={1000} height={1000} className='h-[320px]  z-10  rounded-xl object-cover object-top' />
                        </div>

                        {/* Right hand */}
                    </div>

                    <div className='flex flex-col absolute top-3 left-3 space-y-3 h-fit '>
                        <div className='h-[72.7px] w-[68.94px] bg-cover flex flex-col items-center justify-center' style={{ backgroundImage: 'url("/profile/Number.png")' }}>
                            <h1 className='font-bold text-[24px] leading-[12.54px] text-white'>{totalPoint ?? 0}</h1>
                        </div>
                        <div className='h-[72.7px] w-[68.94px] bg-cover flex flex-col items-center justify-center' style={{ backgroundImage: 'url("/profile/Number.png")' }}>
                            <h1 className='font-bold text-[24px] leading-[12.54px] text-white'>{position}</h1>
                        </div>
                    </div>

                    <div className='flex flex-col absolute top-3 right-3 space-y-3 h-fit'>
                        <div className='h-[72.7px] w-[68.94px] bg-cover flex flex-col items-center justify-center' style={{ backgroundImage: 'url("/profile/Number.png")' }}>
                            <Flag country={getCountryCode(country)} size={35} />
                        </div>
                        {/* <div className='h-[72.7px] w-[68.94px] bg-cover flex flex-col items-center justify-center' style={{ backgroundImage: 'url("/profile/Number.png")' }}>
                            <h1 className='font-bold text-[24px] leading-[12.54px] text-white'></h1>
                        </div> */}
                    </div>

                </div>



            </div>
            {/* 
            <div className='w-full flex justify-center absolute -mt-6 pr-8 z-[70]'>
                <div className='bg-[#6F819C] rounded-[20px] px-[12px] py-[4px] w-fit'>
                    <h1 className='text-white uppercase text-[12px] font-bold leading-[15.12px] tracking-[-2%]'>
                        {pref?.data?.attributes?.position}
                    </h1>
                </div>
            </div> */}


            <h1 className='text-[32px] font-medium leading-[40.32px] mt-3 tracking-[-0.64px] text-center font-clash capitalize text-white'>{profile?.attributes?.username ?? ""}</h1>

            {/* Stats grid */}
            <div className='grid grid-cols-3 mt-[5px]'>
                <div className='flex flex-col pb-3 border w-full items-center border-l-0 space-y-1 border-t-0 border-b-0'>
                    <h1 className='text-[10px] font-normal font-clash leading-[10.911px]  text-white '>Accuracy</h1>
                    <h1 className='text-[32px] font-medium leading-[22.91px] font-clash text-white'>{stats?.accuracy}</h1>
                </div>

                <div className='flex flex-col pb-3 border w-full items-center border-t-0 space-y-1 border-s-0 border-r-0 border-b-0'>
                    <h1 className='text-[10px] font-normal font-clash leading-[10.911px]  text-white '>Shooting</h1>
                    <h1 className='text-[32px] font-medium leading-[22.91px] font-clash text-white'>{stats?.shooting}</h1>
                </div>

                <div className='flex flex-col pb-3 border w-full items-center border-r-0 space-y-1 border-t-0 border-b-0'>
                    <h1 className='text-[10px] font-normal font-clash leading-[10.911px]  text-white '>Defense</h1>
                    <h1 className='text-[32px] font-medium leading-[22.91px] font-clash text-white'>{stats?.defense}</h1>
                </div>

                <div className='flex flex-col pt-3 border w-full items-center border-l-0 space-y-1 border-b-0'>
                    <h1 className='text-[10px] font-normal font-clash leading-[10.911px]  text-white '>Strength</h1>
                    <h1 className='text-[32px] font-medium leading-[22.91px] font-clash text-white'>{stats?.strength}</h1>
                </div>

                <div className='flex flex-col pt-3 border w-full items-center border-l-0 space-y-1 border-b-0 border-r-0'>
                    <h1 className='text-[10px] font-normal font-clash leading-[10.911px]  text-white '>Stamina</h1>
                    <h1 className='text-[32px] font-medium leading-[22.91px] font-clash text-white'>{stats?.stamina}</h1>
                </div>

                <div className='flex flex-col pt-3 border w-full items-center border-r-0 space-y-1 border-b-0'>
                    <h1 className='text-[10px] font-normal font-clash leading-[10.911px]  text-white '>Passing</h1>
                    <h1 className='text-[32px] font-medium leading-[22.91px] font-clash text-white'>{stats?.passing}</h1>
                </div>
            </div>
        </div>
    )
}

export default Banner;

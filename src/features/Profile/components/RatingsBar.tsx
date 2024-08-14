"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

type Props = {
    number: number;
    stat: string;
}

const RatingsBar = ({ number, stat }: Props) => {
    const [barHeight, setBarHeight] = useState<string>("");

    useEffect(() => {
        // Calculate the height of the bar dynamically based on the number
        const maxHeight = 209; // Maximum height of the bar
        const calculatedHeight = (maxHeight / 10) * number; // Calculate height based on the number
        setBarHeight(`${calculatedHeight.toFixed(1)}px`);
    }, [number, stat]);



    return (
        <div className='flex flex-col justify-end items-center space-y-2 mx-2'>
            <h1 className='font-semibold text-[16px] leading-[12.25px] tracking-[0.3%] text-[#FFFFFF]'>{number}</h1>
            {
                barHeight !== "" && (
                    <Image style={{ height: barHeight }} className={` w-[24px] object-cover rounded-t-[4px]`} alt='the profile bar' src='/profile/bar.png' width={500} height={500} />
                )
            }

            <h1 className='font-medium text-[10px] leading-[10.91px] text-[#FFFFFF]'>{stat}</h1>
        </div>
    )
}

export default RatingsBar
"use client";
import React, { useContext } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from 'next/image'
import { useGetLeaderboard } from '@/hooks/useGetLeaderboard';
import { TbLoader3 } from 'react-icons/tb';
import { AuthContext } from '@/context/AuthContext';
import { useTranslations } from "next-intl";

type Propss = {
    user?: boolean;
    gold?: boolean;
    silver?: boolean;
    bronze?: boolean;
    points: string;
    username: string;
    image?: string;
    rk: number;
}

const Row = ({ user, gold, silver, bronze, points, username, image, rk }: Propss) => {


    return (
        <TableRow style={{ borderRadius: "30%" }} className={` ${user ? "bg-[#357EF8] border-none" : "bg-[#181928] "} h-[52px]   cursor-pointer`}>
            <TableCell className='text-[12px] leading-[18px] font-semibold text-white'>{rk + 1}.</TableCell>
            <TableCell className='text-[12px] leading-[18px] font-medium text-white flex space-x-4 items-center'>
                <div className='flex flex-col items-center mb-1'>
                    {
                        (gold || silver || bronze) && (
                            <Image src={`${silver ? "/tab/Silver.png" : bronze ? "/tab/Bronze.png" : gold ? "/tab/king.png" : ""}`} width={500} height={500} alt='The king png' className='w-[11.5px] h-[9.07px] object-cover' />
                        )
                    }
                    <Image src={image ?? "/profile/unknownp.png"} alt='Deepay' width={500} height={500} className={`w-[20px]  ${gold ? "border border-[#FFAA00]" : silver ? "border border-[#F6F6F6]" : bronze ? "border border-[#DB9000]" : user ? "border border-[#F6F6F6]" : ""}  h-[20px] rounded-full object-cover object-center`} />
                </div>
                <h1>{username}</h1>
            </TableCell>
            <TableCell className='text-[12px] leading-[18px] font-semibold text-white text-center'>{points}</TableCell>
        </TableRow>
    )
}

type Props = {}

const Ranking = (props: Props) => {
    const { data, loading: loader } = useGetLeaderboard()
    const { profileId, loading, leagues } = useContext(AuthContext)
    const t = useTranslations('Home.Leaderboard');
    return (
        <div className='max-w-[388px]   text-white mt-[30px] w-full flex flex-col space-y-[18px] mb-[50px]'>

            {
                (loading || loader) && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }

            <Table className=''>
                <TableHeader className='h-[65px] bg-[#181928]'>
                    <TableRow className=' h-[65px] my-1  cursor-pointer'>
                        <TableHead className='text-[12px]  leading-[18px] font-semibold text-white '>RK</TableHead>
                        <TableHead className='text-[12px] leading-[18px] font-semibold text-white'>{t("Username")}</TableHead>
                        <TableHead className='text-[12px] leading-[18px] font-semibold text-white text-center'>{t("Total")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className=''>
                    {
                        data?.map((dat: any, index: any) => (
                            <Row rk={index} key={dat?.id} image={dat?.attributes?.profile_pic?.data?.attributes?.url} user={dat?.id === profileId} gold={index === 0} silver={index === 1} bronze={index === 2} username={dat?.attributes?.username} points={dat?.attributes?.total_point} />
                        ))
                    }
                </TableBody>
            </Table>

        </div>
    )
}

export default Ranking
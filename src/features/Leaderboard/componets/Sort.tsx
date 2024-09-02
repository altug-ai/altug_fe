"use client";
import React, { useContext, useState } from 'react'
import {
    NewTrigger,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { countries } from 'countries-list'
import { useGetLeaderboard } from '@/hooks/useGetLeaderboard';
import { LeaderboardContext } from '@/context/LeaderboardContext';
import { AuthContext } from '@/context/AuthContext';
import { useTranslations } from "next-intl";
type Props = {}

const Sort = (props: Props) => {

    const { setCountry, setleague } = useContext(LeaderboardContext)
    const { leagues } = useContext(AuthContext)
    const t = useTranslations('Home.Leaderboard');

    return (
        <div className='max-w-[388px]  w-full flex flex-col space-y-[18px] '>
            {/* leagues */}
            <Select onValueChange={(e) => {
                // setData([])
                setleague(e)
            }}>
                <NewTrigger className="w-full px-[24px] text-white text-[16px] font-semibold leading-[22px]  h-[54px] rounded-[65px] bg-[#181928]">
                    <div className=''> <span className='text-[#616A76]'>{t("League")}</span> <SelectValue className='text-white' placeholder={t("AllLeague")} /></div>
                </NewTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{t("Leagues")}</SelectLabel>
                        {
                            leagues?.map((league) => (
                                <SelectItem key={league?.id} value={league?.attributes?.title}>{t(league?.attributes?.title)}  {league?.attributes?.min} - {league?.attributes?.max ?? "+"}</SelectItem>
                            ))
                        }
                        <SelectItem value="leagueAll">{t("Leagues")}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* country */}
            <Select onValueChange={(e) => {
                // setData([])
                setCountry(e)
            }}>
                <NewTrigger className="w-full px-[24px] text-white text-[16px] font-semibold leading-[22px]  h-[54px] rounded-[65px] bg-[#181928]">
                    <div className=''> <span className='text-[#616A76]'>{t("Country")}</span> <SelectValue className='text-white' placeholder={t("AllCountry")} /></div>
                </NewTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{t("Countries")}</SelectLabel>
                        <SelectItem value="all">{t("AllCountry")}</SelectItem>
                        {
                            Object.keys(countries).map((countryCode: any) => (
                                // @ts-ignore
                                <SelectItem key={countries[countryCode].name} value={countries[countryCode].name}>{countries[countryCode].name}</SelectItem>
                            ))
                        }

                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default Sort
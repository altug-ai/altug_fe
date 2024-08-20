import React, { useContext, useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import RatingsBar from '@/features/Profile/components/RatingsBar'
import { useGetSubmittedChallenges } from '@/hooks/useGetSubmittedChallenges'
import { Stat } from '@/context/types'
import { useRouter } from 'next/navigation'
import { useParams } from "next/navigation";
import { ChallengeContext } from '@/context/ChallengeContext'
import { AuthContext } from '@/context/AuthContext'
import { useTranslations } from "next-intl";

type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>
    point: number;
    stat: string;
}

const SubmissionCompleted = ({ setRoute, point, stat }: Props) => {
    const router = useRouter();
    const [daysSelect, setDaysSelect] = useState<string>("7")
    const { data: accepted, loading: acceptedLoader, stats, setStats } = useGetSubmittedChallenges(parseInt(daysSelect));
    const { totalPoint } = useContext(AuthContext)
    const { userPoint } = useContext(ChallengeContext)
    const t = useTranslations('Home.ChallengePage');
    const params = useParams();
    const { slug }: any = params;
    // let statss: Stat = stats

    // useEffect(() => {
    //     // This function will run when the component is unmounted
    //     return () => {
    //         setRoute(0);
    //     };
    // }, []);

    return (
        <div className='w-full max-w-[388px]'>

            <div className='mt-[20px] flex flex-col items-center'>
                <div className='  h-[100.81px] w-[95.56px] bg-cover flex flex-col items-center justify-center' style={{ backgroundImage: 'url("/profile/Number.png")' }}>

                    <h1 className='font-bold text-[24px] leading-[12.54px]   text-white'>{totalPoint ?? 0}</h1>
                </div>
                <h1 className='font-semibold max-w-[235px] text-[28px] text-center leading-[35.28px] tracking-[0.3%] text-white'>{(userPoint === "0" || userPoint === "") ? t("Failed") : t("Congrats")}</h1>
            </div>

            <div className='w-full max-w-[388px] flex justify-between items-center my-[30px]'>
                <h1 className='font-semibold text-[16px] leading-[12.25px] tracking-[0.3%] text-white'>{t("Stats")}</h1>

                <Select onValueChange={(e) => {
                    setDaysSelect(e)
                }}>
                    <SelectTrigger className="w-[105px] h-[28px] px-[5px] bg-black text-white">
                        <SelectValue placeholder={t("7Days")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t("Days")}</SelectLabel>
                            <SelectItem value="7">{t("7Days")}</SelectItem>
                            <SelectItem value="14">{t("14Days")}</SelectItem>
                            <SelectItem value="30">{t("30Days")}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex w-full justify-center h-[224.85px] max-w-[388px] mt-[30px] ' >
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stats?.accuracy} stat={t("Accuracy")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stats?.shooting} stat={t("Shooting")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stats?.defense} stat={t("Defense")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stats?.strength} stat={t("Strength")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stats?.stamina} stat={t("Stamina")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
                <RatingsBar number={stats?.passing} stat={t("Passing")} />
                <div className='h-[224.85px] w-[1px] bg-[#BBBBBB]' />
            </div>

            {
                (userPoint === "0" || userPoint === "") && (
                    <div onClick={() => {
                        window.location.reload();
                        setRoute(0)
                    }} className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                        Redo Challenge
                    </div>
                )
            }


            <div className='w-full max-w-[388px] fixed bottom-[10%] '>
                <div onClick={() => {
                    router.push("/profile")
                }} className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                    {t("Profile")}
                </div>
                <h1 className='text-[12px] text-center  leading-[16.24px] font-medium text-white'>{t("Challnge")} {stat} {t("by")} {userPoint ?? "0"}x.</h1>
            </div>
        </div>
    )
}

export default SubmissionCompleted
import { ChallengeContext } from '@/context/ChallengeContext'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { VideoToFrames, VideoToFramesMethod } from '@/lib/VideoToFrame'
import OpenAI from "openai";
import { useTranslations } from "next-intl";

type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>;
}
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    dangerouslyAllowBrowser: true,
});

const Submissionupload = ({ setRoute }: Props) => {
    const { videoUrl, handleStartCaptureClick, setVideoUrl, handleChat } = useContext(ChallengeContext)
    const [frames, setFrames] = useState<any>([]);
    const t = useTranslations('Home.ChallengePage');

    return (
        <div className='w-full max-w-[388px]'>

            {/* <div className='h-[480px] max-w-[307px] mx-auto w-full bg-cover bg-center grid place-items-center' style={{ backgroundImage: 'url("/tab/Playing.png")' }}>
                <Image src={"/profile/Video.png"} width={600} height={600} alt='video icon' className='w-[74.29px] h-[75.4px] cursor-pointer' />
            </div> */}
            {
                videoUrl && (
                    <video className='h-[480px]  object-cover rounded-md' controls preload="none">
                        <source src={videoUrl} type="video/mp4" />
                        {t("Browser")}
                    </video>
                )
            }

            <h1>{t("Response")}</h1>
            {/* <h1 className='text-white'>This is the response : {response}</h1> */}

            <div>
                {frames.map((frameDataUrl: string | undefined, index: React.Key | null | undefined) => (
                    <img key={index} src={frameDataUrl} alt={`Frame ${index}`} />
                ))}
            </div>

            <div className='flex flex-col w-full space-y-[20px] mt-[20px] mb-[50px]'>
                <div onClick={handleChat} className='rounded-[35px] cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                    {t("Submission")}
                </div>
                <div onClick={() => {
                    setVideoUrl("");
                    handleStartCaptureClick();
                    setRoute(5)
                }} className='rounded-[35px] cursor-pointer mt-3 w-full gap-[12px] border border-[#F5F7F8] h-[48px] bg-black  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                    {t("Challenge")}
                </div>

            </div>
        </div>
    )
}

export default Submissionupload
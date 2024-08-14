import { AuthContext } from '@/context/AuthContext'
import { ChallengeContext } from '@/context/ChallengeContext'
import Image from 'next/image'
import React, { useCallback, useContext, useRef } from 'react'
import { useTranslations } from "next-intl";

type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>
}

const Recording = ({ setRoute }: Props) => {

    const { recording, setRecording, setFacingMode, facingMode, setVideoBlob, setVideoUrl, videoRef, handleStartCaptureClick, handleStopCaptureClick, paused, pauseRecording, resumeRecording } = useContext(ChallengeContext)
    const t = useTranslations('Home.ChallengePage');


    return (
        <div className='relative max-w-[388px] w-full'>
            <video autoPlay={true}
                playsInline={true}
                muted={true} ref={videoRef} className='h-[90vh] rounded-md w-full  object-cover'>
            </video>

            <div className='absolute bottom-10 w-full'>
                <div className='flex flex-col items-center'>
                    <div className='flex space-x-10 items-center justify-center '>
                        {
                            (recording && !paused) ? (<Image src={"/tab/Record.png"} onClick={pauseRecording} width={500} height={500} alt='recording' className='w-[70px] cursor-pointer animate-pulse h-[70px] object-cover' />) : (
                                <Image src={"/tab/Pause.png"} onClick={resumeRecording} width={500} height={500} alt='recording' className='w-[70px] h-[70px] object-cover cursor-pointer' />
                            )
                        }

                        <Image src={"/tab/Restart.png"} onClick={() => {
                            // setVideoUrl("")
                            if (recording) {
                                handleStopCaptureClick();
                                setVideoUrl("")
                            }
                            if (facingMode === "user") {
                                setFacingMode("environment")
                            } else {
                                setFacingMode("user")
                            }
                            handleStartCaptureClick();
                        }} width={500} height={500} alt='recording' className='w-[48px] h-[48px] object-cover cursor-pointer' />
                    </div>

                    {
                        paused && (
                            <div onClick={() => {
                                handleStopCaptureClick();
                                setRoute(1)
                            }} className='rounded-[35px]  cursor-pointer mt-3 w-[80%] gap-[12px] h-[48px] py-2 bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                {t("Video")}
                            </div>
                        )
                    }

                </div>

            </div>
        </div>
    )
}

export default Recording
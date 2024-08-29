import Image from 'next/image'
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { ChallengeContext } from '@/context/ChallengeContext';
type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>;
    route: number;
    title?: string;
}

const Header = ({ setRoute, route, title }: Props) => {
    const router = useRouter();
    const { handleStopCaptureClick, setVideoUrl, handleStartCaptureClick, recording, setExplanation } = useContext(ChallengeContext)
    return (
        <div onClick={() => {
            if (route === 5) {
                setVideoUrl("");
                if (recording) {
                    handleStopCaptureClick();
                }
                setRoute(0)
            }
            if (route === 1) {
                setVideoUrl("");
                handleStartCaptureClick()
                setRoute(5)
            }
            if (route === 2) {
                setExplanation("")
                setRoute(1)
            }
            if (route === 0) {
                router.push("/challenge")
            }

            if (route === 3) {
                setVideoUrl("");
                setRoute(0)
            }



        }} className='w-full  max-w-[388px] h-[48px]'>
            <div className='w-full cursor-pointer max-w-[388px] flex space-x-3 items-center mb-[30px]'>
                <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px]  cursor-pointer' />
                {
                    title && (
                        <h1 className='text-[18px] font-medium leading-[24.35px] text-[#FFFFFF]'>{title}</h1>
                    )
                }

            </div>


        </div>
    )
}

export default Header
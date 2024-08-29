import React, { useContext } from 'react'
import ChallengeBox from '../components/ChallengeBox'
import { ChallengeContext } from '@/context/ChallengeContext';
import { Progress } from "@/components/ui/progress"
import { useTranslations } from "next-intl";
type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>;
    description?: string;
    goal?: string;
    title?: string;
    image?: string;
    accepted?: any;
}


const SubmissionLoad = ({ setRoute, description, goal, accepted, title, image }: Props) => {
    const { videoUrl, error, handleUploadChallengeVideo, progress, score, explanation, handleChat, point, setExplanation } = useContext(ChallengeContext)
    const t = useTranslations('Home.ChallengePage');

    function calculateScore() {
        let pointt = parseInt(`${point}`)
        let scoree = parseInt(`${score}`)
        // Check if point is a valid number (not NaN or Infinity)
        if (isNaN(pointt) || pointt === Infinity) {
            throw new Error("Invalid point value: Please provide a valid number for point.");
        }

        const percentageThreshold = 0.6;
        const minimumScore = pointt * percentageThreshold;

        return scoree >= minimumScore ? t("Pass") : t("Fail");
    }


    function calculateNewScore() {
        let pointt = parseInt(`${point}`)
        let scoree = parseInt(`${score}`)
        // Check if point is a valid number (not NaN or Infinity)
        if (isNaN(pointt) || pointt === Infinity) {
            throw new Error("Invalid point value: Please provide a valid number for point.");
        }

        const percentageThreshold = 0.6;
        const minimumScore = pointt * percentageThreshold;

        return scoree >= minimumScore ? true : false;
    }

    return (
        <div className='w-full max-w-[388px]'>
            <div className='mt-[30px] w-full'>
                <ChallengeBox image={image} accepted={accepted} video={videoUrl} goal={goal} title={title} submission challengeHeader />
            </div>

            <div className='mt-[50px]'>
                <div className='flex flex-col space-y-2'>
                    <h1 className='font-medium text-[24px] leading-[32.47px] text-[#FFFFFF]'>{t("Instruction")}</h1>
                    <h1 className='text-[#FFFFFF] font-medium leading-[16.24px] text-[12px] '>{description}</h1>
                </div>
            </div>

            {
                explanation !== "" && (
                    <div className='mt-[50px]'>
                        <div className='flex flex-col space-y-2 mb-[20px]'>
                            <h1 className='font-medium text-[24px] leading-[32.47px] text-[#FFFFFF]'>{t("This")} {calculateScore()}</h1>
                            <h1 className='font-medium text-[24px] leading-[32.47px] text-[#FFFFFF]'>{t("Explanation")}</h1>
                            <h1 className='text-[#FFFFFF] font-medium leading-[16.24px] text-[12px] '>{explanation}</h1>
                        </div>

                        {
                            !calculateNewScore() && (
                                <div className='w-full max-w-[388px]'>
                                    <div onClick={() => {
                                        setExplanation("")
                                        setRoute(0)
                                    }} className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                        Redo Challenge
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            }



            {
                error ? (
                    <div className='w-full max-w-[388px] fixed bottom-[15%] '>
                        <div onClick={handleChat} className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                            {t("Again")}
                        </div>
                        <h1 className='text-[12px] text-center  leading-[16.24px] font-medium text-white'>{t("Incomplete")}</h1>
                    </div>
                ) : !(explanation !== "" && !calculateNewScore()) && (
                    // <div className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                    //     Analyzing your submission
                    // </div>
                    <div className='w-full relative max-w-[388px] mt-10 gap-[12px]'>
                        <Progress value={progress} />

                        <h1 className='absolute top-1 right-20 whitespace-nowrap text-[16px] text-white font-medium text-center'>{t("Analyze")}</h1>
                    </div>

                )
            }

        </div>
    )
}

export default SubmissionLoad
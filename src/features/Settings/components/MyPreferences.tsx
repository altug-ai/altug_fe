"use client";
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input';
import { AuthContext } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { TbLoader3 } from 'react-icons/tb';
import axios from 'axios';
import { FormIndex } from '@/features/Onboarding/lib/types';
import { useRouter } from 'next/navigation';
import TabBar from '@/features/Profile/components/TabBar';
import { useTranslations } from "next-intl";
import { useGetOnboardingAnswers } from '@/hooks/useGetOnboardingAnswers';
import { useGetOnboardingQuestions } from '@/hooks/useGetOnboardingQuestions';


type Props = {}

const MyPreferences = (props: Props) => {
    const { pref, jwt, loading, profileId, setPref } = useContext(AuthContext)
    const [load, setLoad] = useState<boolean>(false)
    const [current, setCurrent] = useState<any>()
    const router = useRouter();
    const { toast } = useToast();
    const [form, setForm] = useState<any>()
    const t = useTranslations('Home.Preference');
    const { data: answers, loading: answersLoading, reload, setReload } = useGetOnboardingAnswers()
    const { data: questions, loading: questionLoading } = useGetOnboardingQuestions()

    // console.log("this is the data", data)

    // console.log("this is the answers and thsi is the questin", answers, questions)



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        let text = e.target.value
        setForm({
            ...form,
            [e.target.name]: text
        })
    }

    function stringifyInput(input: any) {
        if (Array.isArray(input)) {
            // Convert the array to a JSON string
            return JSON.stringify(input);
        } else if (typeof input === 'string') {
            // Return the string as it is
            return input;
        } else {
            // Optionally handle other types or throw an error
            throw new Error('Input must be an array or a string');
        }
    }

    const addOnboardinganswer = async (id: number, answer: string) => {
        try {

            let newAnswer = stringifyInput(answer)
            // search to see if there is already an answered question
            const onboardinganswer = await axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/onboarding-answers?filters[onboarding_question][id][$eq]=${id}&filters[client_profile][id][$eq]=${profileId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            if (onboardinganswer.data.data.length > 0) {
                const onboarding = await axios.put(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/onboarding-answers/${onboardinganswer.data.data[0]?.id}`,
                    {
                        data: {
                            answer: newAnswer
                        },
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                return onboarding
            } else {
                const onboarding = await axios.post(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/onboarding-answers`,
                    {
                        data: {
                            client_profile: profileId,
                            answer: newAnswer,
                            onboarding_question: id
                        },
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                return onboarding
            }
        } catch (error) {
            console.log("his is the error", error)
        }
    }


    const handleUpdate = async (formId: number) => {
        setLoad(true)
        setCurrent(formId)

        try {
            let answer = form?.[formId];

            let response: any = await addOnboardinganswer(formId, answer);
            if (response?.data?.data?.id) {
                toast({
                    description: `Updated successfully`,
                });
                setLoad(false);
                setReload(!reload)
            } else {
                setCurrent(null)
                setReload(!reload)
                setLoad(false)
                toast({
                    variant: "destructive",
                    description: `Couldn't update successfully`,
                });
            }
        } catch (error) {
            setCurrent(null)
            setReload(!reload)
            setLoad(false);
            toast({
                variant: "destructive",
                description: `Couldn't update successfully`,
            });
        }
    }


    function parseStringToArray(input: any) {
        // Check if the input is a string
        if (typeof input === 'string') {
            try {
                // Try parsing the input as JSON
                const parsed = JSON.parse(input);

                // Check if the parsed result is an array
                if (Array.isArray(parsed)) {
                    return parsed;
                } else {
                    // If not an array, return the original string
                    return input;
                }
            } catch (error) {
                // If JSON parsing fails, return the original string
                return input;
            }
        } else {
            // Handle the case where input is not a string (optional)
            return input
        }
    }

    const getTheAnswer = (id: number) => {
        const answer: any = answers?.find((ans: any) => ans?.attributes?.onboarding_question?.data?.id === id)
        return parseStringToArray(answer?.attributes?.answer)
    }


    useEffect(() => {
        // Create a new form state based on the questions
        const newForm = questions.reduce((acc: any, question: any) => {
            acc[question?.id] = getTheAnswer(question?.id) ?? '';
            return acc;
        }, {});

        // Update the form state once with the complete object
        setForm(newForm);
    }, [answers, questions]);

    // console.log("this is the form", form)



    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>
            <div className='flex items-center max-w-[388px] w-full justify-between mb-[30px]'>
                <div onClick={() => {
                    router.push("/settings")
                }} className=' cursor-pointer  flex space-x-3 items-center '>
                    <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px]  cursor-pointer' />
                    <h1 className='text-[18px] font-medium leading-[24.35px] text-[#FFFFFF]'>{t("Title")}</h1>
                </div>
                <h1 className='text-[12px] cursor-pointer leading-[12.13px] tracking-[0.3%] font-semibold text-[#357EF8]'>{t("Sub")}</h1>
            </div>


            {
                ((questionLoading) || (answersLoading) || (loading)) && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }
            {/* According */}
            <div className='max-w-[388px] w-full mb-[60px]'>


                <Accordion type="single" collapsible className="w-full flex flex-col space-y-[30px]">

                    {
                        questions?.map((question: any) => (
                            <AccordionItem key={question?.id} className='border border-white rounded-[6px] px-[20px]' value={question?.attributes?.question}>
                                <AccordionTrigger className='my-[20px] text-white text-[24px] text-start font-medium leading-[30.24px]'>{question?.attributes?.question}</AccordionTrigger>
                                <AccordionContent className='text-white'>
                                    {
                                        question?.attributes?.type === "single-choice" && (
                                            <div className='w-full'>
                                                <div className='flex mb-[30px] w-full justify-center flex-wrap  items-center'>
                                                    {
                                                        question?.attributes?.options?.map((option: any) => (
                                                            <div key={option?.id} onClick={() => {
                                                                setForm({
                                                                    ...form,
                                                                    [question?.id]: option?.option
                                                                })
                                                            }} className={`rounded-[35px] mx-2 my-2 px-2 min-w-[100px] cursor-pointer gap-[12px] h-[39px]   text-[13px] font-semibold leading-[16.38px] ${form?.[question?.id] === option?.option ? "bg-[#357EF8] text-white" : "bg-white text-[#1B1B1B]"}  flex flex-col justify-center items-center`}>
                                                                {option?.option}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        question?.attributes?.type === "multiple-choice" && (
                                            <div className='w-full'>
                                                <div className='flex mb-[30px] w-full justify-center flex-wrap  items-center'>
                                                    {
                                                        question?.attributes?.options?.map((option: any) => (
                                                            <div key={option?.id} onClick={() => {
                                                                if (form?.[question?.id]?.includes(option?.option)) {
                                                                    // Remove the option from the form state
                                                                    setForm((prevForm: any) => {
                                                                        const updatedForm: any = { ...prevForm };
                                                                        const updatedOptions = updatedForm[question?.id].filter((item: string) => item !== option?.option);
                                                                        return { ...updatedForm, [question?.id]: updatedOptions };
                                                                    });
                                                                } else {
                                                                    // Add the option to the form state

                                                                    setForm((prevForm: any) => {
                                                                        const updatedForm: any = { ...prevForm };
                                                                        let updatedOptions = [option?.option]
                                                                        if (updatedForm[question?.id]) {
                                                                            updatedOptions = [...updatedForm[question?.id], option?.option];
                                                                        }
                                                                        return { ...updatedForm, [question?.id]: updatedOptions };
                                                                    });
                                                                }
                                                            }} className={`rounded-[35px] mx-2 my-2 px-2 min-w-[100px] cursor-pointer gap-[12px] h-[39px]   text-[13px] font-semibold leading-[16.38px] ${form?.[question?.id]?.includes(option?.option) ? "bg-[#357EF8] text-white" : "bg-white text-[#1B1B1B]"}  flex flex-col justify-center items-center`}>
                                                                {Array.isArray(option?.option) ? (option?.option as string[]).join(", ") : option?.option}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                    <h1 className='text-center my-5'>{Array.isArray(form?.[question?.id]) ? (form?.[question?.id] as string[]).join(", ") : form?.[question?.id]}</h1>
                                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(question?.id) }} className='relative'>
                                        <Input type={question?.attributes?.answer_type === "number" ? "number" : "text"} name={question?.id} value={form?.[question?.id]} onChange={(e: any) => {
                                            if (question?.attributes?.type === "input") {
                                                handleChange(e)
                                            }

                                        }} required className='rounded-l-[49px] text-black text-[16px] rounded-r-[49px] h-[48px]' placeholder={question?.attributes?.question} />
                                        <button type='submit'>
                                            {
                                                (load && current === question?.id) ? (
                                                    <TbLoader3 className="text-[#357EF8] w-7 h-7 animate-spin absolute right-2 top-3" />
                                                ) : (
                                                    <Image src={"/onboard/send.png"} alt='send icon' width={500} height={500} className='h-[48px] w-[48px] cursor-pointer absolute right-0 top-0' />
                                                )
                                            }
                                        </button>
                                    </form>
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    }



                </Accordion>
            </div>

            <TabBar page='menu' />

        </div >
    )
}

export default MyPreferences
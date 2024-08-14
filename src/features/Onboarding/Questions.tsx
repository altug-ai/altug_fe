"use client";
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Message from './components/Message'
import { onBoardKeys, onboardingQuestions } from './lib/onboardingQuestions';
import { OnboardingContext } from '@/context/Onboarding';
import { useRouter } from 'next/navigation';
import { Current, FormIndex } from './lib/types';
import KeywordInputs from './components/KeywordInputs';
import { TbLoader3 } from 'react-icons/tb';
import { signOut, useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'next/navigation'

type Props = {}

const Questions = (props: Props) => {
    const lastDivRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { form, setForm, setEnteredQuestions, length, loading, enteredQuestions, current, formIndex, handleChange, setIndex, index, updatePreferences, load } = useContext(OnboardingContext)
    const { data: session }: any = useSession();
    const { toast } = useToast();
    const searchParams = useSearchParams()
    const search = searchParams.get('callbackUrl')

    useEffect(() => {
        if (session?.error) {
            toast({
                variant: "destructive",
                description: session?.error,
            });
            signOut()
        }
    }, [session])


    // console.log("thnsis the curent", current)

    const nextQuestion = async () => {

        if (index + 1 >= length) {
            // setIndex(index + 1)
            // router.push("/profile")
            updatePreferences();

        } else {
            setEnteredQuestions([...enteredQuestions, { id: current?.id, system: current?.attributes?.question, user: form?.[formIndex] }])
            setIndex(index + 1)
        }
    }


    useEffect(() => {
        if (lastDivRef.current) {
            lastDivRef?.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [enteredQuestions, current]);


    return (
        <div className='py-[20px] px-[20px] h-full  flex flex-col items-center '>
            {/* the header to go back or skip onboarding  */}
            <div className='w-full max-w-[388px] flex justify-between items-center mb-[30px]'>
                <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px] cursor-pointer' />
                <h1 onClick={() => {
                    router.push("/profile")
                }
                } className='font-semibold text-[12px] cursor-pointer leading-[12.31px] tracking-[0.3%] text-[#357EF8]'>Skip Onboarding</h1>
            </div>

            <div className='flex flex-col space-y-2 mb-10 w-full max-w-[388px]'>
                <h1 className='font-bold text-[36px] leading-[45.36px] text-[#F5F7F8]'>Before we begin</h1>
                <h1 className='font-normal text-[20px] leading-[20px] tracking-[1px] text-[#F5F7F8]  '>Let&lsquo;s set your preferences</h1>
            </div>


            {
                loading && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }

            {/* the onboarding questions to get the user's data */}
            <div className='w-full max-w-[388px] text-white mb-[60px]'>
                {/* the answered questions */}
                {
                    enteredQuestions?.map((entered) => (
                        <div key={entered?.id} className='w-full max-w-[388px] text-white'>
                            <Message message={entered?.system} system />
                            <Message message={Array.isArray(entered?.user) ? (entered?.user as string[]).join(", ") : entered?.user} user />
                        </div>
                    ))
                }

                {
                    current && (
                        <div className='w-full'>
                            <Message message={current?.attributes?.question} system />
                            {/* if the type if options then it shows this  */}
                            {
                                current?.attributes?.type === "single-choice" && (
                                    <div className='w-full'>
                                        <div className='flex mb-[30px] w-full justify-center flex-wrap  items-center'>
                                            {
                                                current?.attributes?.options?.map((option: any) => (
                                                    <div key={option?.id} onClick={() => {
                                                        setForm({
                                                            ...form,
                                                            [formIndex]: option?.option
                                                        })
                                                    }} className={`rounded-[35px] mx-2 my-2 px-2 min-w-[100px] cursor-pointer gap-[12px] h-[39px]   text-[13px] font-semibold leading-[16.38px] ${form?.[formIndex] === option?.option ? "bg-[#357EF8] text-white" : "bg-white text-[#1B1B1B]"}  flex flex-col justify-center items-center`}>
                                                        {option?.option}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            }


                            {/* if the type is multiple options then it shows this  */}
                            {
                                current?.attributes?.type === "multiple-choice" && (
                                    <div className='w-full'>
                                        <div className='flex mb-[30px] w-full justify-center flex-wrap  items-center'>
                                            {
                                                current?.attributes?.options?.map((option: any) => (
                                                    <div key={option?.id} onClick={() => {
                                                        if (form[formIndex]?.includes(option?.option)) {
                                                            // Remove the option from the form state
                                                            setForm(prevForm => {
                                                                const updatedForm: any = { ...prevForm };
                                                                const updatedOptions = updatedForm[formIndex].filter((item: string) => item !== option?.option);
                                                                return { ...updatedForm, [formIndex]: updatedOptions };
                                                            });
                                                        } else {
                                                            // Add the option to the form state
                                                            setForm(prevForm => {
                                                                const updatedForm: any = { ...prevForm };
                                                                let updatedOptions = [option?.option]
                                                                if (updatedForm[formIndex]) {
                                                                    updatedOptions = [...updatedForm[formIndex], option?.option];
                                                                }

                                                                return { ...updatedForm, [formIndex]: updatedOptions };
                                                            });
                                                        }
                                                    }} className={`rounded-[35px] mx-2 my-2 px-2 min-w-[100px] cursor-pointer gap-[12px] h-[39px]   text-[13px] font-semibold leading-[16.38px] ${form?.[formIndex]?.includes(option?.option) ? "bg-[#357EF8] text-white" : "bg-white text-[#1B1B1B]"}  flex flex-col justify-center items-center`}>
                                                        {option?.option}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                    )
                }
                <div ref={lastDivRef} />
            </div>

            {/* the bottom fields */}

            <form onSubmit={(e) => { e.preventDefault(); nextQuestion(); }} className=' fixed bottom-5 w-full max-w-[388px] '>

                {/* if it is of type option it shows this */}
                {
                    current?.attributes?.type === "single-choice" && (
                        <div className='w-full'>
                            <div className='relative'>
                                <Input required value={form?.[formIndex] ?? ""} className='rounded-l-[49px] text-[16px] rounded-r-[49px] h-[48px]' placeholder='Chosen option will show here.' />
                                <button type='submit'>
                                    {
                                        load ? (
                                            <TbLoader3 className="text-[#357EF8] w-7 h-7 animate-spin absolute right-2 top-3" />
                                        ) : (
                                            <Image src={"/onboard/send.png"} alt='send icon' width={500} height={500} className='h-[48px] w-[48px] cursor-pointer absolute right-0 top-0' />
                                        )}
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* if it is of multiple inputs, show this */}
                {/* {
                    current?.attributes?.type === "multiple-inputs" && (
                        <div className='relative'>
                            <Input name={`${current?.id}`} value={form?.[formIndex] ?? ""} onChange={(e) => {
                                handleChange(e)
                            }}
                                // type={current?.inputType} 
                                className='rounded-l-[49px] text-[16px]  rounded-r-[49px] h-[48px]' placeholder='Enter your favorite players' />
                            <button type='submit'>
                                {
                                    load ? (
                                        <TbLoader3 className="text-[#357EF8] w-7 h-7 animate-spin absolute right-2 top-3" />
                                    ) : (
                                        <Image src={"/onboard/send.png"} alt='send icon' width={500} height={500} className='h-[48px] w-[48px] cursor-pointer absolute right-0 top-0' />
                                    )}
                            </button>
                        </div>
                    )
                } */}

                {/* if it is of multiple option it shows this */}
                {
                    current?.attributes?.type === "multiple-choice" && (
                        <div className='w-full'>
                            <div className='relative'>
                                <Input required value={form?.[formIndex] ?? ""} className='rounded-l-[49px] text-[16px] rounded-r-[49px] h-[48px]' placeholder='Chosen options will show here.' />
                                <button type='submit'>
                                    {
                                        load ? (
                                            <TbLoader3 className="text-[#357EF8] w-7 h-7 animate-spin absolute right-2 top-3" />
                                        ) : (
                                            <Image src={"/onboard/send.png"} alt='send icon' width={500} height={500} className='h-[48px] w-[48px] cursor-pointer absolute right-0 top-0' />
                                        )
                                    }
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* if it is of type input, it shows this */}
                {
                    current?.attributes?.type === "input" && (
                        <div className='relative'>
                            <Input required type={current?.attributes?.answer_type === "number" ? "number" : "text"} name={`${current?.id}`} value={form?.[formIndex] ?? ""} onChange={handleChange}
                                //  type={current?.inputType} 
                                className='rounded-l-[49px] text-[16px] rounded-r-[49px] h-[48px]' placeholder={current?.attributes?.question} />
                            <button type='submit'>
                                {
                                    load ? (
                                        <TbLoader3 className="text-[#357EF8] w-7 h-7 animate-spin absolute right-2 top-3" />
                                    ) : (
                                        <Image src={"/onboard/send.png"} alt='send icon' width={500} height={500} className='h-[48px] w-[48px] cursor-pointer absolute right-0 top-0' />
                                    )
                                }
                            </button>
                        </div>
                    )
                }


            </form>
        </div>
    )
}

export default Questions
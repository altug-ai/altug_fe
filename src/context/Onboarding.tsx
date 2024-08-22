"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { OnboardingProps } from "./types";
import { Current, FormIndex } from "@/features/Onboarding/lib/types";
import { onBoardKeys, onboardingQuestions } from "@/features/Onboarding/lib/onboardingQuestions";
import { AuthContext } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useSearchParams } from 'next/navigation'
import { useGetOnboardingQuestions } from "@/hooks/useGetOnboardingQuestions";

// @ts-ignore
export const OnboardingContext = createContext<OnboardingProps>({});

function OnboardingContextProvider(props: any) {
    const router = useRouter();
    const { toast } = useToast();
    const { data, loading } = useGetOnboardingQuestions()
    const [form, setForm] = useState<any>()
    const [current, setCurrent] = useState<Current>()
    const [index, setIndex] = useState<number>(0)
    const [enteredQuestions, setEnteredQuestions] = useState<any[]>([])
    const [formIndex, setFormIndex] = useState<FormIndex>("age")
    const { jwt, pref, profileId, setReload, reload, setPref } = useContext(AuthContext)
    const [length, setLength] = useState<number>(0)
    const [load, setLoad] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const search = searchParams.get('callbackUrl')


    useEffect(() => {
        if (data?.length > 0) {
            setLength(data?.length)
            setCurrent(data[index])
            setFormIndex(data[index]?.id)

        }
    }, [data, index])

    // console.log("this is the form", form)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        let text = e.target.value
        // if (current?.key === "age") {
        //     text = e.target.value.trim()
        //     if (parseInt(text) > 100 || parseInt(text) < 1) {
        //         return
        //     }
        // }
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
            }



        } catch (error) {
            console.log("his is the error", error)
        }
    }

 

    // console.log("this is the form", form)

    const updatePreferences = async () => {

        setLoad(true)

        const promises = Object.entries(form).map(([id, answer]) => {
            // @ts-ignore
            return addOnboardinganswer(parseInt(id), answer);
        });

        try {

            await Promise.all(promises);


            if (setReload && reload) {
                setReload(!reload)
            }
            router.push(search ?? "/profile")
            setLoad(false)
            toast({
                description: "Preferences Updated Successfully"
            });


        } catch (error) {
            setLoad(false);
            toast({
                variant: "destructive",
                description:
                    "Something went wrong.",
            });

        }
    }


    return (
        <OnboardingContext.Provider
            value={{
                form, setForm, load, loading, length, handleChange, current, setCurrent, formIndex, updatePreferences, setFormIndex, enteredQuestions, setEnteredQuestions, index, setIndex,
            }}
        >
            {props.children}
        </OnboardingContext.Provider>
    );
}

export { OnboardingContextProvider };

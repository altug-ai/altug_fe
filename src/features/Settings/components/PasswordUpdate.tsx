"use client";
import { PureInput } from '@/components/ui/input'
import React, { useContext, useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast";
import { TbLoader3 } from "react-icons/tb";
import axios from 'axios'
import { AuthContext } from '@/context/AuthContext';
import { useTranslations } from "next-intl";

type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>
}



const PasswordUpdate = ({ setRoute }: Props) => {
    const [loader, setLoader] = useState<boolean>(false)
    const { jwt } = useContext(AuthContext)
    const { toast } = useToast();
    const t = useTranslations('Home.Password');

    const FormSchema = z.object({
        currentPassword: z.string().min(4, t("Least")),
        password: z.string().min(4, t("Contain")),
        passwordConfirmation: z.string().min(4, t("Must")),
    }).superRefine(({ passwordConfirmation, password }, ctx) => {
        if (passwordConfirmation !== password) {
            ctx.addIssue({
                code: "custom",
                message: t("Match"),
                path: ['passwordConfirmation']
            });
        }
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            currentPassword: "",
            password: "",
            passwordConfirmation: "",
        },
    })


    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoader(true)
        try {
            let response = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/change-password`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            if (response?.data?.jwt) {
                setLoader(false)
                toast({
                    description: t("Success")
                });
            }

        } catch (error: any) {
            setLoader(false);

            if (error?.response?.data?.error?.message) {
                toast({
                    variant: "destructive",
                    description: error?.response?.data?.error?.message,
                });
            }

        }
    }

    return (
        <div className='w-full h-full flex flex-col items-center'>

            <div className='w-full max-w-[388px] '>
                <h1 className='font-semibold text-[32px] leading-[14.02px] text-[#FFFFFF]'>{t("Update")}</h1>
            </div>


            {/* the form to change the password */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
                    <div className='flex flex-col space-y-8 w-full max-w-[388px] my-[40px]'>

                        {/* the current/old password */}
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Email</FormLabel> */}
                                    <FormControl>
                                        <div className='relative'>
                                            <PureInput {...field} type="password" className='bg-black h-[48px]  placeholder:text-slate-400 text-[16px] leading-[24px] text-[#F5F7F8]' />
                                            <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("Old")}</div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* the new password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Email</FormLabel> */}
                                    <FormControl>
                                        <div className='relative'>
                                            <PureInput {...field} type="password" className='bg-black h-[48px]  placeholder:text-slate-400 text-[16px] leading-[24px] text-[#F5F7F8]' />
                                            <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("New")}</div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* confirm new password */}
                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Email</FormLabel> */}
                                    <FormControl>
                                        <div className='relative'>
                                            <PureInput {...field} type="password" className='bg-black h-[48px]  placeholder:text-slate-400 text-[16px] leading-[24px] text-[#F5F7F8]' />
                                            <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("Confirm")}</div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>


                    <div className='w-full max-w-[388px] mb-[30px]'>
                        <button type='submit' className='rounded-[35px] cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[16px] font-semibold leading-[24px] text-[#F5F7F8] flex flex-col justify-center items-center'>
                            {
                                loader ? (
                                    <TbLoader3 className="text-white w-7 h-7 animate-spin" />
                                ) :
                                    t("Updat")
                            }
                        </button>
                    </div>
                </form>
            </Form>

            <div className='w-full max-w-[388px] mb-[30px]'>
                <div onClick={() => { setRoute(0) }} className='rounded-[35px] cursor-pointer mt-3 w-full gap-[12px] border border-[#F5F7F8] h-[48px]   text-[16px] font-semibold leading-[24px] text-[#F5F7F8] flex flex-col justify-center items-center'>
                    {t("Back")}
                </div>
            </div>

        </div>
    )
}

export default PasswordUpdate
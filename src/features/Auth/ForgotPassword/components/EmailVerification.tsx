"use client";
import { PureInput } from '@/components/ui/input'
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { TbLoader3 } from 'react-icons/tb';
import { IoIosCheckmarkCircle } from "react-icons/io";
import axios from 'axios';
import { useTranslations } from "next-intl";

type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
}



const EmailVerification = ({ setRoute, setEmail }: Props) => {
    const router = useRouter()
    const { toast } = useToast();
    const [loader, setLoader] = useState<boolean>(false)
    const t = useTranslations('Home.Password');

    const FormSchema = z.object({
        email: z.string().email({ message: t("Invalid") }),
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
    })


    // send the verification code
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoader(true);
        try {
            const res = axios
                .post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/send-code`, {
                    email: data.email, // user's email
                })
                .then((response: any) => {
                    setLoader(false);
                    setEmail(data.email)
                    setRoute(1)
                    // toast({
                    //     description: 'User received the email',
                    //     action: <IoIosCheckmarkCircle className='text-blue' />,
                    // });
                })
                .catch((error) => {
                    setLoader(false);
                    toast({
                        variant: 'destructive',
                        description: t("OtpCould"),
                    });
                });
        } catch (error) {
            setLoader(false);
            toast({
                variant: 'destructive',
                description: t("OtpCould"),
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='py-[20px] px-[20px] h-full flex flex-col items-center '>
                <div className='w-full max-w-[388px]'>
                    <Image onClick={() => {
                        router.push("/sign-in")
                    }} src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px] mb-[30px] cursor-pointer' />
                </div>

                <div className='w-full max-w-[388px] mt-[20px] mb-[50px] flex flex-col space-y-9'>
                    <div className='flex flex-col space-y-2'>
                        <h1 className='font-medium text-[24px] leading-[32.47px] text-[#FFFFFF]'>{t("Forgot")}</h1>
                        <h1 className='text-[#FFFFFF] font-normal tracking-[1px] leading-[20px] text-[16px] '>{t("EnterEmail")}</h1>
                    </div>

                </div>

                <div className='flex flex-col space-y-8 w-full max-w-[388px]'>


                    {/* the email   */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                {/* <FormLabel>Email</FormLabel> */}
                                <FormControl>
                                    <div className='relative'>
                                        <PureInput {...field} type="email" className='bg-black h-[48px]  placeholder:text-slate-400 text-[16px] leading-[24px] text-[#F5F7F8]' />
                                        <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("Email")}</div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>


                {/* send verification code  */}
                <div className='w-full max-w-[388px] mt-[161px]'>
                    <button type='submit' className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                        {
                            loader ? (
                                <TbLoader3 className="text-white w-7 h-7 animate-spin" />
                            ) : (
                                t("Verification")
                            )
                        }
                    </button>
                </div>
            </form>
        </Form>
    )
}

export default EmailVerification
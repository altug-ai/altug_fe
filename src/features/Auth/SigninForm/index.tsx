"use client";
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { z } from "zod"
import { PureInput } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TbLoader3 } from "react-icons/tb";
import { useRouter } from 'next/navigation';
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { fetcher } from '@/lib/functions';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslations } from "next-intl";
import { useSearchParams } from 'next/navigation'
// import { usePathname } from 'next/navigation';

type Props = {}




const SigninForm = (props: Props) => {
    const router = useRouter();
    const [loader, setLoader] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const { data: session }: any = useSession();
    const { toast } = useToast();
    const t = useTranslations('Home.Login');
    const searchParams = useSearchParams()
    const FormSchema = z.object({
        email: z.string().email({ message: t("Invalid") }),
        password: z.string().min(4, t("Pass")),
    })
    const search = searchParams.get('callbackUrl')


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })


    useEffect(() => {
        if (session?.error) {
            toast({
                variant: "destructive",
                description: session?.error,
            });
            signOut()
        }
    }, [session])


    useEffect(() => {
        // Disable the ability to move back to the previous screen
        window.history.pushState(null, "", window.location.href);

        // Listen for the browser's back button click
        window.onpopstate = function () {
            // Navigate to the sign-in page
            router.push("/sign-in"); // Replace with the actual route of your sign-in page
        };

        // Clean up the event listelet callbackUrl: string;ner when the component unmounts
        return () => {
            window.onpopstate = null;
        };
    }, [router]);


    const onSubmit = async (data: z.infer<typeof FormSchema>) => {

        setLoader(true);
        try {
            // /logIn
            const responseData = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        identifier: data.email,
                        password: data.password,
                    }),
                }
            );

            if (responseData?.error?.message) {
                toast({
                    variant: "destructive",
                    description: t("Valid"),
                });
                setLoader(false);
            } else {
                toast({
                    description: "Logging you in, please hold on.",
                    action: <TbLoader3 className="text-[#357EF8] w-7 h-7 animate-spin" />,
                });

                let url = "/profile"

                if (search && search.startsWith("/challenge")) {
                    url = search;
                }

                const res = await signIn("credentials", {
                    redirect: false,
                    email: data.email,
                    password: data.password,
                    callbackUrl: url,
                });

                if (!res?.error) {
                    router.push(url);
                } else {
                    toast({
                        variant: "destructive",
                        description: t("Bad"),
                    });
                    setLoader(false);
                }
            }
        } catch (error) {
            setLoader(false);
            toast({
                variant: "destructive",
                description: t("Something"),
            });
        }

    }



    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>
            <div className='w-full max-w-[388px]'>
                <Image onClick={() => {
                    router.push("/")
                }} src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px] mb-[30px] cursor-pointer' />
            </div>


            <div className='flex flex-col space-y   -2 mb-10 w-full max-w-[388px]'>
                <h1 className='font-bold text-[36px] leading-[45.36px] text-[#F5F7F8]'>{t("Title")}</h1>
                <h1 className='font-normal text-[20px] leading-[20px] tracking-[1px] text-[#F5F7F8]  '>{t("SubTitle")}</h1>
            </div>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
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

                        {/* Enter the password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Password</FormLabel> */}
                                    <FormControl>
                                        <div className='relative'>
                                            <PureInput {...field} type="password" className='bg-black h-[48px]  placeholder:text-slate-400 text-[16px] leading-[24px] text-[#F5F7F8]' />
                                            <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("Password")}</div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='flex justify-between items-center my-[50px] w-full max-w-[388px]'>

                        <div className="flex items-center space-x-2">
                            <Checkbox className='bg-white w-[24px] h-[24px]' id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-[16px] leading-[24px] tracking-[0.15px] font-medium text-white"
                            >
                                {t("Remember")}
                            </label>
                        </div>

                        <h1 onClick={() => { router.push("/forgot-password") }} className='text-[16px] font-semibold leading-[24px] tracking-[0.15px] text-[#357EF8] cursor-pointer'>{t("Forgot")}</h1>
                    </div>


                    {/* the error message */}
                    {/* <h1 className="text-red-500 text-[14px] font-medium mt-[50px]">{error}</h1> */}
                    {/* login */}
                    <div className=' w-full flex justify-center'>
                        <button type="submit" className='py-[12px] z-10  w-full max-w-[388px]  cursor-pointer  bg-[#357EF8] flex justify-center rounded-[24px] gap-[12px]'>
                            <div className='flex space-x-2 items-center'>
                                {
                                    loader ? (
                                        <TbLoader3 className="text-white w-7 h-7 animate-spin" />
                                    ) : (
                                        <h1 className='text-[#F5F7F8] text-[16px] leading-[24px] '>{t("Login")}</h1>
                                    )
                                }
                            </div>
                        </button>
                    </div>

                </form>
            </Form>


            {/* the divider */}
            <div className='w-full max-w-[388px] my-[50px] flex space-x-3 items-center'>
                <div className='w-[50%] h-[1px] bg-[#F5F7F8]' />
                <h1 className='font-medium text-[12px] leading-[18px] tracking-[0.15px] text-[#F5F7F8] whitespace-nowrap'>{t("Continue")}</h1>
                <div className='w-[50%] h-[1px] bg-[#F5F7F8]' />
            </div>


            {/* continue with google */}
            <div className=' w-full flex justify-center '>
                <div onClick={async () => {
                    let callbackUrl = "/profile"
                    if (search && search.startsWith("/challenge")) {
                        callbackUrl = search
                    }
                    const ress = await signIn("google", {
                        redirect: false,
                        callbackUrl: callbackUrl,
                    });

                    // console.log("the ress", ress)
                }}
                    className='py-[12px] z-10  w-full max-w-[388px]  cursor-pointer  bg-white flex justify-center rounded-[24px] gap-[12px]'>
                    <div className='flex space-x-2 items-center'>
                        <Image src={"/onboard/Google.png"} width={300} height={300} alt='Google icon' className='h-[20px] w-[20px]' />
                        <h1 className='text-[#1A1A1A] text-[16px] leading-[24px] '>{t("Google")}</h1>
                    </div>
                </div>
            </div>


            {/* don't have an accounty */}
            <div className='flex justify-center mt-[60px]'>
                <h1 className='font-semibold text-[16px] leading-[24px] tracking-[0.15px] text-[#F5F7F8]'>{t("Account")} <span onClick={() => {
                    if (search && search.startsWith("/challenge")) {
                        router.push(`/sign-up?callbackUrl=${search}`)
                    } else {
                        router.push("/sign-up")
                    }

                }} className='text-[#357EF8] cursor-pointer'>{t("Signup")}</span> </h1>
            </div>

        </div>
    )
}

export default SigninForm
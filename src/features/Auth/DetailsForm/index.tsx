"use client"
import { useRouter } from "next/navigation"
import { PureInput } from '@/components/ui/input'
import { z } from "zod"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
import type {
    TCountryCode,
} from 'countries-list'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TbLoader3 } from "react-icons/tb";
import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/functions"
import axios from "axios"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { countries } from 'countries-list'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/bootstrap.css";
import VerifyEmail from "../VerifyEmail"
import { useTranslations } from "next-intl";
import { useSearchParams } from 'next/navigation'
import { useGetRoles } from "@/hooks/useGetRoles"

type Props = {}

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);


const DetailsForm = (props: Props) => {
    const router = useRouter()
    const [loader, setLoader] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const { data: session }: any = useSession();
    const { toast } = useToast();
    const [route, setRoute] = useState<number>(0)
    const [email, setEmail] = useState<string>("")
    const [value, setValue] = useState()
    const t = useTranslations('Home.Signup');
    const searchParams = useSearchParams()
    const { data: roles, loading } = useGetRoles()
    const FormSchema = z.object({
        email: z.string().email({ message: t("Invalid") }),
        phone: z.string().regex(phoneRegex, t("InvalidPhone")).min(7, t("Min7")).max(15, t("Max15")),
        country: z.string().min(1, t("Country")),
        role: z.string().min(1, t("Role")),
        password: z.string().min(4, t("Pass")),
        confirmPassword: z.string().min(4, t("Con")),
    }).superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: t("Match"),
                path: ['confirmPassword']
            });
        }
    });
    const search = searchParams.get('callbackUrl')

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            phone: "",
            password: "",
            country: "",
            role: ""
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


    const handleSubmit = async () => {
        setLoader(true);

        let data = form.getValues();
        let role: any = await roles?.find((role: any) => role?.attributes?.role === form.getValues().role)
        // create the user in strapi
        try {
            const responseData = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                        username: data.email.split("@")[0],
                        phone: data.phone
                    }),
                    method: "POST",
                }
            );

            // if email exists show this
            if (responseData.error) {
                const message = responseData?.error?.message
                    ? responseData?.error?.message.replace(
                        t("Em"),
                        t("Emi")
                    )
                    : t("Sum");
                toast({
                    variant: "destructive",
                    description:
                        message,
                });
                setLoader(false);
                setRoute(0);
                return;
            } else {

                const profile = await axios.post(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles`,
                    {
                        data: {
                            user: responseData.user.id,
                            username: data.email.split("@")[0],
                            country: data.country,
                            user_role: role?.id
                        },
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${responseData.jwt}`,
                        },
                    }
                );


                // message of a successful account creation
                toast({
                    description: t("Acc"),
                    action: <TbLoader3 className="text-[#357EF8] w-7 h-7 animate-spin" />,
                });
                let callbackUrl = "/onboarding"
                if (search) {
                    callbackUrl = `/onboarding?callbackUrl=${search}`
                }
                // sign into the app after creating the user
                const ress = await signIn("credentials", {
                    redirect: false,
                    email: data.email,
                    password: data.password,
                    callbackUrl: callbackUrl,
                });

                if (!ress?.error) {
                    router.push(callbackUrl);
                }
            }
        } catch (error) {
            setLoader(false);
            toast({
                variant: "destructive",
                description:
                    "Something went wrong.",
            });
            setRoute(0)

        }
    }



    // send the verification code
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoader(true);
        try {
            const res = axios
                .post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/send-email`, {
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

                });
        } catch (error) {
            setLoader(false);
            toast({
                variant: 'destructive',
                description: t("Could"),
            });
        }
    }


    // console.log("these are the roles", roles)

    return (
        <div>

            {
                route === 0 && (

                    <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>

                        <div onClick={() => {
                            let callbackUrl = "/sign-in"
                            if (search) {
                                callbackUrl = `/sign-in?callbackUrl=${search}`
                            }
                            router.push(callbackUrl);
                        }} className='w-full max-w-[388px]'>
                            <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px] mb-[30px] cursor-pointer' />
                        </div>

                        <div className='flex flex-col space-y-2 mb-10 w-full max-w-[388px]'>
                            <h1 className='font-bold text-[36px] leading-[45.36px] text-[#F5F7F8]'>{t("Title")}</h1>
                            <h1 className='font-normal text-[20px] leading-[20px] tracking-[1px] text-[#F5F7F8]  '>{t("SubTitle")}</h1>
                        </div>

                        {/* the form to submit the data in  */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
                                <div className='flex flex-col w-full space-y-8 max-w-[388px]'>
                                    {/* the email   */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* <FormLabel>Email</FormLabel> */}
                                                <FormControl>
                                                    <div className='relative'>
                                                        <PureInput type="email" className='bg-black h-[48px]  placeholder:text-slate-400 text-[16px] leading-[24px] text-[#F5F7F8]' {...field} />
                                                        <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("Email")}</div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* the phone number */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className='relative'>
                                                        <PhoneInput
                                                            {...field}
                                                            containerClass="input-class-container-now"
                                                            inputClass="input-class-container-now"
                                                            inputStyle={{ width: "100%", backgroundColor: "black", color: "white" }}
                                                            country={'us'}
                                                        />
                                                        <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("Phone")}</div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* the country */}
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full h-[48px] bg-black border text-white px-2">
                                                            <SelectValue placeholder={t("Country")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>{t("Country")}</SelectLabel>
                                                                {
                                                                    Object.keys(countries).map((countryCode: any) => (
                                                                        // @ts-ignore
                                                                        <SelectItem key={countries[countryCode].name} value={countries[countryCode].name}>{countries[countryCode].name}</SelectItem>
                                                                    ))
                                                                }

                                                            </SelectGroup>

                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* the role */}
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full h-[48px] bg-black border text-white px-2">
                                                            <SelectValue className="capitalize" placeholder={t("RoleS")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>{t("RoleS")}</SelectLabel>
                                                                {
                                                                    roles?.map((role: any) => (
                                                                        <SelectItem key={role?.id} value={role?.attributes?.role}> {role?.attributes?.role} </SelectItem>
                                                                    ))
                                                                }
                                                            </SelectGroup>

                                                        </SelectContent>
                                                    </Select>
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
                                                        <PureInput type="password" className='bg-black h-[48px]  placeholder:text-slate-400 text-[16px] leading-[24px] text-[#F5F7F8]' {...field} />
                                                        <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("Password")}</div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* confirm the password */}
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* <FormLabel>Password</FormLabel> */}
                                                <FormControl>
                                                    <div className='relative'>
                                                        <PureInput type="password" className='bg-black h-[48px]  placeholder:text-slate-400 text-[16px] leading-[24px] text-[#F5F7F8]' {...field} />
                                                        <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("Confirm")}</div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* the error message */}
                                <h1 className="text-red-500 text-[14px] font-medium mt-[50px]">{error}</h1>
                                {/* signup */}
                                <div className=' w-full flex justify-center mt-[5px]'>
                                    <button type="submit" className='py-[12px] z-10  w-full max-w-[388px]  cursor-pointer  bg-[#357EF8] flex justify-center rounded-[24px] gap-[12px]'>
                                        <div className='flex space-x-2 items-center'>
                                            {
                                                loader ? (
                                                    <TbLoader3 className="text-white w-7 h-7 animate-spin" />
                                                ) : (
                                                    <h1 className='text-[#F5F7F8] text-[16px] leading-[24px] '>{t("Signup")}</h1>
                                                )
                                            }

                                        </div>
                                    </button>
                                </div>


                            </form>
                        </Form>

                        {/* the divider */}
                        <div className='w-full max-w-[388px] my-[30px] flex space-x-3 items-center'>
                            <div className='w-[50%] h-[1px] bg-[#F5F7F8]' />
                            <h1 className='font-medium text-[12px] leading-[18px] tracking-[0.15px] text-[#F5F7F8] whitespace-nowrap'>{t("Continue")}</h1>
                            <div className='w-[50%] h-[1px] bg-[#F5F7F8]' />
                        </div>

                        {/* continue with google */}
                        <div className=' w-full flex justify-center '>
                            <div onClick={async () => {
                                let callbackUrl = "/onboarding"
                                if (search) {
                                    callbackUrl = `/onboarding?callbackUrl=${search}`
                                }
                                const ress = await signIn("google", {
                                    redirect: false,
                                    callbackUrl: callbackUrl,
                                });
                            }} className='py-[12px] z-10  w-full max-w-[388px]  cursor-pointer  bg-white flex justify-center rounded-[24px] gap-[12px]'>
                                <div className='flex space-x-2 items-center'>
                                    <Image src={"/onboard/Google.png"} width={300} height={300} alt='Google icon' className='h-[20px] w-[20px]' />
                                    <h1 className='text-[#1A1A1A] text-[16px] leading-[24px] '>{t("Google")}</h1>
                                </div>
                            </div>
                        </div>

                        {/* don't have an account */}
                        <div className='flex justify-center mt-[40px]'>
                            <h1 className='font-semibold text-[16px] leading-[24px] tracking-[0.15px] text-[#F5F7F8]'>{t("Account")} <span onClick={() => { router.push("/sign-in") }} className='text-[#357EF8] cursor-pointer'>{t("SignIn")}</span> </h1>
                        </div>

                    </div>

                )}


            {
                route === 1 && (
                    <VerifyEmail loader={loader} email={email} handleSubmit={handleSubmit} />
                )
            }
        </div>
    )
}

export default DetailsForm
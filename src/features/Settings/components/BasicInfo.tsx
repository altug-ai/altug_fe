import { PureInput } from '@/components/ui/input'
import { AuthContext } from '@/context/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
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
import { useTranslations } from "next-intl";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/bootstrap.css";
import { countries } from 'countries-list'

type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>
}


const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);



const BasicInfo = ({ setRoute }: Props) => {
    const { jwt, loading, profile, user, userId, profileId, setUser, setProfile, reload, setReload } = useContext(AuthContext)
    const [loader, setLoader] = useState<boolean>(false)
    const { toast } = useToast();
    const t = useTranslations('Home.Settings');

    const FormSchema = z.object({
        email: z.string().email({ message: t("Invalid") }),
        phone: z.string().regex(phoneRegex, t("InvalidPhone")).min(7, t("Min7")).max(15, "Maximum of 15 digits"),
        country: z.string().min(1, t("SelectPlease")),
        username: z.string().min(2, t("MinU")),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            phone: "",
            username: "",
            country: ""
        },
    })



    useEffect(() => {
        if (profile && user) {
            form.setValue("username", profile?.attributes?.username ?? "")
            form.setValue("email", user?.data?.attributes?.email ?? "")
            form.setValue("phone", user?.data?.attributes?.phone ?? "")
            form.setValue("country", profile?.attributes?.country ?? "")
        }

    }, [profile, user])


    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoader(true);

        try {

            // update the client profile content type
            if ((data?.username !== profile?.attributes?.username) || (data?.country !== profile?.attributes?.country)) {
                let response = await axios.put(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles/${profileId}`,
                    {
                        data: {
                            username: data?.username,
                            country: data?.country

                        },
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );

                if (response?.data?.data?.id) {
                    if (setProfile) {

                        setLoader(false)
                        toast({
                            description: t("ProfileSuccess"),
                        });
                    }
                }
            }


            // update the user content type
            if ((data?.email !== user?.data?.attributes?.email) || (data?.phone !== user?.data?.attributes?.phone)) {
                let response = await axios.put(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${userId}`,
                    {
                        email: data?.email,
                        phone: data?.phone
                    },

                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );


                if (response?.data?.id) {
                    if (setUser) {
                        setLoader(false)
                        toast({
                            description: t("Success"),
                        });
                    }
                }
            }

            if (setReload) {
                setReload(!reload);
            }

        } catch (error) {
            setLoader(false);
            if (setReload) {
                setReload(!reload);
            }
            toast({
                variant: "destructive",
                description: t("Went"),
            });
        }
    }


    return (
        <div className='w-full h-full flex flex-col items-center'>

            <div className='w-full max-w-[388px] '>
                <h1 className='font-semibold text-[32px] leading-[14.02px] text-[#FFFFFF]'>{t("Info")}</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
                    <div className='flex flex-col space-y-8 w-full max-w-[388px] my-[40px]'>

                        {/* the username */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Email</FormLabel> */}
                                    <FormControl>
                                        <div className='relative'>
                                            <PureInput {...field} type="text" placeholder={t("UsernamePlaceholder")} className='bg-black h-[48px]  placeholder:text-slate-400 text-[16px] leading-[24px] text-[#F5F7F8]' />
                                            <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("Username")}</div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* the email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Email</FormLabel> */}
                                    <FormControl>
                                        <div className='relative'>
                                            <PureInput {...field} type="email" placeholder={t("EmailPlaceholder")} className='bg-black h-[48px] border border-[#696969]  placeholder:text-[#696969] text-[16px] leading-[24px] text-[#F5F7F8]' />
                                            <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#696969]'>{t("Email")}</div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full h-[48px] bg-black border text-white px-2">
                                                <SelectValue placeholder={field.value === "" ? t("SelectCountry") : field.value} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>{t("Countries")}</SelectLabel>
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


                        {/* the phone */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Email</FormLabel> */}
                                    <FormControl>
                                        <div className='relative'>
                                            <PhoneInput
                                                {...field}
                                                containerClass="input-class-container-now"
                                                inputClass="input-class-container-now"
                                                inputStyle={{ width: "100%", backgroundColor: "black", color: "white" }}
                                                country={'us'}
                                            />
                                            <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("PhoneNumber")}</div>
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
                                    t("Updatee")
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

export default BasicInfo
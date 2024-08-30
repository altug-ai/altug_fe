"use client"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { PureInput } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AuthContext } from "@/context/AuthContext"
import { useGetRoles } from "@/hooks/useGetRoles"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { countries } from 'countries-list'
import { signOut, useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { TbLoader3 } from "react-icons/tb"
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/bootstrap.css"
import { z } from "zod"

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
    const { profileEmail, profileId, jwt, reload, setReload, roleId, loading: load } = useContext(AuthContext)
    const t = useTranslations('Home.Signup');
    const searchParams = useSearchParams()
    const { data: roles, loading } = useGetRoles()
    const FormSchema = z.object({
        phone: z.string().regex(phoneRegex, t("InvalidPhone")).min(7, t("Min7")).max(15, t("Max15")),
        country: z.string().min(1, t("Country")),
        role: z.string().min(1, t("Role")),
    })
    const search = searchParams.get('callbackUrl')

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            phone: "",
            country: "",
            role: ""
        },
    })




    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoader(true);
        let role: any = await roles?.find((role: any) => role?.attributes?.role === form.getValues().role)
        // create the user in strapi
        try {
            const profile = await axios.put(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles/${profileId}`,
                {
                    data: {
                        country: data.country,
                        user_role: role?.id
                    },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );


            if (profile?.data?.data?.id) {
                // setReload(!reload)
                let callbackUrl = "/onboarding"
                if (search) {
                    callbackUrl = `/onboarding?callbackUrl=${search}`
                }
                window.location.href = callbackUrl; // This will force a full reload
                toast({
                    description: t("Acc"),
                    action: <TbLoader3 className="text-[#357EF8] w-7 h-7 animate-spin" />,
                });
            }



        }
        catch (error) {
            setLoader(false);
            toast({
                variant: "destructive",
                description:
                    "Something went wrong.",
            });
            setRoute(0)

        }
    }


    useEffect(() => {
        if (roleId) {
            let callbackUrl = "/onboarding"
            if (search) {
                callbackUrl = `/onboarding?callbackUrl=${search}`
            }
            router.push(callbackUrl)
        }
    }, [roleId])



    return (
        <div >

            {
                (route === 0 && !roleId && !load && profileId) ? (

                    <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>

                        <div className='flex flex-col space-y-2 mb-10 w-full max-w-[388px]'>
                            <h1 className='font-bold text-[36px] leading-[45.36px] text-[#F5F7F8]'>{t("Title")}</h1>
                            <h1 className='font-normal text-[20px] leading-[20px] tracking-[1px] text-[#F5F7F8]  '>{t("SubTitle")}</h1>
                        </div>

                        {/* the form to submit the data in  */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
                                <div className='flex flex-col w-full space-y-8 max-w-[388px]'>
                                    {/* the email   */}

                                    <div className='relative'>
                                        <PureInput value={profileEmail} disabled type="email" className='bg-black h-[48px]  placeholder:text-slate-400 text-[16px] leading-[24px] text-[#F5F7F8]' />
                                        <div className='bg-black px-1 text-[12px] leading-[16px] font-normal absolute -top-[7px] left-[10px] text-[#F5F7F8]'>{t("Email")}</div>
                                    </div>

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



                    </div>

                ) : (jwt && !load) && (
                    <div className=" flex flex-col items-center w-full h-screen justify-end" style={{ backgroundImage: 'url("/auth/bg.png")' }}>
                        <div className='w-full max-w-[388px] mb-[60px] '>
                            <div onClick={async () => {
                                await signOut()
                            }} className='rounded-[35px] cursor-pointer mt-3 w-1/2 gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                                LogOut
                            </div>
                        </div>
                    </div>
                )}



        </div>
    )
}

export default DetailsForm
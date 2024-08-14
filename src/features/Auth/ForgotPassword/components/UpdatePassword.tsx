import { PureInput } from '@/components/ui/input'
import Image from 'next/image'
import React, { useState } from 'react'
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
import { FaShieldCat } from 'react-icons/fa6'
import { TbLoader3 } from 'react-icons/tb'
import { fetcher } from '@/lib/functions'
import { useTranslations } from "next-intl";

type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>;
    code: string;
    email: string;



}





const UpdatePassword = ({ setRoute, email, code }: Props) => {
    const [loader, setLoader] = useState<boolean>(false)
    const { toast } = useToast();
    const t = useTranslations('Home.Password');

    const FormSchema = z.object({
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
            password: "",
            passwordConfirmation: "",
        },
    })


    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoader(true);

        try {
            const responseData = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/reset-password`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        code: code,
                        newPassword: data.password,
                    }),
                    method: 'POST',
                }
            );

            if (responseData.status) {
                setRoute(3)
                setLoader(false);
            }
            if (responseData?.error?.status == 400) {
                toast({
                    variant: 'destructive',
                    description: responseData?.error?.message,
                });
                setLoader(false);
            }
        } catch (error) {
            setLoader(false);
            toast({
                variant: 'destructive',
                description: t("NotPass"),
            });
        }

    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='py-[20px] px-[20px] h-full flex flex-col items-center '>
                <div className='w-full max-w-[388px]'>
                    <Image onClick={() => {
                        setRoute(1)
                    }} src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px] mb-[30px] cursor-pointer' />
                </div>


                <div className='flex flex-col space-y-2 mb-10 w-full max-w-[388px]'>
                    <h1 className='font-bold text-[36px] leading-[45.36px] text-[#F5F7F8]'>{t("Update")}</h1>
                    <h1 className='font-normal text-[20px] leading-[20px] tracking-[1px] text-[#F5F7F8]  '>{t("New")}</h1>
                </div>

                <div className='flex flex-col space-y-8 w-full max-w-[388px] mt-[30px]'>
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



                {/* signup */}
                <div className=' w-full flex justify-center mt-[50px]'>
                    <button type='submit' className='py-[12px] z-10  w-full max-w-[388px]  cursor-pointer  bg-[#357EF8] flex justify-center rounded-[24px] gap-[12px]'>
                        <div className='flex space-x-2 items-center'>
                            {
                                loader ? (
                                    <TbLoader3 className="text-white w-7 h-7 animate-spin" />
                                ) :
                                    <h1 className='text-[#F5F7F8] text-[16px] leading-[24px] '>{t("Update")}</h1>
                            }

                        </div>
                    </button>
                </div>
            </form>
        </Form>
    )
}

export default UpdatePassword
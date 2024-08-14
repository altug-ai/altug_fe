import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { fetcher } from '@/lib/functions';
import { TbLoader3 } from 'react-icons/tb';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from "next-intl";
type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>;
    email: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
}





const VerifyEmail = ({ setRoute, email, setCode }: Props) => {

    const [loader, setLoader] = useState<boolean>(false)
    const { toast } = useToast()
    const [resendTimer, setResendTimer] = useState<number>(40);
    const t = useTranslations('Home.Password');

    const FormSchema = z.object({
        pin: z.string().min(4, {
            message: t("One-time"),
        }),
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendTimer]);


    async function onSubmit(data: z.infer<typeof FormSchema>) {

        setLoader(true);
        try {
            const responseData = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/verify-code`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        code: data.pin,
                    }),
                    method: 'POST',
                }
            );
            if (responseData.status) {
                setLoader(false);
                setCode(data.pin)
                setRoute(2)
            } else if (responseData.error.status === 400) {
                setLoader(false);
                toast({
                    variant: 'destructive',
                    description: t("Not"),
                });

            }
        } catch (error) {
            setLoader(false);
            toast({
                variant: 'destructive',
                description: t("Notverified"),
            });
            console.error('Error at Verify Reset Password: ', error);
        }
    }

    const handleResendClick = async () => {

        try {
            const responseData = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/send-code`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email }),
                    method: 'POST',
                }
            );
            if (responseData.status) {
                // setIsVisible(true)
                setResendTimer(40);
                toast({
                    description: t("Otpsent"),
                });
            } else if (responseData?.error?.status === 400) {
                toast({
                    variant: 'destructive',
                    description: t("OtpCould"),
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                description: t("OtpCould"),
            });
            //   console.error('Error at Send Reset Password: ', error);
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='py-[20px] px-[20px] h-full flex flex-col items-center '>
                <div className='w-full max-w-[388px]'>
                    <Image onClick={() => {
                        setRoute(0)
                    }} src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px] mb-[30px] cursor-pointer' />
                </div>

                <div className='w-full max-w-[388px] mt-[20px] mb-[50px] flex flex-col space-y-9'>
                    <div className='flex flex-col space-y-2'>
                        <h1 className='font-medium text-[24px] leading-[32.47px] text-[#FFFFFF]'>{t("Forgot")}</h1>
                        <h1 className='text-[#FFFFFF] font-normal tracking-[1px] leading-[20px] text-[16px] '>{t("WeHave")}</h1>
                    </div>
                </div>


                <div className='w-full max-w-[388px] mt-[20px]'>

                    <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP className='w-full' maxLength={4} {...field}>
                                        <InputOTPGroup className='w-[25%]'>
                                            <InputOTPSlot className='h-[65px] w-full  text-white text-[16px]' index={0} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup className='w-[25%]'>
                                            <InputOTPSlot className='h-[65px] w-full  text-white text-[16px]' index={1} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup className='w-[25%]'>
                                            <InputOTPSlot className='h-[65px] w-full text-white text-[16px]' index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup className='w-[25%]'>
                                            <InputOTPSlot className='h-[65px] w-full  text-white text-[16px]' index={3} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                </div>


                <div className='mt-[30px] w-full max-w-[388px]'>
                    <h1 className='text-center text-[16px] font-medium leading-[28.16px] tracking-[0.2px] text-white'>{t("Didnt")} </h1>
                    {resendTimer === 0 ? (
                        <div className='flex justify-center'><button onClick={handleResendClick} className='text-center text-[16px]  font-medium leading-[28.16px] tracking-[0.2px] text-[#357EF8]'>{t("Resend")}</button>
                        </div>

                    ) : (
                        <h1 className='text-center text-[16px] font-medium leading-[28.16px] tracking-[0.2px] text-[#357EF8]'>{t("ResendIn")} {resendTimer} {t("secs")}</h1>
                    )}

                </div>

                <div className='w-full max-w-[388px] mt-[40px]'>
                    <button type='submit' className='rounded-[35px]  cursor-pointer mt-3 w-full gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                        {
                            loader ? (
                                <TbLoader3 className="text-white w-7 h-7 animate-spin" />
                            ) : (
                                t("Verify")
                            )
                        }
                    </button>
                </div>

            </form>
        </Form>
    )
}

export default VerifyEmail
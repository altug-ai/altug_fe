"use client";
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from "next-intl";

type Props = {}

const Onboarding = (props: Props) => {
    const router = useRouter()
    const { data: session }: any = useSession();
    const { toast } = useToast();
    const t = useTranslations('Home.Home');

    useEffect(() => {
        if (session?.error) {
            toast({
                variant: "destructive",
                description: session?.error,
            });
            signOut()
        }
    }, [session])


    return (
        <div className='w-full h-screen bg-cover bg-center  text-white' style={{ backgroundImage: 'url("/auth/bg.png")' }}>
            <div className='w-full h-full py-10  flex flex-col justify-between'>

                {/* the logo */}
                <div className=' flex justify-center'>
                    <Image src={"/auth/logo.png"} alt='ozballer' width={700} height={700} className='w-[142px] h-[88px] bg-cover' />
                </div>


                {/* the welcome div */}
                <div className='pb-[50px] '>
                    {/* welcome and sub-welcome text */}
                    <div className='flex flex-col items-center space-y-2'>
                        <h1 className='font-bold text-[24px] leading-[32px]'>{t("Welcome")}</h1>
                        <h1 className='font-medium text-[14px] leading-[24.2px] text-center max-w-[326px]'>{t("Prof")}</h1>
                    </div>

                    {/* the google button*/}
                    <div className=' w-full flex justify-center '>
                        <div onClick={async () => {
                            const ress = await signIn("google", {
                                redirect: false,
                                callbackUrl: "/profile",
                            });
                        }} className='py-[12px] z-10 mt-[20px] w-full max-w-[388px]  cursor-pointer mx-[20px] bg-white flex justify-center rounded-[24px] gap-[12px]'>
                            <div className='flex space-x-2 items-center'>
                                <Image src={"/onboard/Google.png"} width={300} height={300} alt='Google icon' className='h-[20px] w-[20px]' />
                                <h1 className='text-[#1A1A1A] text-[16px] leading-[24px] '>{t("Continue")}</h1>
                            </div>
                        </div>
                    </div>


                    {/* the email button */}
                    <div className='w-full flex justify-center '>
                        <div onClick={() => {
                            router.push("/sign-in")
                        }} className='py-[12px] mt-[20px] w-full max-w-[388px] cursor-pointer mx-[20px] bg-white flex justify-center rounded-[24px] gap-[12px]'>
                            <div className='flex space-x-2 items-center'>
                                <Image src={"/onboard/sms.png"} width={300} height={300} alt='Email icon' className='h-[20px] w-[20px]' />
                                <h1 className='text-[#1A1A1A] text-[16px] leading-[24px] '>{t("Email")}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Onboarding
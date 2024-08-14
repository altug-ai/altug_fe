"use client";
import { PureInput } from '@/components/ui/input'
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import EmailVerification from './components/EmailVerification';
import VerifyEmail from './components/VerifyEmail';
import UpdatePassword from './components/UpdatePassword';
import PasswordUpdate from '@/features/Settings/components/PasswordUpdate';
import PasswordUpdated from './components/PasswordUpdated';

type Props = {}

const ForgotPassword = (props: Props) => {
    const [route, setRoute] = useState<number>(0)
    const [email, setEmail] = useState<string>("")
    const [code, setCode] = useState<string>("")
    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>

            {
                route === 0 && (
                    <EmailVerification setRoute={setRoute} setEmail={setEmail} />
                )
            }
            {
                route === 1 && (
                    <VerifyEmail setRoute={setRoute} email={email} setCode={setCode} />
                )
            }

            {
                route === 2 && (
                    <UpdatePassword setRoute={setRoute} code={code} email={email} />
                )
            }

            {
                route === 3 && (
                    <PasswordUpdated />
                )
            }

        </div>
    )
}

export default ForgotPassword
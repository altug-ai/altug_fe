"use client";
import React, { useState } from 'react'
import EmailVerification from './components/EmailVerification';
import EmailVerified from './components/EmailVerified';

type Props = {
    email: string;
    handleSubmit: () => Promise<void>
    loader: boolean;
}

const VerifyEmail = ({ email, handleSubmit, loader }: Props) => {
    const [route, setRoute] = useState<number>(0)
    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>


            {
                route === 0 && (
                    <EmailVerification email={email} setRoute={setRoute} />
                )
            }


            {
                route === 1 && (
                    <EmailVerified handleSubmit={handleSubmit} loader={loader} />
                )
            }


        </div>
    )
}

export default VerifyEmail
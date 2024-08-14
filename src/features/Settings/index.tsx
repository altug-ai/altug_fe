"use client";
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import TabBar from '../Profile/components/TabBar'
import SettingsForm from './components/SettingsForm'
import BasicInfo from './components/BasicInfo';
import PasswordUpdate from './components/PasswordUpdate';
import { TbLoader3 } from 'react-icons/tb';
import { signOut } from 'next-auth/react';
import MyPreferences from './components/MyPreferences';
import { AuthContext } from '@/context/AuthContext';
import SettingsHeader from './components/SettingsHeader';
import ProfilePicture from './components/ProfilePicture';
import { useTranslations } from "next-intl";
import { IoIosMenu } from 'react-icons/io';
import Widget from '@/components/Widget';
import { useRouter } from 'next/navigation';

type Props = {
    language: string;
}

const Settings = ({ language }: Props) => {
    const [route, setRoute] = useState(0)
    const [logOutLoader, setLogoutLoader] = useState(false)
    const { loading } = useContext(AuthContext)
    const [openn, setOpenn] = useState<boolean>(false)
    const router = useRouter()
    const t = useTranslations('Home.Settings');

    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>

            {/* the settings header */}
            <SettingsHeader route={route} setRoute={setRoute} />

            {/* the loader when the profile is loading */}
            {
                loading && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }


            {/* the profile picture settings */}
            <ProfilePicture />


            {/* the basic info and edit info */}
            {
                route === 0 && (<SettingsForm setRoute={setRoute} />)
            }

            {
                route === 1 && (<BasicInfo setRoute={setRoute} />)
            }

            {
                route === 2 && (<PasswordUpdate setRoute={setRoute} />)
            }

            {
                route === 3 && (<MyPreferences />)
            }



            <Widget open={openn} setOpen={setOpenn} />



            {/* to log out */}
            {
                route === 0 && (
                    <div className='w-full max-w-[388px] mb-[60px]'>
                        <div onClick={async () => {
                            router.push(`/${language}/language`)
                        }} className='rounded-[35px] cursor-pointer mt-3 w-1/2 gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                            {t("Language")}
                        </div>
                        <div onClick={async () => {
                            setLogoutLoader(true)
                            await signOut()
                        }} className='rounded-[35px] cursor-pointer mt-3 w-1/2 gap-[12px] h-[48px] bg-[#357EF8]  text-[13px] font-semibold leading-[16.38px] text-white flex flex-col justify-center items-center'>
                            {
                                logOutLoader ? <TbLoader3 className="text-white w-7 h-7 animate-spin" /> : t("Logout")
                            }
                        </div>
                    </div>

                )
            }


            <TabBar page='menu' />
        </div>
    )
}

export default Settings
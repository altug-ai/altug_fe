import { AuthContext } from '@/context/AuthContext'
import React, { useContext } from 'react'
import { useTranslations } from "next-intl";

type Props = {
    setRoute: React.Dispatch<React.SetStateAction<number>>
}

const SettingsForm = ({ setRoute }: Props) => {
    const { user, profile, country } = useContext(AuthContext)
    const t = useTranslations('Home.Settings');

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <div className='w-full max-w-[388px]   flex justify-between items-center'>
                <h1 className='font-semibold text-[32px] leading-[14.02px] text-[#FFFFFF]'>{t("Basic")}</h1>
                <h1 onClick={() => { setRoute(1) }} className='font-semibold cursor-pointer text-[12px] leading-[12.13px] tracking-[0.3%] text-[#357EF8]'>{t("Edit")}</h1>
            </div>


            {/* settings info */}
            <div className='w-full max-w-[388px] my-[30px] flex flex-col space-y-9'>
                <div className='flex flex-col space-y-2'>
                    <h1 className='text-[#FFFFFF] text-[16px] '>{t("Name")}</h1>
                    <h1 className='font-medium text-[24px] leading-[14.02px] text-[#FFFFFF]'>{profile?.attributes?.username ?? ""}</h1>
                </div>

                <div className='flex flex-col space-y-2'>
                    <h1 className='text-[#FFFFFF] text-[16px] '>{t("Email")}</h1>
                    <h1 className='font-medium text-[24px] leading-[14.02px] text-[#FFFFFF]'>{user?.data?.attributes?.email ?? ""} </h1>
                </div>

                <div className='flex flex-col space-y-2'>
                    <h1 className='text-[#FFFFFF] text-[16px] '>{t("Country")}</h1>
                    <h1 className='font-medium text-[24px] leading-[14.02px] text-[#FFFFFF]'>{country ?? ""} </h1>
                </div>

                <div className='flex flex-col space-y-2'>
                    <h1 className='text-[#FFFFFF] text-[16px] '>{t("Phone")}</h1>
                    <h1 className='font-medium text-[24px] leading-[14.02px] text-[#FFFFFF]'>{user?.data?.attributes?.phone ?? ""}</h1>
                </div>
            </div>

            <div className='w-full max-w-[388px]  flex justify-between items-center'>
                <h1 className='font-semibold text-[32px] leading-[14.02px] text-[#FFFFFF]'>{t("Security")}</h1>
                <h1 onClick={() => { setRoute(2) }} className='font-semibold cursor-pointer text-[12px] leading-[12.13px] tracking-[0.3%] text-[#357EF8]'>{t("Update")}</h1>
            </div>

            <div className='w-full max-w-[388px] flex flex-col space-y-2 my-[30px]'>
                <h1 className='text-[#FFFFFF] text-[16px] '>{t("Password")}</h1>
                <h1 className='font-medium text-[24px] leading-[14.02px] text-[#FFFFFF]'>***************</h1>
            </div>
        </div>
    )
}

export default SettingsForm
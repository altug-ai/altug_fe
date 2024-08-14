import Image from 'next/image';
import React from 'react'
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
type Props = {
    route: number;
    setRoute: React.Dispatch<React.SetStateAction<number>>;
}

const SettingsHeader = ({ route, setRoute }: Props) => {
    const router = useRouter();
    const t = useTranslations('Home.Settings');

    return (
        <div className='flex items-center max-w-[388px] w-full justify-between mb-[30px]'>
            <div onClick={() => {
                if (route === 0) {
                    router.back();
                } else {
                    setRoute(0)
                }
            }} className='cursor-pointer flex space-x-3 items-center'>
                <Image src={"/auth/arrow-left.png"} alt='the arrow left' width={300} height={300} className='w-[24px] h-[24px]  cursor-pointer' />
                <h1 className='text-[18px] font-medium leading-[24.35px] text-[#FFFFFF]'>{t("User")}</h1>
            </div>
            <h1 onClick={() => { router.push("/preference/edit") }} className='text-[12px] cursor-pointer leading-[12.13px] tracking-[0.3%] font-semibold text-[#357EF8]'>{t("Preference")}</h1>
        </div>
    )
}

export default SettingsHeader
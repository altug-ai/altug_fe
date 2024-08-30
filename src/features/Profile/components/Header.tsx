import Image from 'next/image'
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { useGetNotViewed } from '@/hooks/useGetNotViewed';
import { TbLoader3 } from 'react-icons/tb';

type Props = {

}

const Header = (props: Props) => {
    const router = useRouter();
    const { profile, profilepic, coaches, totalPoint, players } = useContext(AuthContext)
    const { data, loading } = useGetNotViewed()

    return (
        <div className='flex w-full max-w-[388px] items-center justify-between'>
            <div onClick={() => {
                router.push("/profile")
            }} className='flex space-x-3 items-center'>
                <Image src={profilepic ?? "/profile/unknownp.png"} width={500} height={500} alt='profile pic' className='w-[49.06px] cursor-pointer h-[49.06px] object-cover object-top rounded-full' />
                <h1 className='font-semibold text-[20px] cursor-pointer leading-[14.02px] text-[#FFFFFF]'>{profile?.attributes?.username ?? ""}</h1>
            </div>

            <div className='flex items-center space-x-4'>
                <div onClick={() => {
                    router.push("/notifications")
                }} className='relative'>
                    <Image src={"/onboard/notification.png"} className='w-[37.33px] h-[37.33px] object-cover cursor-pointer' width={600} height={600} alt='notification' />
                    <h1 className='absolute  top-0 right-1 bg-blue-500 text-white px-1 text-xs rounded-full'>
                        {
                            loading ? (
                                <TbLoader3 className="text-white w-5 h-5 animate-spin" />
                            ) : (
                                <div>{data}</div>
                            )
                        }
                    </h1>
                </div>

                <div className='  h-[72.7px] w-[68.94px] bg-cover flex flex-col items-center justify-center' style={{ backgroundImage: 'url("/profile/Number.png")' }}>
                    <h1 className='font-semibold text-[20px] font-clash leading-[12.54px] text-white'>{totalPoint ?? 0}</h1>
                </div>
            </div>
        </div>
    )
}

export default Header
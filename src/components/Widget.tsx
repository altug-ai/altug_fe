import { AuthContext } from '@/context/AuthContext';
import Image from 'next/image'
import React, { useContext } from 'react'
import { AiOutlineClose } from "react-icons/ai";

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Widget = ({ open, setOpen }: Props) => {
    const { profilepic, profile } = useContext(AuthContext)
    return (
        <div>
            {
                open && (
                    <div>
                        <div className=''>
                            <div className='fixed inset-y-0 p-5 overflow-y-auto right-0 w-[80vw] rounded-tl-[20px] bg-black shadow z-50 transform translate-x-0  transition duration-300 ease-in-out min-[768px]:w-[255px]'>
                                {/* the exit option */}
                                <AiOutlineClose onClick={() => {
                                    setOpen(false)
                                }} className='text-white h-5 w-5' />

                                {/* the header */}
                                <div className='flex justify-center w-full mt-[80px]'>
                                    <Image src={"/onboard/Zballer.png"} alt='Z baller' width={500} height={500} className='w-[192px] h-[37px] object-cover' />
                                </div>

                                {/* the user name */}
                                <div className='flex w-full max-w-[388px] items-center justify-center mt-[68px]'>
                                    <div className='flex space-x-3 items-center'>
                                        <Image src={profilepic ?? "/profile/unknownp.png"} width={500} height={500} alt='profile pic' className='w-[49.06px] h-[49.06px] object-cover object-top rounded-full' />
                                        <h1 className='font-semibold text-[20px] leading-[14.02px] text-[#FFFFFF]'>{profile?.attributes?.username ?? ""}</h1>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>

    )
}

export default Widget
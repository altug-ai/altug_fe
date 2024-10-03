import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
type Props = {}

const Success = (props: Props) => {

    const router = useRouter()
    return (
        <div className='max-w-[388px] w-full h-full pb-[50px] relative mt-[76px]'>

            <div className='bg-white w-full rounded-[24px] h-[70vh]  relative'>
                <div className='h-[50%] gride place-content-center'>
                    <div className='flex flex-col items-center '>
                        <h1 className='text-[#3640F0] text-[14px] font-semibold leading-[22px] text-center'>Great!</h1>
                        <h1 className='text-[#202226] font-plus text-[24px] font-bold leading-[32px]'>Your transaction success</h1>
                        <h1 className='text-center text-[#838383] text-[14px] font-normal leading-[140%] max-w-[332px]'>You have successfully transferred your Pro tokens.</h1>
                    </div>
                </div>

                <div className='h-[50%] gride place-content-center border-t-4 border-t-[#EDEDED] border-dotted '>
                    <div className='flex flex-col items-center '>
                        <h1 className='text-[#838383] text-[16px] font-normal leading-[24px] tracking-[0.3px]  text-center'>Total</h1>
                        <h1 className='text-[#3640F0] font-plus text-[36px] font-bold leading-[44px]'>50 $Pro Token</h1>
                        <div className='px-[12px] py-[12px] bg-[#F3F3F3] rounded-[16px] flex space-x-[16px] items-center'>
                            <div className='rounded-[12px]  bg-white px-[10px] py-[10px]'>
                                <Image src={"/tab/chiliz.png"} className="w-[28px] h-[28px]" alt='chiliz chain' width={800} height={800} />
                            </div>

                            <div className='flex flex-col space-y-[2px]'>
                                <h1 className='text-[#202226] font-plus text-[18px] font-normal leading-[26px]'>0x04352634635....ASF</h1>
                                <h1 className='text-[12px] font-normal leading-[20px] text-[#838383] font-plus'>22.09.2024 o 3:02 PM</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <Image src={"/tab/check.png"} className="w-[116px] h-[116px] absolute left-[50%] top-0 transform translate-x-[-50%] translate-y-[-50%]" alt='check' width={800} height={800} />

                <div onClick={() => {
                    router.push("/profile")
                }} className='w-[50%] bg-[#357EF8] absolute transform translate-x-[-50%] translate-y-[-50%] left-[50%] bottom-[-40px] rounded-[47px] grid place-content-center cursor-pointer hover:scale-105 mt-[21px] py-[10px] text-white text-[16px] font-medium leading-[126.006%] '>
                    Back To Home
                </div>
            </div>
            <Image src={"/tab/leftrect.png"} className="w-[32px] h-[48px] absolute bottom-[50%] left-[-20px]" alt='chiliz chain' width={200} height={200} />
            <Image src={"/tab/rightrect.png"} className="w-[32px] h-[48px] absolute bottom-[50%] right-[-20px]" alt='chiliz chain' width={200} height={200} />

        </div>
    )
}

export default Success
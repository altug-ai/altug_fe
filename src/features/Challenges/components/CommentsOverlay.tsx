import Image from 'next/image'
import React from 'react'
import Commentbox from './Commentbox'
import { Input } from '@/components/ui/input'

type Props = {

}

const CommentsOverlay = (props: Props) => {
    return (
        <div className="fixed bottom-0 flex flex-col w-full py-[12px] z-[10000] max-w-[388px]">
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[10000]">

                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[10000]">
                    <div className="bg-[#2E3E5C] h-[622px] absolute border-t border-black rounded-t-[44px]  w-full bottom-0 p-4 ">
                        <div className="flex justify-center mt-[12px] mb-[30px]">
                            <Image
                                src={"/profile/linew.png"}
                                className="w-[60px]"
                                width={500}
                                height={500}
                                alt="line"
                            />
                        </div>


                        <h1 className='text-[16px] font-bold leading-[17.6px] text-white'>100 Comments</h1>
                        <div className='mt-[20px] flex flex-col space-y-[16px]'>
                            <Commentbox />
                            <Commentbox />
                            <Commentbox />
                            <Commentbox />
                            <Commentbox />
                        </div>


                        {/* the input */}
                        <div className='  w-full  mt-[30px]'>
                            {/* the input */}
                            <div className='w-full flex justify-center'>
                                <form className='relative w-full max-w-[335px] rounded-[49px]  h-12 bg-[#838c9e]'>

                                    <Input required className='rounded-l-[49px] w-[80%] text-[16px] text-white placeholder:text-white bg-[#838c9e] leading-[24px] font-semibold border-none focus-visible:ring-0  h-[48px]' placeholder='Leave comment here' />

                                    <div className='flex space-x-2 items-center absolute right-5 top-3'>


                                        <button type='submit'>
                                            <Image src={"/profile/send.png"} alt='send icon' width={500} height={500} className={`h-[20px] w-[20px] cursor-pointer `} />
                                        </button>
                                    </div>

                                </form>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>

    )
}

export default CommentsOverlay
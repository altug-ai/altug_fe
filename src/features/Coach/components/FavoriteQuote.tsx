"use client";
import Image from 'next/image'
import React, { useState } from 'react'
import { type CarouselApi } from "@/components/ui/carousel"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    // CarouselNext,
    // CarouselPrevious,
} from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

type Props = {
    data?: any;
    url?: string;
}

const FavoriteQuote = ({ data, url }: Props) => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
    let [isOpen, setIsOpen] = useState(false)

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <div className='max-w-[388px] w-full mt-[30px]'>
            <div className='w-full max-w-[388px]   flex justify-between items-center'>
                <h1 className='font-semibold text-[16px] leading-[12.13px] tracking-[0.3%] text-[#FFFFFF]'>Favorite Quotes</h1>
                {
                    data?.length > 1 && (
                        <h1 onClick={open} className='font-semibold cursor-pointer text-[12px] leading-[12.13px] tracking-[0.3%] text-[#357EF8]'>View All</h1>
                    )
                }

                <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <DialogPanel
                                transition
                                className="w-full max-w-md rounded-xl bg-white/3 p-6 backdrop-blur-3xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-3"
                            >
                                <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                    All Favorite Quotes
                                </DialogTitle>

                                <div>
                                    {
                                        data?.map((item: any, index: number) => (
                                            <div key={index} className='w-full bg-[#181928] py-[12px] rounded-[12px] h-full mt-[30px]'>

                                                <div className='w-full grid place-items-center mt-[6px]'>
                                                    <Image src={url ?? "/profile/unknownp.png"} alt='player quotes' width={600} height={600} className='max-w-[191px] object-cover object-top w-full h-[201.42px]' />
                                                </div>


                                                <div className='mt-[30px]  flex justify-center '>
                                                    <div className='h-full -mt-[30px] flex flex-coljustify-start '>
                                                        <Image src={"/profile/LeftQuote.png"} alt='left quote' width={500} height={500} className='h-[42px] w-[42px]' />
                                                    </div>

                                                    <div className='flex justify-between items-center space-x-2'>
                                                        <div className='flex flex-col justify-center text-white items-center max-w-[213px]'>
                                                            <h1 className='text-[16px] leading-[24px] tracking-[0.3%] font-semibold text-center'>{item?.quote}</h1>
                                                            <h1 className='font-semibold text-[16px] leading-[12.31px] tracking-[0.3%] mt-[20px]'>-{item?.name}</h1>
                                                        </div>


                                                        <Image src={"/profile/RightQuote.png"} alt='left quote' width={500} height={500} className='h-[26.88px] w-[19.69px]' />

                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <div className="mt-4 flex items-center space-x-2">
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                        onClick={close}
                                    >
                                        Close
                                    </Button>

                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>

            </div>


            <Carousel setApi={setApi}>
                <CarouselContent>
                    {
                        data?.map((item: any, index: number) => (
                            <CarouselItem key={index}>
                                <>

                                    <div className='w-full bg-[#181928] py-[12px] rounded-[12px] h-full mt-[30px]'>

                                        <div className='w-full grid place-items-center mt-[6px]'>
                                            <Image src={url ?? "/profile/unknownp.png"} alt='player quotes' width={600} height={600} className='max-w-[191px] object-cover object-top w-full h-[201.42px]' />
                                        </div>


                                        <div className='mt-[30px]  flex justify-center '>
                                            <div className='h-full -mt-[30px] flex flex-coljustify-start '>
                                                <Image src={"/profile/LeftQuote.png"} alt='left quote' width={500} height={500} className='h-[42px] w-[42px]' />
                                            </div>

                                            <div className='flex justify-between items-center space-x-2'>
                                                <div className='flex flex-col justify-center text-white items-center max-w-[213px]'>
                                                    <h1 className='text-[16px] leading-[24px] tracking-[0.3%] font-semibold text-center'>{item?.quote}</h1>
                                                    <h1 className='font-semibold text-[16px] leading-[12.31px] tracking-[0.3%] mt-[20px]'>-{item?.name}</h1>
                                                </div>


                                                <Image src={"/profile/RightQuote.png"} alt='left quote' width={500} height={500} className='h-[26.88px] w-[19.69px]' />

                                            </div>

                                        </div>
                                    </div>
                                </>
                            </CarouselItem>)
                        )
                    }
                </CarouselContent>
            </Carousel>
            <Progress value={(current / count) * 100} className='h-[3px] w-full object-cover border-none mt-[20px] bg-slate-300' />

        </div>
    )
}

export default FavoriteQuote
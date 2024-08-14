"use client";
import Image from 'next/image'
import React, { useState } from 'react'
import { CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    // CarouselNext,
    // CarouselPrevious,
} from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import ReactPlayer from 'react-player/youtube'

type Props = {
    data?: any;
}

const Highlights = ({ data }: Props) => {
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


    // console.log("this is the data", data)


    return (
        <div className='max-w-[388px] w-full mt-[30px]'>
            <div className='w-full max-w-[388px]   flex justify-between items-center'>
                <h1 className='font-semibold text-[16px] leading-[12.13px] tracking-[0.3%] text-[#FFFFFF]'>Career Highlights</h1>
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
                                    All Highlights
                                </DialogTitle>

                                <div>
                                    {
                                        data?.map((item: any, index: number) => (
                                            <div key={index} className='w-full h-[261px] my-20 rounded-[8px] border border-[#D5D5D5] mt-[30px]'>
                                                <ReactPlayer controls width='100%'
                                                    height='100%' url={item?.url} />

                                                {/* <div className='h-[80%] w-full bg-cover grid place-items-center' style={{ backgroundImage: 'url("/profile/Deepay.png")' }}>
                    <Image src={"/profile/Video.png"} width={600} height={600} alt='video icon' className='w-[74.29px] h-[75.4px]' />
                </div> */}

                                                <div className='h-[20%] flex flex-col px-[15px]'>
                                                    <h1 className='text-[18px] leading-[24.35px] font-medium text-white line-clamp-1'>{item?.title}</h1>
                                                    <h1 className='text-[12px] leading-[16.24px] font-medium text-white line-clamp-1'>04 June - {item?.place} - {item?.match}</h1>
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

                                    <div className='w-full h-[261px] rounded-[8px] border border-[#D5D5D5] mt-[30px]'>
                                        {/* <video className='h-[80%] w-full bg-cover grid place-items-center' controls preload="none">
                                            <source src={item?.video?.data?.attributes?.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video> */}

                                        <ReactPlayer controls width='100%'
                                            height='80%' url={item?.url} />
                                        {/* <div className='h-[80%] w-full bg-cover grid place-items-center' style={{ backgroundImage: 'url("/profile/Deepay.png")' }}>
                    <Image src={"/profile/Video.png"} width={600} height={600} alt='video icon' className='w-[74.29px] h-[75.4px]' />
                </div> */}

                                        <div className='h-[20%] flex flex-col px-[15px]'>
                                            <h1 className='text-[18px] leading-[24.35px] font-medium text-white line-clamp-1'>{item?.title}</h1>
                                            <h1 className='text-[12px] leading-[16.24px] font-medium text-white line-clamp-1'>04 June - {item?.place} - {item?.match}</h1>
                                        </div>
                                    </div>
                                </>
                            </CarouselItem>)
                        )
                    }
                </CarouselContent>
                <CarouselPrevious className='ml-[50px]' />
                <CarouselNext className='mr-[50px]' />
            </Carousel>
            <Progress value={(current / count) * 100} className='h-[3px] w-full object-cover border-none mt-[20px] bg-slate-300' />
            {/* <Image src={"/profile/Load.svg"} width={400} height={400} alt='state' className='h-[2px] w-full object-cover mt-[20px]' /> */}

        </div>
    )
}

export default Highlights
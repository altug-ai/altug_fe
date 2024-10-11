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
import { useTranslations } from "next-intl";

type Props = {
    data?: any
}

const TacticStyle = ({ data }: Props) => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
    const t = useTranslations('Home.CoachProfile');
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
                <h1 className='font-semibold text-[16px] leading-[12.13px] tracking-[0.3%] text-[#FFFFFF]'>{t("Tactic")}</h1>
                {
                    data?.length > 1 && (
                        <h1 onClick={open} className='font-semibold cursor-pointer text-[12px] leading-[12.13px] tracking-[0.3%] text-[#357EF8]'>{t("View")}</h1>
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
                                    {t("AllTac")}
                                </DialogTitle>

                                <div>
                                    {
                                        data?.map((item: any, index: number) => (
                                            <div key={item?.name} className='w-full bg-[#181928] rounded-[12px] h-full mt-[30px]'>
                                                <Image src={"/profile/Match.png"} className='h-[204px] object-cover rounded-t-[12px]' width={600} height={600} alt='match' />

                                                <div className='w-full mt-[20px] pb-[20px] px-[21px] text-white'>
                                                    <h1 className='text-[24px] leading-[24px] tracking-[0.3%] font-bold text-center'>{t("Tactics")} {item?.name}</h1>
                                                    <h1 className='mt-[30px] text-[16px] font-semibold leading-[24px] tracking-[0.3%] text-center'>
                                                        {item?.description}
                                                    </h1>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <div className="mt-4 flex items-center space-x-2">
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                        onClick={close}
                                    >
                                        {t("Close")}
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

                                    <div className='w-full bg-[#181928] rounded-[12px] h-full mt-[30px]'>
                                        <Image src={"/profile/Match.png"} className='h-[204px] object-cover rounded-t-[12px]' width={600} height={600} alt='match' />
                                        <div className='w-full mt-[20px] pb-[20px] px-[21px] text-white'>
                                            <h1 className='text-[24px] leading-[24px] tracking-[0.3%] font-bold text-center'>{t("Tactics")} {item?.name}</h1>
                                            <h1 className='mt-[30px] text-[16px] font-semibold leading-[24px] tracking-[0.3%] text-center'>
                                                {item?.description}
                                            </h1>
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

export default TacticStyle
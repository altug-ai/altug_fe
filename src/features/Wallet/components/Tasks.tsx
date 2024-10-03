import React from 'react'
import Task from '../shared/Task'
import { useGetTasks } from '@/hooks/useGetTasks'
import { TbLoader3 } from 'react-icons/tb'

type Props = {}

const Tasks = (props: Props) => {
    const { data, loading } = useGetTasks()
    return (
        <div className='max-w-[388px] w-full pb-[50px]'>
            <h1 className='text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]'>Claim Rewards</h1>
            <Task claim />
            <Task claim />

            <h1 className='text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]'>Pending Tasks</h1>
            {
                loading && (
                    <div className='max-w-[388px] w-full my-[30px] flex justify-center'>
                        <TbLoader3 className="text-white w-10 h-10 animate-spin" />
                    </div>
                )
            }
            {
                data?.map((dat) => (
                    <Task number={dat?.attributes?.reward} title={dat?.attributes?.title} key={dat.id} join />
                ))
            }


            <h1 className='text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]'>Claimed</h1>
            <Task completed />
            <Task completed />
        </div>
    )
}

export default Tasks
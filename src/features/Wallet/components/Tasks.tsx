import React from 'react'
import Task from '../shared/Task'

type Props = {}

const Tasks = (props: Props) => {
    return (
        <div className='max-w-[388px] w-full'>
            <h1 className='text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]'>Claim Rewards</h1>
            <Task claim />
            <Task claim />

            <h1 className='text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]'>Pending Tasks</h1>
            <Task join />
            <Task join />


            <h1 className='text-[16px] font-medium leading-normal tracking-[1px] text-[#EDEDED]'>Claimed</h1>
            <Task completed />
            <Task completed/>
        </div>
    )
}

export default Tasks
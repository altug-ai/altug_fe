"use client";
import React, { useState } from 'react'
import TabBar from '../Profile/components/TabBar'
import Header from './components/Header'
import Tasks from './components/Tasks'
import WalletData from './components/WalletData'
import Transfer from './components/Transfer';
import Success from './components/Success';

type Props = {}

const Wallet = (props: Props) => {
    const [tab, setTab] = useState<number>(0)
    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>
            <Header setTab={setTab} tab={tab} />
            {
                tab === 0 && (
                    <>
                        <div className='max-w-[388px] w-full'>
                            <WalletData setTab={setTab} />
                        </div>
                        <Tasks />

                    </>
                )
            }

            {
                tab == 1 && (
                    <Transfer setTab={setTab} />
                )
            }

            {
                tab == 2 && (
                    <Success />
                )
            }

            <TabBar page='profile' />
        </div>
    )
}

export default Wallet
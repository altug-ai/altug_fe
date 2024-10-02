import React from 'react'
import TabBar from '../Profile/components/TabBar'
import Header from './components/Header'
import Tasks from './components/Tasks'
import WalletData from './components/WalletData'

type Props = {}

const Wallet = (props: Props) => {
    return (
        <div className='py-[20px] px-[20px] h-full flex flex-col items-center '>
            <Header />
            <div className='max-w-[388px] w-full'>
                <WalletData />
            </div>
            <Tasks />
            <TabBar page='profile' />
        </div>
    )
}

export default Wallet
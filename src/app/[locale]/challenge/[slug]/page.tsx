import ChallengePage from '@/features/Challenges/ChallengePage'
import React from 'react'

type Props = {}

const page = ({ params: { locale } }: any) => {
    return (
        <div>
            <ChallengePage language={locale} />
        </div>
    )
}

export default page
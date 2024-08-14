import Language from '@/features/Language'
import React from 'react'



const page = ({ params: { locale } }: any) => {


    return (
        <div>
            <Language language={locale} />
        </div>
    )
}

export default page
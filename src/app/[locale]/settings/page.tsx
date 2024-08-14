import Settings from '@/features/Settings'
import React from 'react'

type Props = {}

const page = ({ params: { locale } }: any) => {
  return (
    <div>
      <Settings language={locale} />
    </div>
  )
}

export default page
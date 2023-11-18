import React from 'react'
import Image from 'next/image'
const Logo:React.FC = () => {

    return (
        <Image alt='black logo' src='/logo/black.png' width={175} height={175} />
    )
}
export { Logo }
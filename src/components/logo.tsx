import React from 'react'
import Image from 'next/image'
const Logo:React.FC = () => {

    return (
        <Image alt='black logo' src='/logo/black.png' height={30} width={125} />
    )
}
export { Logo }
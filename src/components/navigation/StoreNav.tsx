import React from 'react'
import Link from 'next/link'
import { Logo } from '../Logo'

const Date:React.FC = () => {
    return (
        <h2>
            1/11/2023  
        </h2>
    )
}

const Time:React.FC = () => {
    return (
        <h2>
            11:11 PM
        </h2>
    )
}

export const Navigation:React.FC = () => {

    return (
      <div className='w-full flex flex-col justify-center gap-5'>
          <Logo/>
          <div className='flex flex-row justify-center'>
              <Date/>
              <div className='p-2'></div>
              <Time/>
          </div>
          
        <Link href='/capsules'>
          <div className='text-center'>
              Shop
          </div>
        </Link>
        <Link href='/archive'>
           <div className='text-center'>
              Archive
          </div>
        </Link>
        <Link href='/content'>
          <div className='text-center'>
              Contact
          </div>
        </Link>
      </div>
    )
  }
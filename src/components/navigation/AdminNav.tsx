import Link from 'next/link'
import { Logo } from '~/components'
import { UserButton } from "@clerk/nextjs";

export default function AdminNavigation() {
    return (
        <div className="h-full flex flex-col justify-between w-64 bg-white px-4 py-8 border-r text-lg font-mono shadow-2xl">
            <div className='h-40 flex flex-col justify-center align-middle'>
                <div className='w-full flex flex-row justify-center'>
                    <Logo/>
                </div>
                
            </div>
            <div className='flex flex-col justify-between '>
                <Link className={'h-full w-full p-4 m-2 border-4 border-transparent hover:border-gray-200 rounded-lg text-end'} href={'/admin'}>
                    Dashboard
                </Link>
                <Link className={'h-full w-full p-4 m-2 border-4 border-transparent hover:border-gray-200 rounded-lg text-end'} href={'/admin/inventory'}>Inventory</Link>
                <Link className={'h-full w-full p-4 m-2 border-4 border-transparent hover:border-gray-200 rounded-lg text-end' } href={'/admin/order'}>Order</Link>
                <Link className={'h-full w-full p-4 m-2 border-4 border-transparent hover:border-gray-200 rounded-lg text-end'} href={'/admin/product'}>Product</Link>
                <Link className={'h-full w-full p-4 m-2 border-4 border-transparent hover:border-gray-200 rounded-lg text-end'} href={'/admin/shipping'}>Shipping</Link>
            </div>
            <div className='h-60 flex flex-col justify-center'>
                <div className='flex flex-row justify-center align-middle'>
                    <UserButton />
                </div>
            </div>
        </div>
    )
}
import Link from 'next/link'
import { Logo } from '~/components'
import { UserButton } from "@clerk/nextjs";

export default function AdminNavigation() {
    return (
        <div className=" w-full flex flex-row justify-between bg-white border-r text-lg font-mono shadow-lg">

            <div className='w-1/3 flex flex-row justify-center'>
                <div className=' pt-4 p-2 flex flex-row gap-3 justify-end align-baseline'>
                    <Logo/>
                    <div className='flex flex-col justify-end align-bottom'>
                    <span className='text-sm'>Admin</span>
                    </div>
                    
                </div>
               
            </div>
                
        
            <div className='flex flex-row w-2/3 justify-start gap-10 px-10'>
                <Link className={'flex flex-col justify-end align-baseline h-full w-full border-transparent border-2 hover:border-b-black text-center'} href={'/admin'}>
                    Dashboard
                </Link>
                <Link className={'flex flex-col justify-end align-baseline h-full w-full border-2 border-transparent hover:border-b-black text-center'} href={'/admin/inventory'}>Inventory</Link>
                <Link className={'flex flex-col justify-end align-baseline h-full w-full border-2 border-transparent hover:border-b-black text-center' } href={'/admin/order'}>Order</Link>
                <Link className={'flex flex-col justify-end align-baseline h-full w-full border-2 border-transparent hover:border-b-black text-center'} href={'/admin/product'}>Product</Link>
                <Link className={'flex flex-col justify-end align-baseline h-full w-full border-2 border-transparent hover:border-b-black text-center'} href={'/admin/shipping'}>Shipping</Link>
            </div>
            <div className='flex flex-row justify-center'>
                <div className='flex flex-row justify-center align-middle'>
                    <UserButton />
                </div>
            </div>
        </div>
    )
}
import Link from 'next/link'

export default function AdminNavigation() {
    return (
        <div className="flex flex-col w-64 bg-white px-4 py-8 border-r">
            {/* Insert your links here */}
            <Link href={'/admin'}>Dashboard</Link>
            <Link href={'/admin/inventory'}>Inventory</Link>
            <Link href={'/admin/order'}>Order</Link>
            <Link href={'/admin/product'}>Product</Link>
            <Link href={'/admin/shipping'}>Shipping</Link>
        </div>
    )
}
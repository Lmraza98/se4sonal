import { TRPCReactProvider } from "@app/trpc/react";
import { headers } from "next/headers";
import Link from 'next/link'
export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body >
            <div className="flex h-screen bg-gray-100">
                <div className="flex flex-col w-64 bg-white px-4 py-8 border-r">
                    {/* Insert your links here */}
                    <Link href={'/admin/inventory'}>Inventory</Link>
                    <Link href={'/admin/order'}>Order</Link>
                    <Link href={'/admin/product'}>Product</Link>
                    <Link href={'/admin/shipping'}>Shipping</Link>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
  
          <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
          
        </body>
      </html>
    );
  }
  
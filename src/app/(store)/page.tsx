
import React from 'react'
import { Navigation } from '~/components/navigation/store-nav'
// import { api } from "~/trpc/server";
export default async function Home() {
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-20 bg-gradient-to-b from-[#7c7c7c] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Navigation/>
      </div>
    </main>
  );
}

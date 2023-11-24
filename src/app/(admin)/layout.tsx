import "~/styles/globals.css";
import Navigation from "~/components/navigation/admin-nav"

import { TRPCReactProvider } from "~/trpc/react";
import { cookies } from "next/headers";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core"

import { ClerkProvider } from '@clerk/nextjs'

export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body>
              <div className="flex h-screen bg-gray-100">
                <Navigation/>
                <div className="flex-1 p-6 overflow-y-auto">
                <NextSSRPlugin
                  /**
                   * The `extractRouterConfig` will extract **only** the route configs
                   * from the router to prevent additional information from being
                   * leaked to the client. The data passed to the client is the same
                   * as if you were to fetch `/api/uploadthing` directly.
                   */
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />
                  <TRPCReactProvider cookies={cookies().toString()}>{children}</TRPCReactProvider>
                </div>
              </div>
          </body>
        </html>
      </ClerkProvider>
    );
  }
//   Commented out for now

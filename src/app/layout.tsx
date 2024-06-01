import { cookies } from "next/headers";
import "~/styles/globals.css";

import { Inter } from "next/font/google";

import Providers from "~/components/providers";
import { AppShell } from "~/components/patterns/app-shell";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import Script from "next/script";

import { Toaster } from "~/components/ui/sonner";
import { TailwindIndicator } from "~/components/patterns/tailwind-indicator";
import SplashScreen from "~/components/patterns/splash-screen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout?.value
    ? (JSON.parse(layout?.value) as number[])
    : [20, 80];
  const defaultIsCollapsed = collapsed?.value
    ? (JSON.parse(collapsed?.value) as boolean)
    : false;

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <Script
            src="https://app.lemonsqueezy.com/js/lemon.js"
            strategy="beforeInteractive"
          />
          <ClerkLoading>
            <SplashScreen />
          </ClerkLoading>
          <ClerkLoaded>
            <Suspense>
              <Providers>
                <AppShell
                  defaultIsCollapsed={defaultIsCollapsed}
                  defaultLayout={defaultLayout}
                >
                  {children}
                </AppShell>
              </Providers>
            </Suspense>
          </ClerkLoaded>
          <Toaster />
          <TailwindIndicator />
        </body>
      </html>
    </ClerkProvider>
  );
}

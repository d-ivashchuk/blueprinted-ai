"use client";

import React, { useEffect } from "react";
import { LogSnagProvider } from "@logsnag/next";

import { TRPCReactProvider } from "~/trpc/react";
import { env } from "~/env.mjs";

import { ThemeProvider } from "./theme-provider";
import * as Sentry from "@sentry/nextjs";
import { TooltipProvider } from "~/components/ui/tooltip";
import { useUser } from "@clerk/nextjs";

const Identification = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();

  const userId = user?.user?.id;

  useEffect(() => {
    Sentry.setUser({ id: userId });
  }, [user, userId]);

  return <>{children}</>;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCReactProvider>
        <LogSnagProvider
          token={
            env.NEXT_PUBLIC_LOGSNAG_DISABLE_TRACKING === "1"
              ? ""
              : env.NEXT_PUBLIC_LOGSNAG_TOKEN
          }
          project={env.NEXT_PUBLIC_LOGSNAG_PROJECT}
        />
        <TooltipProvider>
          <Identification>{children}</Identification>
        </TooltipProvider>
      </TRPCReactProvider>
    </ThemeProvider>
  );
};

export default Providers;

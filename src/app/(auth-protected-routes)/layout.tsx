"use client";

import { useUser } from "@clerk/nextjs";
import { useLogSnag } from "@logsnag/next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { setUserId, identify } = useLogSnag();

  const userId = user?.id;

  //@ts-expect-error this is the only way I figured to allow logsnag to work on the client
  if (userId && typeof window !== "undefined" && window.ls) {
    setUserId(userId);
    if (user?.emailAddresses[0]?.emailAddress)
      identify({
        user_id: userId,
        properties: {
          email: user?.emailAddresses[0]?.emailAddress,
        },
      });
  }

  return <>{children}</>;
}

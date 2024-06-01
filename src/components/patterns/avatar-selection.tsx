"use client";

import * as React from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import { motion } from "framer-motion";
import { useSession } from "@clerk/nextjs";
import { api } from "~/trpc/react";
import { getPlainUrl } from "~/lib/utils";
import { usePathname } from "next/navigation";

export function AvatarSelection({}) {
  const { session, isSignedIn } = useSession();
  const onboardingQuery = api.user.getOnboarding.useQuery();
  const pathname = usePathname();

  const project = onboardingQuery.data?.project;

  const isOnAgentOnbaordingStage =
    pathname.includes("/onboarding/agent") ||
    pathname.includes("/onboarding/chat-settings") ||
    pathname.includes("/onboarding/project-settings") ||
    pathname.includes("/onboarding/chat");

  return (
    isSignedIn && (
      <div className="flex flex-row justify-center align-middle">
        <motion.div
          initial={{ y: "-5rem" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative -mt-[60px] rounded-full bg-background p-2"
        >
          <Avatar className="mb ">
            <AvatarImage
              className="h-[100px] w-[100px] rounded-full"
              src={session.publicUserData.imageUrl ?? undefined}
              alt="avatar"
            />
            <AvatarFallback>
              <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 text-xl font-bold ">
                {session.publicUserData.firstName?.charAt(0)}
              </div>
            </AvatarFallback>
          </Avatar>
        </motion.div>
        {project && (
          <motion.div
            initial={{ y: "-5rem" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative -ml-10 -mt-[60px] rounded-full bg-background p-2"
          >
            <Avatar className="mb ">
              <AvatarImage
                className="h-[100px] w-[100px] rounded-full border-2 border-slate-200 p-6"
                src={project?.faviconUrl ?? undefined}
                alt="avatar"
              />
              <AvatarFallback>
                <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 text-xl font-bold ">
                  {getPlainUrl(project?.websiteUrl ?? "")?.charAt(0)}
                </div>
              </AvatarFallback>
            </Avatar>
          </motion.div>
        )}
        {isOnAgentOnbaordingStage && (
          <motion.div
            initial={{ y: "-5rem" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative -ml-10 -mt-[60px] rounded-full bg-background p-2"
          >
            <Avatar className="mb ">
              <AvatarImage
                className="h-[100px] w-[100px] rounded-full "
                src={project?.aiAgent?.base64Avatar ?? undefined}
                alt="avatar"
              />
              <AvatarFallback>
                <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 text-xl font-bold ">
                  {getPlainUrl(project?.websiteUrl ?? "")?.charAt(0)}
                </div>
              </AvatarFallback>
            </Avatar>
          </motion.div>
        )}
      </div>
    )
  );
}

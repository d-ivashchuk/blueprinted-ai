"use client";

import { FolderDot, Inbox, MessageCircle, Settings } from "lucide-react";

import { usePathname } from "next/navigation";

import { TooltipProvider } from "~/components/ui/tooltip";
import { Separator } from "~/components/ui/separator";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

import React from "react";
import { cn } from "~/lib/utils";
import { Nav, type NavProps } from "./nav";
import { UserProfile } from "./user-profile";

export function AppShell({
  children,
  defaultIsCollapsed = false,
  defaultLayout = [20, 80],
  collapsedSize = 4,
}: {
  children: React.ReactNode;
  defaultIsCollapsed: boolean;
  defaultLayout: number[];
  collapsedSize?: number;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultIsCollapsed);
  const pathname = usePathname();

  // Force user to complete onboarding if not completed

  const isInSigninSignupRoute =
    pathname.includes("/sign-in") || pathname.includes("/sign-up");
  const isWidgetRoute = pathname.includes("/w/");
  const isWidgetPreviewRoute = pathname.includes("/widget-preview");

  const shallSkipShellLayout =
    isInSigninSignupRoute || isWidgetRoute || isWidgetPreviewRoute;

  const links: NavProps["links"] = [
    {
      title: "My GPTs",
      icon: FolderDot,
      variant: "ghost",
      href: "/projects",
    },
    {
      title: "Chats",
      // label: "9",
      icon: MessageCircle,
      variant: "ghost",
      isDisabled: true,
    },
  ];

  const additionalLinks: NavProps["links"] = [
    {
      title: "Settings",
      icon: Settings,
      variant: "ghost",
      href: "/settings",
      isDisabled: true,
    },
  ];

  const linksWithCurrent: NavProps["links"] = links.map((link) => {
    const output: NavProps["links"][0] =
      link.href === pathname ? { ...link } : link;

    return output;
  });

  const additionalLinksWithCurrent: NavProps["links"] = additionalLinks.map(
    (link) => {
      const output: NavProps["links"][0] =
        link.href === pathname ? { ...link } : link;

      return output;
    },
  );

  return shallSkipShellLayout ? (
    <main>{children}</main>
  ) : (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )};path=/`;
        }}
        className="items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={collapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true,
            )};path=/`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false,
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div className="flex h-screen flex-col justify-between">
            <div className="w-full">
              <Nav isCollapsed={isCollapsed} links={linksWithCurrent} />
              <Separator />
              <Nav
                isCollapsed={isCollapsed}
                links={additionalLinksWithCurrent}
              />
            </div>
            <div className="w-full">
              <UserProfile isCollapsed={isCollapsed} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={defaultLayout[2]}>
          <div className="h-screen overflow-scroll px-8 pt-8">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

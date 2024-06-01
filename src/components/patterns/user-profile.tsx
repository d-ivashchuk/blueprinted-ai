import React from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import {
  CreditCard,
  Settings,
  MessageCircleQuestion,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ColorModeSwitch } from "./color-mode-switch";

import {
  useSession,
  useClerk,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import UserButton from "./user-button";

type Role = "SUPER_ADMIN" | "USER";

const mapUserRoleToLabel = (role: Role) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super admin";
    case "USER":
      return "User";
    default:
      return "Unknown";
  }
};

export const UserProfile = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { session } = useSession();
  const { signOut, openUserProfile } = useClerk();
  const user = useUser();

  const isSuperAdmin = user.user?.unsafeMetadata.role === "SUPER_ADMIN";

  return (
    <div className="p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCollapsed ? (
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full justify-center"
            >
              <UserButton className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full justify-start"
            >
              <span className="mr-2 rounded-full bg-red-300">
                <UserButton className="h-5 w-5" />
              </span>
              <span>{session?.publicUserData.firstName}</span>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel
            className="flex justify-center rounded-b bg-muted"
            inset={false}
          >
            <Badge variant="outline" className="bg-yellow-500">
              {mapUserRoleToLabel(
                (user.user?.unsafeMetadata.role as Role) ?? "NOT_ASSIGNED",
              )}
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <Link href="/app/settings/billing">Billing</Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => openUserProfile()}>
            <Settings className="mr-2 h-4 w-4" />
            User settings
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <MessageCircleQuestion className="mr-2 h-4 w-4" />
            Help
          </DropdownMenuItem>
          {isSuperAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <Link href="/admin/user-management">Management</Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem>
            <ColorModeSwitch />
          </DropdownMenuItem>
          <DropdownMenuSeparator className="flex" />
          <DropdownMenuItem onClick={() => signOut()}>
            <SignedIn>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">Sign in</Link>
            </SignedOut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

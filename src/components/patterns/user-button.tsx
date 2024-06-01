import { CircleUser } from "lucide-react";
import { useSession } from "@clerk/nextjs";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserButton = ({ className }: { className?: string }) => {
  const { session, isSignedIn } = useSession();

  return (
    <div>
      {isSignedIn ? (
        <Avatar className={className}>
          <AvatarImage src={session.publicUserData.imageUrl ?? undefined} />
          <AvatarFallback>
            {session.publicUserData.firstName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <CircleUser />
      )}
    </div>
  );
};

export default UserButton;

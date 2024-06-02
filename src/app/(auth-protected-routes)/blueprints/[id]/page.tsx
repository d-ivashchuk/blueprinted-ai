"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import {
  EditIcon,
  EllipsisVertical,
  Home,
  HomeIcon,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const ProjectDetail = ({ params }: { params: { id: string } }) => {
  const utils = api.useUtils();
  const router = useRouter();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const { data: blueprint, isLoading: blueprintIsLoading } =
    api.blueprints.getUserBlueprintById.useQuery({
      id: params.id,
    });
  const updateBlueprintNameMutation =
    api.blueprints.updateBlueprint.useMutation({
      onSuccess: () => {
        void utils.blueprints.getUserBlueprintById.invalidate({
          id: params.id,
        });
        toast.success("Blueprint name updated");
      },
      onError: () => {
        if (nameRef.current) {
          nameRef.current.innerHTML = blueprint?.name ?? "";
        }
        toast.error("Failed to update blueprint name");
      },
    });
  const deleteBlueprintMutation = api.blueprints.deleteBlueprint.useMutation({
    onSuccess: () => {
      void utils.blueprints.getUserBlueprints.invalidate();
      toast.success("Blueprint deleted");
      router.push("/blueprints");
    },
    onError: () => {
      toast.error("Failed to delete blueprint");
    },
  });

  const [blueprintName, setBlueprintName] = useState("");

  if (!blueprintIsLoading && !blueprint?.id) {
    return <div>Blueprint not found</div>;
  }

  return (
    <div className="mb-4 flex h-16 items-center bg-slate-100">
      <div className="ml-4 flex items-center gap-2 text-lg">
        <Button
          onClick={() => router.push(`/blueprints`)}
          size="icon"
          variant="outline"
          className="rounded-full"
        >
          <HomeIcon className="h-4 w-4 text-gray-400" />
        </Button>
        <p>My Blueprints /</p>
        <h1
          ref={nameRef}
          onBlur={() => {
            updateBlueprintNameMutation.mutate({
              id: blueprint?.id ?? "",
              name: blueprintName,
            });
          }}
          onInput={(e) => setBlueprintName(e.currentTarget.innerText)}
          contentEditable={true}
          className="font-bold tracking-tight focus:outline-none"
        >
          {blueprint?.name}
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <EllipsisVertical className="" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuSeparator />
            <DropdownMenuItem aria-label="Hide column">
              <EditIcon
                className="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                deleteBlueprintMutation.mutate({
                  id: blueprint?.id ?? "",
                })
              }
              aria-label="Hide column"
            >
              <Trash2
                className="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProjectDetail;

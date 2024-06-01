"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import { api } from "~/trpc/react";

const ProjectDetail = ({ params }: { params: { id: string } }) => {
  const utils = api.useUtils();
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

  const [blueprintName, setBlueprintName] = useState("");

  if (!blueprintIsLoading && !blueprint?.id) {
    return <div>Blueprint not found</div>;
  }

  return (
    <div className="mb-4">
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
        className="text-3xl font-bold tracking-tight focus:outline-none"
      >
        {blueprint?.name}
      </h1>
    </div>
  );
};

export default ProjectDetail;

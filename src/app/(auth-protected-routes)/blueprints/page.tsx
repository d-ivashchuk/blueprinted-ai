"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

const Projects = () => {
  const utils = api.useUtils();
  const blueprintsQuery = api.blueprints.getUserBlueprints.useQuery();
  const createBlueprintMutation = api.blueprints.createBlueprint.useMutation();
  const router = useRouter();

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-4">
        <h1 className=" text-3xl font-bold tracking-tight">My Blueprints</h1>

        <Button
          onClick={() =>
            createBlueprintMutation.mutate(undefined, {
              onSuccess: () => {
                void utils.blueprints.getUserBlueprints.invalidate();
              },
            })
          }
          className="group"
          size="sm"
        >
          <PlusIcon className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-[.hover]:scale-110" />
          Create new blueprint
        </Button>
      </div>
      <p className="text-lg text-muted-foreground">
        Create a new AI blueprint and trigger it from wherever you want.
      </p>
      <Separator className="mb-6 mt-2" />

      <div className="max-w-4xl">
        {blueprintsQuery.isPending ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[80px]" />
            ))}
          </div>
        ) : null}
        <div className="flex flex-col gap-2">
          {blueprintsQuery.data?.map((blueprint) => (
            <Card
              className="flex flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between"
              key={blueprint.id}
              onClick={() => {
                void router.push(`/projects/${blueprint.id}`);
              }}
            >
              <div>
                <div className="flex flex-col gap-1">
                  <h2 className="truncate text-lg font-bold">
                    {blueprint.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Last edited:{" "}
                    {blueprint.xata.updatedAt.toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  void router.push(`/blueprints/${blueprint.id}`);
                }}
              >
                Edit
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;

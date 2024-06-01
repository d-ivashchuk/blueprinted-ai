"use client";

import { Loader2, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useDebounce } from "~/hooks/use-debounce";
import { api } from "~/trpc/react";

const Blueprints = () => {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const debouncedFilter = useDebounce(filter, 500);
  const utils = api.useUtils();
  const blueprintsQuery = api.blueprints.getUserBlueprints.useQuery(
    {
      filter: debouncedFilter ?? undefined,
    },
    {
      placeholderData: (prev) => prev,
    },
  );
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

      <div className="mb-2 flex items-center gap-2">
        <Input
          disabled={blueprintsQuery.isLoading}
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
          className="max-w-[200px]"
          placeholder="Search blueprints"
        />
        {blueprintsQuery.isFetching && (
          <Loader2 className="h-5 w-5 animate-spin" />
        )}
      </div>

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
                void utils.blueprints.getUserBlueprintById.prefetch({
                  id: blueprint.id,
                });
                void router.push(`/blueprints/${blueprint.id}`);
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

export default Blueprints;

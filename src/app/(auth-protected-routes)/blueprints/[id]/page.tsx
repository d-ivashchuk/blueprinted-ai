"use client";

import React from "react";

import { api } from "~/trpc/react";

const ProjectDetail = ({ params }: { params: { id: string } }) => {
  const getBlueprintByIdQuery = api.blueprints.getUserBlueprintById.useQuery({
    id: params.id,
  });

  return (
    <div className="mb-4">
      <h1 className="text-3xl font-bold tracking-tight">
        {getBlueprintByIdQuery.data?.name}
      </h1>
    </div>
  );
};

export default ProjectDetail;

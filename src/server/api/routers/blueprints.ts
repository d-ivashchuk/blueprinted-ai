import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import userGuard from "../utils/user-guard";

export const blueprintsRouter = createTRPCRouter({
  getUserBlueprints: protectedProcedure.query(
    async ({ ctx: { userId, db } }) => {
      console.log("getUserBlueprints runs");
      userGuard(userId);
      const blueprints = await db.blueprints.filter({ userId }).getMany();
      return blueprints;
    },
  ),
  createBlueprint: protectedProcedure.mutation(
    async ({ ctx: { userId, db } }) => {
      console.log("createBlueprint runs");
      userGuard(userId);

      const blueprint = await db.blueprints.create({
        name: "New blueprint",
        userId,
      });
      return blueprint;
    },
  ),
});

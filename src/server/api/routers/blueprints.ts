import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import userGuard from "../utils/user-guard";

export const blueprintsRouter = createTRPCRouter({
  getUserBlueprints: protectedProcedure
    .input(
      z.object({
        filter: z.string().optional(),
      }),
    )
    .query(async ({ ctx: { userId, db }, input }) => {
      console.log("getUserBlueprints runs");
      userGuard(userId);
      const blueprints = await db.blueprints
        .filter({
          userId,
          name: {
            $iContains: input.filter,
          },
        })
        .getMany();
      return blueprints;
    }),
  getUserBlueprintById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { userId, db }, input }) => {
      console.log("getUserBlueprintById runs");
      userGuard(userId);
      const blueprint = await db.blueprints
        .filter({
          id: input.id,
        })
        .getFirst();
      return blueprint;
    }),
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
  updateBlueprint: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required").optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx: { userId, db }, input }) => {
      console.log("updateBlueprint runs");
      userGuard(userId);

      const blueprint = await db.blueprints.update(input.id, {
        ...input,
      });
      return blueprint;
    }),
  deleteBlueprint: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx: { userId, db }, input }) => {
      console.log("deleteBlueprint runs");
      userGuard(userId);

      const blueprint = await db.blueprints.delete(input.id);
      return blueprint;
    }),
});

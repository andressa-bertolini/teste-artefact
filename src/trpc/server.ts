import { cache } from "react";
import { appRouter } from "@/server/routers/_app";

export const createCaller = cache(() =>
  appRouter.createCaller({}),
);

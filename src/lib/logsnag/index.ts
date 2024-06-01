import { LogSnag } from "@logsnag/next/server";
import { env } from "~/env.mjs";

// Initialize LogSnag
export const logsnag = new LogSnag({
  token: env.NEXT_PUBLIC_LOGSNAG_TOKEN,
  project: env.NEXT_PUBLIC_LOGSNAG_PROJECT,
  disableTracking: env.NEXT_PUBLIC_LOGSNAG_DISABLE_TRACKING === "1",
});

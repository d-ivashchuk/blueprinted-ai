import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    POSTGRES_PRISMA_URL:
      process.env.NODE_ENV === "production"
        ? z.string().url()
        : z.string().optional(),
    POSTGRES_URL_NON_POOLING:
      process.env.NODE_ENV === "production"
        ? z.string().url()
        : z.string().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    RESEND_API_KEY: z.string().optional(),

    TRIGGER_SECRET_KEY: z.string().optional(),
    TRIGGER_API_URL: z.string().optional(),

    LEMON_SQUEEZY_API_KEY: z.string().optional(),
    LEMON_SQUEEZY_STORE_ID: z.string().optional(),
    LEMON_SQUEEZY_WEBHOOK_SECRET: z.string().optional(),
    LEMON_SQUEEZY_WEBHOOK_URL: z.string().optional(),

    OPENAI_API_KEY: z.string().optional(),
    GROQ_API_KEY: z.string().optional(),

    CLERK_SECRET_KEY: z.string().optional(),
    CLERK_WH_SECRET: z.string().optional(),

    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),

    BLOB_READ_WRITE_TOKEN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_DEPLOYMENT_URL: z.string(),
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY: z.string(),

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().optional(),

    NEXT_PUBLIC_PLAUSIBLE_SELFHOSTED_URL: z.string().optional(),

    NEXT_PUBLIC_LOGSNAG_TOKEN: z.string(),
    NEXT_PUBLIC_LOGSNAG_PROJECT: z.string(),
    NEXT_PUBLIC_LOGSNAG_DISABLE_TRACKING: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    NODE_ENV: process.env.NODE_ENV,
    TRIGGER_SECRET_KEY: process.env.TRIGGER_API_KEY,
    TRIGGER_API_URL: process.env.TRIGGER_API_URL,
    LEMON_SQUEEZY_API_KEY: process.env.LEMON_SQUEEZY_API_KEY,
    LEMON_SQUEEZY_STORE_ID: process.env.LEMON_SQUEEZY_STORE_ID,
    LEMON_SQUEEZY_WEBHOOK_SECRET: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET,
    LEMON_SQUEEZY_WEBHOOK_URL: process.env.LEMON_SQUEEZY_WEBHOOK_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_DEPLOYMENT_URL: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
    NEXT_PUBLIC_PLAUSIBLE_SELFHOSTED_URL:
      process.env.NEXT_PUBLIC_PLAUSIBLE_SELFHOSTED_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY:
      process.env.NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WH_SECRET: process.env.CLERK_WH_SECRET,
    NEXT_PUBLIC_LOGSNAG_TOKEN: process.env.NEXT_PUBLIC_LOGSNAG_TOKEN,
    NEXT_PUBLIC_LOGSNAG_PROJECT: process.env.NEXT_PUBLIC_LOGSNAG_PROJECT,
    NEXT_PUBLIC_LOGSNAG_DISABLE_TRACKING:
      process.env.NEXT_PUBLIC_LOGSNAG_DISABLE_TRACKING,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});

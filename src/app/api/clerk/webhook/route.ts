import { type WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { env } from "~/env.mjs";
import { logsnag } from "~/lib/logsnag";
import { LogEvents } from "~/lib/logsnag/events";
import { resend } from "~/lib/resend";

const webhookSecret = env.CLERK_WH_SECRET ?? ``;

async function validateRequest(request: Request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

// Working with webhooks requires a stable tunnel from localhost to web.
// npx localtunnel --port 3000 --subdomain ez-gpt
// https://ez-gpt.loca.lt - is the exposed url.
// https://ez-gpt.loca.lt/api/clerk/webhook - is the tunnel url
//! There is a need to setup webhook on Clerk to point to the tunnel url

export async function POST(request: Request) {
  try {
    const payload = await validateRequest(request);
    switch (payload.type) {
      case "user.created":
        const firstName = payload.data.first_name;
        const email = payload.data.email_addresses[0]?.email_address;
        if (email) {
          const sentEmail = await resend.emails.send({
            from: "onboarding@easygpt.builders",
            to: email,
            subject: "Welcome to EasyGPT",
            html: `<p>Hi, ${firstName}</p> <p>Welcome to EasyGPT. We're excited to have you on board!</p> `,
          });
          if (sentEmail.data) {
            await logsnag.track({
              ...LogEvents.OnboardingEmailSent,
              user_id: payload.data.id,
            });
          }
          const hasEmailErrored = sentEmail.error;
          if (hasEmailErrored) {
            console.log(`Error sending email to ${email}`);
            console.log(`Error: ${sentEmail.error?.message}`);
          }
        }
        if (!email) {
          console.log(`There is no email address for user ${payload.data.id}`);
        }
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
  // console.log(payload.data.email_addresses[0].email_address);
  return Response.json({ message: "Received" });
}

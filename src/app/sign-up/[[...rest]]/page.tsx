import { SignUp } from "@clerk/nextjs";
import { Zenitho } from "uvcanvas";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="absolute inset-0 block lg:hidden [&_canvas]:h-[100vh] [&_canvas]:w-[100vw]">
        <Zenitho />
      </div>
      <div className="flex justify-center">
        <SignUp
          routing="hash"
          unsafeMetadata={{
            role: "USER",
          }}
          forceRedirectUrl={"/projects/new"}
        />
      </div>
    </div>
  );
}

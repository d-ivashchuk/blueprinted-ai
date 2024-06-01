import { SignIn } from "@clerk/nextjs";
import { Zenitho } from "uvcanvas";

export default async function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="absolute inset-0 block lg:hidden [&_canvas]:h-[100vh] [&_canvas]:w-[100vw]">
        <Zenitho />
      </div>
      <div>
        <SignIn routing="hash" forceRedirectUrl={"/projects/new"} />
      </div>
    </div>
  );
}

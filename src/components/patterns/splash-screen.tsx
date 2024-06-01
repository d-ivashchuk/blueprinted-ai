import { Loader2 } from "lucide-react";
import React from "react";

const SplashScreen = () => {
  return (
    <div className="-mt-5 flex h-screen flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl">EasyGPT</h1>
        <h2 className="text-wrap text-xl text-muted-foreground">
          Your inbound lead generation on autopilot
        </h2>
      </div>
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default SplashScreen;

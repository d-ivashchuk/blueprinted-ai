import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/components/ui/tooltip";
import { Info } from "lucide-react";
import React from "react";

const Explainer = ({ text }: { text: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info className="h-4 w-4" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default Explainer;

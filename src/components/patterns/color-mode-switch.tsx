"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ColorModeSwitch() {
  const { setTheme, theme } = useTheme();

  const handleToggle = () => {
    setTheme(() => {
      if (theme === "light") return "dark";
      if (theme === "dark") return "light";
      return "light";
    });
  };

  return (
    <button className="flex items-center" onClick={() => handleToggle()}>
      {theme === "light" ? (
        <Moon className="h-4 w-4 " />
      ) : (
        <Sun className="h-4 w-4" />
      )}

      <span className="ml-2">
        {theme === "light" ? "Dark mode" : "Light mode"}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

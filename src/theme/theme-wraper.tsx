"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return <div className={currentTheme}>{children}</div>;
}
